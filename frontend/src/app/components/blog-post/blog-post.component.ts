import { Component, OnInit } from '@angular/core';
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
  post: BlogPost | null = null;
  isLoading = true;
  error: string | null = null;
  
  // Sidebar data
  allTags: string[] = [];
  recentPosts: BlogPost[] = [];
  archiveDates: string[] = []; // Strings like "January 2024"

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
    this.isLoading = true;
    this.error = null;
    try {
      // Need to cast the result to BlogPost as the service might return RecordModel
      this.post = await this.pb.getBlogPostBySlug(slug) as unknown as BlogPost;
    } catch (err) {
      console.error(err);
      this.error = 'Articolo non trovato.';
    } finally {
      this.isLoading = false;
      // Scroll to top when loading new post
      window.scrollTo(0, 0);
    }
  }

  async loadSidebarData() {
    try {
      // Fetch recent posts for sidebar
      const posts = await this.pb.getBlogPosts(50); // Fetch enough to build sidebar
      
      // Recent posts (top 5)
      this.recentPosts = posts.slice(0, 5) as unknown as BlogPost[];

      // Extract unique tags
      const tags = new Set<string>();
      posts.forEach(p => {
        if (p['tags'] && Array.isArray(p['tags'])) {
          p['tags'].forEach((t: string) => tags.add(t));
        }
      });
      this.allTags = Array.from(tags).sort();

      // Extract unique Month YYYY dates
      const dates = new Set<string>();
      posts.forEach(p => {
        if (p['published_date']) {
          const date = new Date(p['published_date']);
          const dateStr = date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
          // Capitalize first letter
          dates.add(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
        }
      });
      this.archiveDates = Array.from(dates);

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
