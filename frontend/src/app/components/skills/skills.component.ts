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
      
      // Group by Year
      const grouped = allClients.reduce((acc, item) => {
        const year = item.year || 2023; // Default to 2023 if missing
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(item);
        return acc;
      }, {} as Record<number, any[]>);

      // Convert to Array and Sort by Year Descending
      this.timeline = Object.keys(grouped)
        .map(year => ({ year: Number(year), items: grouped[Number(year)] }))
        .sort((a, b) => b.year - a.year);
        
    } catch (error) {
      console.log('Backend not ready or empty', error);
    }
  }

  ngAfterViewInit() {
    // Setup timeline scroll year tracking
    this.setupTimelineScrollTracking();
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
    
    const observer = new IntersectionObserver((entries) => {
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
    
    // Observe all year groups
    const yearGroups = timelineContainer.querySelectorAll('.timeline-year-group');
    yearGroups.forEach((group: Element) => {
      observer.observe(group);
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
