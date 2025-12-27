import { Component, OnInit, AfterViewInit, signal, computed, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PocketbaseService, Project } from '../../services/pocketbase.service';
import { ScrollService } from '../../services/scroll.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  // State using Signals
  projects = signal<Project[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  
  currentPage = signal(1);
  perPage = 6;
  totalItems = signal(0);
  totalPages = signal(0);

  selectedProjectIndex = signal(-1);
  isModalOpen = signal(false);

  private projectTriggers: ScrollTrigger[] = [];

  constructor(
    public pb: PocketbaseService,
    private scrollService: ScrollService
  ) {
    // React to filter OR search changes
    effect(() => {
      // Accessing signals to track changes
      this.pb.projectFilter();
      this.pb.projectTagFilter();
      this.pb.projectSearch();
      
      // Safety: Close modal if open on filter change
      this.closeModal();
      
      // Reset to page 1
      this.currentPage.set(1);
      
      // Perform initial load/reload
      this.loadProjects(true);
    }, { allowSignalWrites: true });
  }

  async ngOnInit() {}

  ngAfterViewInit() {
    this.animateProjects();
  }

  async loadProjects(reset = false) {
    if (reset) {
        this.loading.set(true);
    } else {
        this.loadingMore.set(true);
    }

    try {
      const result = await this.pb.getProjects(this.currentPage(), this.perPage);
      
      const items = result.items as unknown as Project[];
      if (reset) {
        this.projects.set(items);
      } else {
        this.projects.update(prev => [...prev, ...items]);
      }

      this.totalItems.set(result.totalItems);
      this.totalPages.set(result.totalPages);
      
      // Trigger animation after content is rendered
      setTimeout(() => this.animateProjects(), 150);
    } catch (error) {
      console.log('Error loading projects:', error);
    } finally {
      this.loading.set(false);
      this.loadingMore.set(false);
    }
  }

  loadMore() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadProjects(false);
    }
  }

  onSearchChange(query: string) {
    this.pb.setProjectSearch(query);
  }

  animateProjects() {
    // 1. Kill previous card triggers to avoid overlaps/memory leaks
    this.projectTriggers.forEach(st => st.kill());
    this.projectTriggers = [];

    // 2. Refresh ScrollTrigger to account for new content positions
    ScrollTrigger.refresh();
    
    const cards = document.querySelectorAll('.project-card-reveal');
    if (cards.length > 0) {
      const st = ScrollTrigger.create({
        trigger: cards[0],
        start: 'top 95%',
        onEnter: () => {
          gsap.from(cards, {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'all'
          });
        }
      });
      this.projectTriggers.push(st);
    }
  }

  clearAllFilters() {
    this.pb.setProjectFilter(null);
    this.pb.setProjectTagFilter(null);
    this.pb.setProjectSearch('');
  }

  openModal(index: number) {
    this.selectedProjectIndex.set(index);
    this.isModalOpen.set(true);
    if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden'; 
    }
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedProjectIndex.set(-1);
    if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
    }
  }

  nextProject(e?: Event) {
    e?.stopPropagation();
    const current = this.selectedProjectIndex();
    const total = this.projects().length;
    if (total > 0) {
        this.selectedProjectIndex.set((current + 1) % total);
    }
  }

  prevProject(e?: Event) {
    e?.stopPropagation();
    const current = this.selectedProjectIndex();
    const total = this.projects().length;
    if (total > 0) {
        this.selectedProjectIndex.set((current - 1 + total) % total);
    }
  }
  
  scrollToProjects() {
    this.scrollService.scrollToSection('projects-grid-start');
  }

  ngOnDestroy() {
    this.projectTriggers.forEach(st => st.kill());
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}
