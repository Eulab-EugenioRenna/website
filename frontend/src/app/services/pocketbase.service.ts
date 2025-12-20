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
        // Assume PB is on the same host, port 8090 (or 443 if proxied, but 8090 is PB default)
        // If the user has a proxy, they might need to adjust this, but this is better than localhost
        pbUrl = `${window.location.protocol}//${hostname}${window.location.port ? ':' + window.location.port : ':8090'}`;
        
        // If we are on eulab.cloud without a port in the URL, we might still need 8090 
        // unless it's proxied to 80/443.
        if (!window.location.port && (hostname.includes('eulab.cloud'))) {
           pbUrl = `${window.location.protocol}//${hostname}:8090`;
        }
      }
    }
    
    this.pb = new PocketBase(pbUrl);
  }

  get client() {
    return this.pb;
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
