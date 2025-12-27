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
    // Section entrance - reveal elements
    const revealElements = document.querySelectorAll('.about-reveal');
    if (revealElements.length > 0) {
      gsap.set(revealElements, { opacity: 0, y: 30 });
      
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top 80%',
        onEnter: () => {
          gsap.to(revealElements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            clearProps: 'all'
          });
        },
        once: true
      });
    }

    // Content cards - all cards including competencies
    const cards = document.querySelectorAll('.about-card');
    if (cards.length > 0) {
      gsap.set(cards, { opacity: 0, scale: 0.95, y: 20 });
      
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top 70%',
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'all'
          });
        },
        once: true
      });
    }
  }
}
