import { Component, OnInit, AfterViewInit, OnDestroy, signal, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService, Client } from '../../services/pocketbase.service';
import { ScrollService } from '../../services/scroll.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  // State using Signals
  clients = signal<Client[]>([]);
  techStack = signal<any[]>([]);
  
  private clientsSliderAnim: gsap.core.Timeline | null = null;
  private scrollTriggers: ScrollTrigger[] = [];

  constructor(
    private pb: PocketbaseService,
    private scrollService: ScrollService,
    private el: ElementRef
  ) {}

  async ngOnInit() {
    try {
      const [tech, clientData] = await Promise.all([
        this.pb.getTechStack(),
        this.pb.getClients()
      ]);
      
      this.techStack.set(tech);
      // Casting to our Client interface
      this.clients.set(clientData as unknown as Client[]);

      // Initialize animations after data is set and rendered
      setTimeout(() => {
        this.setupClientsSlider();
        this.setupAnimations();
      }, 150);
        
    } catch (error) {
      console.log('Backend connection failed', error);
    }
  }

  ngAfterViewInit() {}

  setupClientsSlider() {
    const track = document.querySelector('.clients-track');
    if (!track) return;

    if (this.clientsSliderAnim) {
      this.clientsSliderAnim.kill();
    }

    const items = track.querySelectorAll('.client-item');
    if (items.length === 0) return;

    // We only need to duplicate if we have enough items, 
    // but the template already does it.
    const totalWidth = track.scrollWidth / 2;
    
    this.clientsSliderAnim = gsap.timeline({
      repeat: -1,
      defaults: { 
        ease: 'none', 
        duration: 40, 
        force3D: true, 
      }
    });

    this.clientsSliderAnim.to(track, {
      x: -totalWidth,
    });

    track.addEventListener('mouseenter', () => this.clientsSliderAnim?.pause());
    track.addEventListener('mouseleave', () => this.clientsSliderAnim?.resume());
  }

  setupAnimations() {
    const techItems = this.el.nativeElement.querySelectorAll('.tech-item-wrapper');
    if (techItems.length > 0) {
      // Ensure items are initially invisible if GSAP is going to animate them
      // This helps avoid the "flash" then disappearance if the trigger is late
      gsap.set(techItems, { opacity: 0, scale: 0.5, y: 30 });

      const st = ScrollTrigger.create({
        trigger: this.el.nativeElement.querySelector('.tech-wall'),
        start: 'top 90%',
        onEnter: () => {
          gsap.to(techItems, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: {
              amount: 0.8,
              from: 'center'
            },
            ease: 'expo.out',
            clearProps: 'all' // Clear GSAP styles after animation to let CSS take over for hover
          });
        },
        once: true
      });
      this.scrollTriggers.push(st);
    }
  }

  getLogo(item: any): string {
    return this.pb.resolveLogo(item);
  }

  filterProjectsByClient(clientId: string) {
    if (!clientId) return;
    
    // 1. Set the global filter
    this.pb.setProjectFilter(clientId);
    
    // 2. Clear other project filters to avoid conflicts
    this.pb.setProjectTagFilter(null);
    this.pb.setProjectSearch('');
    
    // 3. Scroll to projects section
    this.scrollService.scrollToSection('projects');
  }

  filterProjectsByTag(tag: string) {
    if (!tag) return;
    
    // 1. Set the global tag filter
    this.pb.setProjectTagFilter(tag);
    
    // 2. Clear client filter to avoid narrow results
    this.pb.setProjectFilter(null);
    this.pb.setProjectSearch('');
    
    // 3. Scroll to projects section
    this.scrollService.scrollToSection('projects');
  }

  ngOnDestroy() {
    this.scrollTriggers.forEach(st => st.kill());
    if (this.clientsSliderAnim) {
        this.clientsSliderAnim.kill();
    }
  }
}
