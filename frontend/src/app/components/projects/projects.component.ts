import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService } from '../../services/pocketbase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  allProjects: any[] = [];
  projects: any[] = [];
  isLoading = true;
  selectedProjectIndex: number = -1;
  isModalOpen = false;
  activeFilterId: string | null = null;
  private filterSub: Subscription | undefined;

  constructor(private pb: PocketbaseService) {}

  async ngOnInit() {
    try {
      this.allProjects = await this.pb.getProjects();
      this.projects = [...this.allProjects]; // Initially show all
      
      // Subscribe to filter changes
      this.filterSub = this.pb.projectFilter$.subscribe(clientId => {
        this.activeFilterId = clientId;
        if (clientId) {
          this.projects = this.allProjects.filter(p => p.client === clientId);
        } else {
          this.projects = [...this.allProjects];
        }
      });

    } catch (error) {
      console.log('No projects found or backend not ready, using fallback UI');
    } finally {
      this.isLoading = false;
    }
  }

  clearFilter() {
    this.pb.setProjectFilter(null);
  }

  openModal(index: number) {
    this.selectedProjectIndex = index;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; 
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProjectIndex = -1;
    document.body.style.overflow = 'auto';
  }

  nextProject(e?: Event) {
    e?.stopPropagation();
    if (this.selectedProjectIndex < this.projects.length - 1) {
      this.selectedProjectIndex++;
    } else {
      this.selectedProjectIndex = 0; 
    }
  }

  prevProject(e?: Event) {
    e?.stopPropagation();
    if (this.selectedProjectIndex > 0) {
      this.selectedProjectIndex--;
    } else {
      this.selectedProjectIndex = this.projects.length - 1; 
    }
  }
  
  scrollToProjects() {
    const element = document.getElementById('projects-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  getImageUrl(collectionId: string, recordId: string, fileName: string) {
      return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}`;
  }
}
