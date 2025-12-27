import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PocketbaseService, BlogPost } from '../../services/pocketbase.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  // State using Signals
  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  
  currentPage = signal(1);
  perPage = 6;
  totalItems = signal(0);
  totalPages = signal(0);

  // For tag cloud
  allTags = signal<string[]>([]);

  constructor(public pb: PocketbaseService) {
    // React to tag filter OR search changes
    effect(() => {
      this.pb.blogTagFilter();
      this.pb.blogSearch();
      
      this.currentPage.set(1);
      this.loadPosts(true);
    }, { allowSignalWrites: true });
  }

  async ngOnInit() {
    this.loadAllAvailableTags();
  }

  async loadAllAvailableTags() {
    try {
      const result = await this.pb.client.collection('blog_posts').getFullList({
        filter: 'status = "published"',
        fields: 'tags'
      });
      const tagSet = new Set<string>();
      result.forEach(p => {
         const tags = p['tags'];
         if (Array.isArray(tags)) {
             tags.forEach((t: string) => tagSet.add(t));
         } else if (typeof tags === 'string') {
             // Handle case where it might be a comma separated string if saved differently
             tags.split(',').forEach(t => tagSet.add(t.trim()));
         }
      });
      this.allTags.set(Array.from(tagSet).filter(t => !!t).sort());
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }

  async loadPosts(reset = false) {
    if (reset) {
      this.loading.set(true);
    } else {
      this.loadingMore.set(true);
    }

    try {
      const result = await this.pb.getBlogPosts(this.currentPage(), this.perPage);
      
      const newPosts = result.items as unknown as BlogPost[];
      if (reset) {
        this.posts.set(newPosts);
      } else {
        this.posts.update(prev => [...prev, ...newPosts]);
      }

      this.totalItems.set(result.totalItems);
      this.totalPages.set(result.totalPages);

      // Trigger ScrollTrigger refresh
      setTimeout(() => {
        if (typeof window !== 'undefined') {
            (window as any).gsap?.getProperty && (window as any).ScrollTrigger?.refresh();
        }
      }, 200);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      this.loading.set(false);
      this.loadingMore.set(false);
    }
  }

  loadMore() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadPosts(false);
    }
  }

  onSearchChange(query: string) {
    this.pb.setBlogSearch(query);
  }

  selectTag(tag: string | null) {
    this.pb.setBlogTagFilter(tag);
  }

  clearAllFilters() {
    this.pb.setBlogTagFilter(null);
    this.pb.setBlogSearch('');
  }

  getImageUrl(post: BlogPost): string {
    return this.pb.resolveLogo(post);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  truncateExcerpt(excerpt: string | undefined, maxLength: number = 120): string {
    if (!excerpt) return '';
    return excerpt.length > maxLength 
      ? excerpt.substring(0, maxLength) + '...' 
      : excerpt;
  }
}
