import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService } from '../../services/pocketbase.service';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, AfterViewInit {
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
      this.projects = [...this.allProjects];
      
      this.filterSub = this.pb.projectFilter$.subscribe((clientId: string | null) => {
        this.activeFilterId = clientId;
        if (clientId) {
          this.projects = this.allProjects.filter(p => p.client === clientId);
        } else {
          this.projects = [...this.allProjects];
        }
        // Animate after filter change
        setTimeout(() => this.animateProjects(), 100);
      });

    } catch (error) {
      console.log('No projects found or backend not ready, using fallback UI');
    } finally {
      this.isLoading = false;
    }
  }

  ngAfterViewInit() {
    this.animateProjects();
  }

  animateProjects() {
    const cards = document.querySelectorAll('.project-card');
    if (cards.length > 0) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all'
      });
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
