import { Component, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollService } from '../../services/scroll.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  // Static content could be managed by signals for future reactivity
  stats = signal([
    { label: 'Cloud Migrations', value: '150+' },
    { label: 'Uptime Guaranteed', value: '99.9%' },
    { label: 'Security Audits', value: '200+' }
  ]);

  constructor(private scrollService: ScrollService) {}

  scrollToContact() {
    this.scrollService.scrollToSection('contact');
  }

  ngAfterViewInit() {
    this.initAnimations();
  }

  private initAnimations() {
    // Section entrance
    gsap.from('.about-reveal', {
      scrollTrigger: {
        trigger: '.about-reveal',
        start: 'top 95%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // Content cards
    gsap.from('.about-card', {
      scrollTrigger: {
        trigger: '.about-card',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }
}
