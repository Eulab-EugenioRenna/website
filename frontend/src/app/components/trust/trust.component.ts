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
  }

  animateCounters(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.stats.forEach((stat, index) => {
            gsap.to(this, {
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                const progress = gsap.getProperty(this, 'progress') as number || 0;
                this.displayValues[index] = Math.floor(stat.value * progress);
              },
              progress: 1
            });
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
}
