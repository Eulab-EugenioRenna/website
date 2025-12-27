import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PocketbaseService, BlogPost } from '../../services/pocketbase.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit {
  // State using Signals
  post = signal<BlogPost | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  // Sidebar data signals
  allPosts = signal<BlogPost[]>([]);
  
  recentPosts = computed(() => this.allPosts().slice(0, 5));
  
  allTags = computed(() => {
    const tags = new Set<string>();
    this.allPosts().forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  });

  archiveDates = computed(() => {
    const dates = new Set<string>();
    this.allPosts().forEach(p => {
      const date = new Date(p.published_date);
      const dateStr = date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
      dates.add(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
    });
    return Array.from(dates);
  });

  constructor(
    private route: ActivatedRoute,
    private pb: PocketbaseService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPost(slug);
      }
    });

    this.loadSidebarData();
  }

  async loadPost(slug: string) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.pb.getBlogPostBySlug(slug) as unknown as BlogPost;
      this.post.set(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      this.error.set('Articolo non trovato.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadSidebarData() {
    try {
      const result = await this.pb.getBlogPosts(1, 50);
      this.allPosts.set(result.items as unknown as BlogPost[]);
    } catch (err) {
      console.error('Error loading sidebar data', err);
    }
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }
  
  getImageUrl(record: any, fileName: string) {
      return this.pb.getImageUrl(record, fileName);
  }
}
