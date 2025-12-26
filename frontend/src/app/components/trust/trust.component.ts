import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-trust',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trust.component.html',
  styleUrls: ['./trust.component.css']
})
export class TrustComponent implements OnInit, AfterViewInit {
  stats = [
    { value: 50, suffix: '+', label: 'Progetti Completati', icon: '🚀' },
    { value: 100, suffix: '%', label: 'Soddisfazione Clienti', icon: '⭐' },
    { value: 24, suffix: 'h', label: 'Tempo di Risposta', icon: '⚡' },
    { value: 10, suffix: '+', label: 'Anni di Esperienza', icon: '🎯' }
  ];

  displayValues: number[] = [0, 0, 0, 0];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.animateCounters();
    this.setupMobileObserver();
  }

  animateCounters(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Use a dummy object for GSAP animation
          const dummy = { value: 0 };
          
          gsap.to(dummy, {
            value: 1,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              this.stats.forEach((stat, index) => {
                this.displayValues[index] = Math.floor(stat.value * dummy.value);
              });
            }
          });
          
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const element = this.el.nativeElement.querySelector('.trust-container');
    if (element) {
      observer.observe(element);
    }
  }

  setupMobileObserver(): void {
    // Only run on mobile
    if (window.innerWidth >= 768) return;

    const cards = this.el.nativeElement.querySelectorAll('.mobile-trust-card');
    const options = {
      root: this.el.nativeElement.querySelector('.trust-container'),
      threshold: 0.7, // Trigger when 70% visible
      rootMargin: '0px -20% 0px -20%' // Narrower detection area for center focus
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active from all siblings
          cards.forEach((c: any) => c.classList.remove('active'));
          // Add active to current
          entry.target.classList.add('active');
        }
      });
    }, options);

    cards.forEach((card: any) => observer.observe(card));
  }
}
