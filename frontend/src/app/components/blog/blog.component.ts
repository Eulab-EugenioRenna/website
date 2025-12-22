import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService, BlogPost } from '../../services/pocketbase.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];
  loading = true;
  selectedTag: string | null = null;
  allTags: string[] = [];

  // Fallback blog posts
  fallbackPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Come l\'AI sta trasformando il business moderno',
      slug: 'ai-trasformazione-business',
      content: 'Contenuto completo dell\'articolo...',
      excerpt: 'Scopri come l\'intelligenza artificiale può automatizzare processi e migliorare l\'efficienza aziendale.',
      published_date: '2024-01-15',
      tags: ['AI', 'Business', 'Automazione'],
      status: 'published',
      author: 'EULAB Team',
      created: '',
      updated: ''
    },
    {
      id: '2',
      title: 'Guida completa a Docker per sviluppatori',
      slug: 'guida-docker-sviluppatori',
      content: 'Contenuto completo dell\'articolo...',
      excerpt: 'Impara a containerizzare le tue applicazioni e migliorare il deployment con Docker.',
      published_date: '2024-01-10',
      tags: ['Docker', 'DevOps', 'Tutorial'],
      status: 'published',
      author: 'EULAB Team',
      created: '',
      updated: ''
    },
    {
      id: '3',
      title: 'Cloud vs On-Premise: quale scegliere?',
      slug: 'cloud-vs-on-premise',
      content: 'Contenuto completo dell\'articolo...',
      excerpt: 'Analisi comparativa tra soluzioni cloud e infrastrutture on-premise per la tua azienda.',
      published_date: '2024-01-05',
      tags: ['Cloud', 'Infrastruttura', 'Business'],
      status: 'published',
      author: 'EULAB Team',
      created: '',
      updated: ''
    }
  ];

  constructor(private pb: PocketbaseService) {}

  async ngOnInit() {
    await this.loadPosts();
  }

  async loadPosts() {
    try {
      const data = await this.pb.getBlogPosts(6) as unknown as BlogPost[];
      this.posts = data.length > 0 ? data : this.fallbackPosts;
      this.extractTags();
    } catch (error) {
      console.error('Error loading blog posts:', error);
      this.posts = this.fallbackPosts;
      this.extractTags();
    } finally {
      this.loading = false;
    }
  }

  extractTags() {
    const tagSet = new Set<string>();
    this.posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tagSet.add(tag));
      }
    });
    this.allTags = Array.from(tagSet).sort();
  }

  get filteredPosts(): BlogPost[] {
    if (!this.selectedTag) return this.posts;
    return this.posts.filter(post => 
      post.tags && post.tags.includes(this.selectedTag!)
    );
  }

  selectTag(tag: string | null) {
    this.selectedTag = tag;
  }

  getImageUrl(post: BlogPost): string {
    if (post.cover_image) {
      return this.pb.getImageUrl(post, post.cover_image);
    }
    return '';
  }

  formatDate(dateString: string): string {
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
