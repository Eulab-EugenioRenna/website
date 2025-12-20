import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService } from '../../services/pocketbase.service';
import { environment } from '../../../environments/environment';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
  isLineVisible = false;
  
  @ViewChild('timelineContainer') timelineContainer!: ElementRef;
  @ViewChild('timelineContent') timelineContent!: ElementRef;

  private scrollTriggers: ScrollTrigger[] = [];

  constructor(private pb: PocketbaseService) {}

  async ngOnInit() {
    try {
      this.partners = await this.pb.getPartners();
      this.clients = await this.pb.getClients();
      this.techStack = await this.pb.getTechStack();

      const allClients = [...this.clients, ...this.partners];
      allClients.sort((a, b) => (b.year || 2023) - (a.year || 2023));

      let globalIndex = 0;
      const grouped = allClients.reduce((acc, item) => {
        const year = item.year || 2023;
        if (!acc[year]) acc[year] = [];
        item.side = globalIndex % 2 === 0 ? 'left' : 'right';
        item.visible = true;
        acc[year].push(item);
        globalIndex++;
        return acc;
      }, {} as Record<number, any[]>);

      this.timeline = Object.keys(grouped)
        .map(year => ({ year: Number(year), items: grouped[Number(year)] }))
        .sort((a, b) => b.year - a.year);

      setTimeout(() => {
        this.setupGSAPTimeline();
        this.setupTechSlider();
      }, 500);
        
    } catch (error) {
      console.log('Backend not ready or empty', error);
    }
  }

  ngAfterViewInit() {
    // OnInit already handles initialization with a delay to ensure data is ready.
    // Removed redundant setupTechSlider call here to prevent animation stuttering.
  }

  private techSliderAnim: gsap.core.Timeline | null = null;

  setupTechSlider() {
    const track = document.querySelector('.logo-slide-track');
    if (!track) return;

    if (this.techSliderAnim) {
      this.techSliderAnim.kill();
    }

    const items = track.querySelectorAll('.tech-item');
    if (items.length === 0) return;

    const totalWidth = track.scrollWidth / 2;
    
    this.techSliderAnim = gsap.timeline({
      repeat: -1,
      defaults: { 
        ease: 'none', 
        duration: 45, // Increased for a smoother, slower feel
        force3D: true, // Hardware acceleration
        autoRound: false // Smoother sub-pixel movement
      }
    });

    this.techSliderAnim.to(track, {
      x: -totalWidth,
      // The timeline default duration (30) will be used
    });

    track.addEventListener('mouseenter', () => this.techSliderAnim?.pause());
    track.addEventListener('mouseleave', () => this.techSliderAnim?.resume());
    // Removed touch pause on mobile for continuous autoplay as requested
  }

  setupGSAPTimeline() {
    // Kill existing triggers to avoid duplicates
    this.scrollTriggers.forEach(st => st.kill());
    this.scrollTriggers = [];

    const container = this.timelineContainer?.nativeElement;
    const currentYearDisplay = document.getElementById('currentYearDisplay');
    
    if (!container) return;

    // Timeline Revealed for all devices

    // 1. Animate Center Line
    const centerLine = container.querySelector('.timeline-center-line');
    if (centerLine) {
      const lineST = ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        onEnter: () => this.isLineVisible = true
      });
      this.scrollTriggers.push(lineST);
    }

    // 2. Animate Year Groups and Update Year Display
    const yearGroups = container.querySelectorAll('.timeline-year-group');
    yearGroups.forEach((group: HTMLElement) => {
      const year = group.getAttribute('data-year');
      
      const yearST = ScrollTrigger.create({
        trigger: group,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => this.updateYearDisplay(year, currentYearDisplay),
        onEnterBack: () => this.updateYearDisplay(year, currentYearDisplay)
      });
      this.scrollTriggers.push(yearST);

      // Animate the year marker itself
      const marker = group.querySelector('.timeline-year-marker');
      if (marker) {
        gsap.from(marker, {
          scrollTrigger: {
            trigger: marker,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          },
          scale: 0.5,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        });
      }
    });

    // 3. Animate Timeline Items
    const items = container.querySelectorAll('.timeline-item');
    items.forEach((item: HTMLElement) => {
      const content = item.querySelector('.timeline-item-content');
      const dot = item.querySelector('.timeline-dot');
      const isLeft = item.classList.contains('side-left');

      if (content && dot) {
        // Animate content
        gsap.from(content, {
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          },
          x: isLeft ? -50 : 50,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        });

        // Animate dot
        gsap.from(dot, {
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          duration: 0.4,
          ease: 'back.out(2)'
        });
      }
    });

    // 4. Animate Tech Stack Section Entrance
    const techSlider = container.parentElement?.querySelector('.logo-slider');
    if (techSlider) {
      gsap.from(techSlider, {
        scrollTrigger: {
          trigger: techSlider,
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out'
      });
    }

    // Refresh ScrollTrigger to ensure all positions are correct
    ScrollTrigger.refresh();
  }

  updateYearDisplay(year: string | null, display: HTMLElement | null) {
    if (year && display) {
      display.textContent = year;
      gsap.fromTo(display, 
        { scale: 0.8, opacity: 0.1 }, 
        { scale: 1, opacity: 0.2, duration: 0.5, ease: 'power2.out' }
      );
    }
  }

  startAutoScroll() {
    // Smoothly scroll the whole page to the timeline
    const container = this.timelineContainer?.nativeElement;
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
      this.isAutoScrolling = true;
      // Auto-scrolling on the whole page is complex with GSAP, 
      // but we can simulate a slow scroll if really needed.
      // Usually, with smooth GSAP scrolling, the user won't need "Auto".
      // But let's add a simple page scroll.
      
      const scrollDuration = (document.documentElement.scrollHeight - window.scrollY) / 100; // approximation
      gsap.to(window, {
        scrollTo: { y: "max", autoKill: true },
        duration: scrollDuration,
        ease: "none",
        onComplete: () => { this.isAutoScrolling = false; }
      });
    }
  }

  clearAutoScroll() {
    gsap.killTweensOf(window);
    this.isAutoScrolling = false;
  }

  // Helper to get logo from Logo.dev
  getLogoDevUrl(domain: string): string {
    const token = (environment as any).logoDevToken;
    if (!domain) return '';
    let cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://img.logo.dev/${cleanDomain}?token=${token}&size=128&format=png`;
  }

  getPbImageUrl(item: any, fileName: string) {
    if (!item || !fileName) return '';
    return this.pb.client.files.getUrl(item, fileName);
  }

  // Smart image resolver: PB > Logo_url > Logo.dev > Fallback
  getLogo(item: any): string {
    if (item.logo) {
      return this.getPbImageUrl(item, item.logo);
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
