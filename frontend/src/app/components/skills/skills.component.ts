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
  techStack: any[] = [];
  
  // New Story Milestones
  storyMilestones = [
    {
      year: 2020,
      title: 'Nascita di EULAB 🚀',
      description: 'EULAB muove i primi passi con la missione di semplificare la complessità tecnologica per le aziende.',
      icon: '🌱'
    },
    {
      year: 2021,
      title: 'Infrastrutture & Cloud ☁️',
      description: 'Primi grandi progetti di consolidamento server e migrazioni verso architetture cloud sicure.',
      icon: '🏗️'
    },
    {
      year: 2022,
      title: 'Espansione Digital 💻',
      description: 'Lancio della divisione Sviluppo Web per creare ecosistemi digitali integrati e performanti.',
      icon: '🌐'
    },
    {
      year: 2023,
      title: 'Intelligenza Artificiale 🤖',
      description: 'Integrazione dei primi workflow basati su AI e automazione avanzata dei processi.',
      icon: '✨'
    },
    {
      year: 2024,
      title: 'Oltre i Confini 📈',
      description: 'Consolidamento della leadership tecnica con focus su scalabilità, performance e innovazione continua.',
      icon: '🏆'
    }
  ];
  
  // Legacy, repurposed for story if needed
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

      setTimeout(() => {
        this.setupGSAPTimeline();
        this.setupClientsSlider();
      }, 500);
        
    } catch (error) {
      console.log('Backend not ready or empty', error);
    }
  }

  ngAfterViewInit() {}

  private clientsSliderAnim: gsap.core.Timeline | null = null;

  setupClientsSlider() {
    const track = document.querySelector('.clients-track');
    if (!track) return;

    if (this.clientsSliderAnim) {
      this.clientsSliderAnim.kill();
    }

    const items = track.querySelectorAll('.client-item');
    if (items.length === 0) return;

    const totalWidth = track.scrollWidth / 2;
    
    this.clientsSliderAnim = gsap.timeline({
      repeat: -1,
      defaults: { 
        ease: 'none', 
        duration: 35, 
        force3D: true, 
        autoRound: false 
      }
    });

    this.clientsSliderAnim.to(track, {
      x: -totalWidth,
    });

    track.addEventListener('mouseenter', () => this.clientsSliderAnim?.pause());
    track.addEventListener('mouseleave', () => this.clientsSliderAnim?.resume());
  }

  setupGSAPTimeline() {
    // Kill existing triggers to avoid duplicates
    this.scrollTriggers.forEach(st => st.kill());
    this.scrollTriggers = [];

    // 4. Animate Tech Stack Section Entrance
    const techGrid = document.querySelector('.grid-cols-2');
    if (techGrid) {
      gsap.from(techGrid, {
        scrollTrigger: {
          trigger: techGrid,
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
    this.scrollTriggers.forEach(st => st.kill());
    if (this.clientsSliderAnim) {
        this.clientsSliderAnim.kill();
    }
  }
}
