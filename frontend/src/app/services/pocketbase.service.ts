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
      
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        // Production URL provided by the user
        pbUrl = 'https://pb-web.eulab.cloud';
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
}
