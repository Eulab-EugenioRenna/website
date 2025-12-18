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
    // Connect to the backend container (localhost when running in browser)
    this.pb = new PocketBase('http://localhost:8090');
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
