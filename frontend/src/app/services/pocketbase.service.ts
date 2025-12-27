import { Injectable, signal, computed } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';

export interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;
  logo?: string;
  tags?: string[];
  link?: string;
  work_date?: string;
  client?: string;
  created: string;
  updated: string;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  logo_url?: string;
  year?: number;
  created: string;
  updated: string;
}

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

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'generale' | 'prezzi' | 'supporto' | 'tecnico';
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

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {
  private pb: PocketBase;

  // Global Filter Signals
  projectFilter = signal<string | null>(null);
  projectTagFilter = signal<string | null>(null);
  projectSearch = signal<string>('');
  
  blogTagFilter = signal<string | null>(null);
  blogSearch = signal<string>('');

  constructor() {
    let pbUrl = 'http://localhost:8090';
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'eulab.cloud' || hostname.endsWith('.eulab.cloud')) {
        pbUrl = 'https://pb-web.eulab.cloud';
      } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        pbUrl = `http://${hostname}:8090`;
      }
    }
    this.pb = new PocketBase(pbUrl);
    this.pb.autoCancellation(false);
  }

  get client() {
    return this.pb;
  }

  setProjectFilter(clientId: string | null) {
    this.projectFilter.set(clientId);
  }

  setProjectTagFilter(tag: string | null) {
    this.projectTagFilter.set(tag);
  }

  setProjectSearch(query: string) {
    this.projectSearch.set(query);
  }

  setBlogTagFilter(tag: string | null) {
    this.blogTagFilter.set(tag);
  }

  setBlogSearch(query: string) {
    this.blogSearch.set(query);
  }

  getImageUrl(item: any, fileName: string) {
    if (!item || !fileName) return '';
    return this.pb.files.getUrl(item, fileName);
  }

  resolveLogo(item: any): string {
    if (!item) return '';

    // 1. PocketBase File
    if (item.logo || item.image) {
      return this.getImageUrl(item, item.logo || item.image);
    }

    // 2. Direct Logo URL
    if (item.logo_url) {
      return item.logo_url;
    }

    // 3. Logo.dev fallback using website domain
    if (item.website) {
      const token = (environment as any).logoDevToken;
      const domain = item.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
      return `https://img.logo.dev/${domain}?token=${token}&size=128&format=png`;
    }

    return '';
  }

  // Paginated & Filtered Methods
  async getProjects(page = 1, perPage = 6) {
    const filter = this.projectFilter();
    const tag = this.projectTagFilter();
    const search = this.projectSearch().toLowerCase().trim();
    
    let queryFilter = '';
    
    // Client relation filter
    if (filter) {
      queryFilter = `client = "${filter}"`;
    }

    // Tag filter
    if (tag) {
      const tagPart = `tags ~ "${tag}"`;
      queryFilter = queryFilter ? `${queryFilter} && ${tagPart}` : tagPart;
    }
    
    // Search query filter
    if (search) {
      const searchParts = `(name ~ "${search}" || description ~ "${search}" || tags ~ "${search}")`;
      queryFilter = queryFilter ? `${queryFilter} && ${searchParts}` : searchParts;
    }
    
    return await this.pb.collection('projects').getList(page, perPage, {
      filter: queryFilter,
      sort: '-work_date,name',
    });
  }

  async getBlogPosts(page = 1, perPage = 6) {
    const tag = this.blogTagFilter();
    const search = this.blogSearch().toLowerCase().trim();
    
    let queryFilter = 'status = "published"';
    
    if (tag) {
      queryFilter += ` && tags ~ "${tag}"`;
    }
    
    if (search) {
      queryFilter += ` && (title ~ "${search}" || excerpt ~ "${search}" || content ~ "${search}")`;
    }

    return await this.pb.collection('blog_posts').getList(page, perPage, {
      filter: queryFilter,
      sort: '-published_date',
    });
  }

  // Standard List Methods
  async getPartners() {
    return await this.pb.collection('partners').getFullList({ sort: '-created' });
  }
  
  async getClients() {
    return await this.pb.collection('clients').getFullList({ sort: '-created' });
  }

  async getTechStack() {
    return await this.pb.collection('tech_stack').getFullList({ sort: 'name' });
  }

  async getTestimonials() {
    return await (this.pb.collection('testimonials').getFullList({ sort: '-featured,order' }) as unknown as Testimonial[]);
  }

  async getServices() {
    return await (this.pb.collection('services').getFullList({ sort: 'order' }) as unknown as Service[]);
  }

  async getFAQs(category?: string) {
    const filter = category ? `category = "${category}"` : '';
    return await (this.pb.collection('faq').getFullList({ filter, sort: 'order' }) as unknown as FAQ[]);
  }

  async getBlogPostBySlug(slug: string) {
    try {
      return await (this.pb.collection('blog_posts').getFirstListItem(`slug = "${slug}" && status = "published"`) as unknown as BlogPost);
    } catch (error) {
      return null;
    }
  }

  async createLead(data: any) {
    return await this.pb.collection('leads').create(data);
  }
}
