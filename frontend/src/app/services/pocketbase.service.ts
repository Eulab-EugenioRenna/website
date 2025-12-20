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
      
      console.log('--- POCKETBASE TELEMETRY ---');
      console.log('Location:', window.location.href);
      console.log('Hostname:', hostname);
      console.log('Protocol:', protocol);
      console.log('Port:', window.location.port);
      
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        if (hostname.includes('eulab.cloud')) {
          // Force port 8090 but allow protocol detection
          pbUrl = `${protocol}//${hostname}:8090`;
          
          // Debugging Tip: If this fails, try changing protocol to 'http:' manually or 'https:'
          console.warn('Production Mode: If you see "Mixed Content" errors, we need to proxy PB via HTTPS.');
        } else {
          pbUrl = `${protocol}//${hostname}${window.location.port ? ':' + window.location.port : ':8090'}`;
        }
      }
      
      console.log('Final PB URL:', pbUrl);
      console.log('--- END TELEMETRY ---');
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
