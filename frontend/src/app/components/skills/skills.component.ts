import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService } from '../../services/pocketbase.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  partners: any[] = [];
  clients: any[] = [];
  
  // Tech Stack (Dynamic from PB)
  techStack: any[] = [];
  
  // Timeline Data
  timeline: { year: number, items: any[] }[] = [];
  
  // Auto-scroll state
  isAutoScrolling = false;
  scrollInterval: any;
  isLineVisible = false;
  
  @ViewChild('timelineContainer') timelineContainer!: ElementRef;
  @ViewChild('timelineContent') timelineContent!: ElementRef;

  constructor(private pb: PocketbaseService) {}

  async ngOnInit() {
    try {
      // Fetch all data
      this.partners = await this.pb.getPartners();
      this.clients = await this.pb.getClients();
      this.techStack = await this.pb.getTechStack();

      // Combine partners and clients effectively if user considers them merged, 
      // but migration separates them? The user said "Partner e clienti diventa solo clienti".
      // We will treat all as clients for the timeline. 
      // If the migration merge didn't apply to existing data, we merge manually here safely.
      const allClients = [...this.clients, ...this.partners];
      
      // Sort all clients by year first
      allClients.sort((a, b) => (b.year || 2023) - (a.year || 2023));

      // Group by Year and assign sides
      let globalIndex = 0;
      const grouped = allClients.reduce((acc, item) => {
        const year = item.year || 2023;
        if (!acc[year]) {
          acc[year] = [];
        }
        // Assign side based on global index for perfect alternating pattern
        item.side = globalIndex % 2 === 0 ? 'left' : 'right';
        item.visible = false;
        acc[year].push(item);
        globalIndex++;
        return acc;
      }, {} as Record<number, any[]>);

      // Convert to Array and Sort by Year Descending
      this.timeline = Object.keys(grouped)
        .map(year => ({ year: Number(year), items: grouped[Number(year)] }))
        .sort((a, b) => b.year - a.year);

      // Setup tracking after a short delay to ensure DOM is ready
      setTimeout(() => {
        this.setupTimelineScrollTracking();
      }, 500);
        
    } catch (error) {
      console.log('Backend not ready or empty', error);
    }
  }

  ngAfterViewInit() {
    // We already call it in ngOnInit after data load, 
    // but just in case data was somehow already there or for static content:
    if (this.timeline.length > 0) {
      this.setupTimelineScrollTracking();
    }
  }

  startAutoScroll() {
    if (this.isAutoScrolling) return;
    
    this.isAutoScrolling = true;
    const container = this.timelineContainer?.nativeElement;
    const content = this.timelineContent?.nativeElement;
    
    if (!container || !content) {
      this.isAutoScrolling = false;
      return;
    }
    
    this.scrollInterval = setInterval(() => {
      if (container && content) {
        const currentScroll = container.scrollTop;
        const maxScroll = content.scrollHeight - container.clientHeight;
        
        // If we've reached the bottom, stop scrolling
        if (currentScroll >= maxScroll - 10) {
          this.clearAutoScroll();
          return;
        }
        
        // Smooth scrolling
        container.scrollTop = currentScroll + 1;
      }
    }, 30);
  }

  clearAutoScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
    this.isAutoScrolling = false;
  }

  scrollToProjects() {
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  setupTimelineScrollTracking() {
    const timelineContainer = this.timelineContainer?.nativeElement;
    const currentYearDisplay = document.getElementById('currentYearDisplay');
    
    if (!timelineContainer || !currentYearDisplay) return;
    
    // Observer for year markers
    const yearObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const year = entry.target.getAttribute('data-year');
          if (year) {
            currentYearDisplay.textContent = year;
            currentYearDisplay.style.opacity = '1';
          }
        }
      });
    }, {
      root: timelineContainer,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0.1
    });

    // Observer for reveal on scroll
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          if (target.classList.contains('timeline-center-line')) {
            this.isLineVisible = true;
          } else if (target.getAttribute('data-id')) {
            const id = target.getAttribute('data-id');
            this.timeline.forEach(group => {
              const item = group.items.find(i => i.id === id);
              if (item) item.visible = true;
            });
          }
        }
      });
    }, {
      root: timelineContainer,
      rootMargin: '0px 0px -5% 0px',
      threshold: 0.05
    });
    
    // Observe year groups
    const yearGroups = timelineContainer.querySelectorAll('.timeline-year-group');
    yearGroups.forEach((group: Element) => {
      yearObserver.observe(group);
    });

    // Observe center line
    const centerLine = timelineContainer.querySelector('.timeline-center-line');
    if (centerLine) revealObserver.observe(centerLine);

    // Observe items
    const items = timelineContainer.querySelectorAll('.timeline-item');
    items.forEach((item: Element) => {
      revealObserver.observe(item);
    });
    
    // Set initial year
    if (yearGroups.length > 0) {
      const firstYear = yearGroups[0].getAttribute('data-year');
      if (firstYear) {
        currentYearDisplay.textContent = firstYear;
        currentYearDisplay.style.opacity = '1';
      }
    }
  }

  // Helper to get logo from Logo.dev
  getLogoDevUrl(domain: string): string {
    const token = (environment as any).logoDevToken;
    if (!domain) return '';
    let cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://img.logo.dev/${cleanDomain}?token=${token}&size=128&format=png`;
  }

  getPbImageUrl(collectionId: string, recordId: string, fileName: string) {
    return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}`;
  }

  // Smart image resolver: PB > Logo_url > Logo.dev > Fallback
  getLogo(item: any): string {
    if (item.logo) {
      return this.getPbImageUrl(item.collectionId, item.id, item.logo);
    }
    if (item.logo_url) {
      return item.logo_url;
    }
    if (item.website) {
       return this.getLogoDevUrl(item.website);
    }
    return ''; 
  }

  filterProjectsByClient(clientId: string) {
    this.pb.setProjectFilter(clientId);
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy() {
    this.clearAutoScroll();
  }
}
