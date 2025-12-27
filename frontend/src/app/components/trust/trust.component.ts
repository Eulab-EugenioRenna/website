import { Component, OnInit, AfterViewInit, ElementRef, signal } from '@angular/core';
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
  stats = signal([
    { value: 50, suffix: '+', label: 'Progetti Completati', icon: '🚀' },
    { value: 100, suffix: '%', label: 'Soddisfazione Clienti', icon: '⭐' },
    { value: 24, suffix: 'h', label: 'Tempo di Risposta', icon: '⚡' },
    { value: 10, suffix: '+', label: 'Anni di Esperienza', icon: '🎯' }
  ]);

  displayValues = signal<number[]>([0, 0, 0, 0]);

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
          const dummy = { value: 0 };
          
          gsap.to(dummy, {
            value: 1,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              const currentStats = this.stats();
              const newValues = currentStats.map(stat => Math.floor(stat.value * dummy.value));
              this.displayValues.set(newValues);
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
    if (window.innerWidth >= 768) return;

    const cards = this.el.nativeElement.querySelectorAll('.mobile-trust-card');
    const options = {
      root: this.el.nativeElement.querySelector('.trust-container'),
      threshold: 0.7,
      rootMargin: '0px -20% 0px -20%'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((c: any) => c.classList.remove('active'));
          entry.target.classList.add('active');
        }
      });
    }, options);

    cards.forEach((card: any) => observer.observe(card));
  }
}
