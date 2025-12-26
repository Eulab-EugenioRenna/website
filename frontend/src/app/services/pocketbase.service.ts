import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {
  private pb: PocketBase;

  constructor() {
    let pbUrl = 'http://localhost:8090';
    
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      
      if (hostname === 'eulab.cloud' || hostname.endsWith('.eulab.cloud')) {
        pbUrl = 'https://pb-web.eulab.cloud';
      } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        // Local network access (IP or local hostname)
        // Use the same hostname but the default PocketBase port
        pbUrl = `http://${hostname}:8090`;
      }
    }
    
    this.pb = new PocketBase(pbUrl);
  }

  get client() {
    return this.pb;
  }

  // Centralized Image URL Generator
  getImageUrl(item: any, fileName: string) {
    if (!item || !fileName) return '';
    return this.pb.files.getUrl(item, fileName);
  }

  // Filter State
  private projectFilterSubject = new BehaviorSubject<string | null>(null);
  projectFilter$ = this.projectFilterSubject.asObservable();

  setProjectFilter(clientId: string | null) {
    this.projectFilterSubject.next(clientId);
  }

  async getProjects() {
    return await this.pb.collection('projects').getFullList({
      sort: '-work_date,name', // Sort by work date descending, then name
    });
  }

  async getPartners() {
    return await this.pb.collection('partners').getFullList({
      sort: '-created',
    });
  }
  
  async getClients() {
      return await this.pb.collection('clients').getFullList({
        sort: '-created',
      });
  }

  async getTechStack() {
    return await this.pb.collection('tech_stack').getFullList({
      sort: 'name',
    });
  }

  // New Collections Methods

  async getBlogPosts(limit?: number) {
    try {
      const records = await this.pb.collection('blog_posts').getList(1, limit || 50, {
        filter: 'status = "published"',
        sort: '-published_date',
      });
      return records.items;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  async getBlogPostBySlug(slug: string) {
    try {
      return await this.pb.collection('blog_posts').getFirstListItem(
        `slug = "${slug}" && status = "published"`
      );
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  }

  async getTestimonials() {
    try {
      return await this.pb.collection('testimonials').getFullList({
        sort: '-featured,order',
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  }

  async getServices() {
    try {
      return await this.pb.collection('services').getFullList({
        sort: 'order',
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  async getFAQs(category?: string) {
    try {
      const filter = category ? `category = "${category}"` : '';
      return await this.pb.collection('faq').getFullList({
        filter,
        sort: 'order',
      });
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  }
}

// Type Interfaces
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author?: string;
  published_date: string;
  tags?: string[];
  status: 'draft' | 'published';
  created: string;
  updated: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_company?: string;
  client_logo?: string;
  rating: number;
  quote: string;
  project_type?: string;
  featured?: boolean;
  order?: number;
  created: string;
  updated: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  features?: string[];
  pricing_tiers?: {
    basic?: { price: string; features: string[] };
    professional?: { price: string; features: string[] };
    enterprise?: { price: string; features: string[] };
  };
  order?: number;
  created: string;
  updated: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'generale' | 'prezzi' | 'supporto' | 'tecnico';
  order?: number;
  created: string;
  updated: string;
}

