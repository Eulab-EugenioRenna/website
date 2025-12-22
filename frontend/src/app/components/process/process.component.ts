import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: string;
  duration: string;
}

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit, AfterViewInit {
  @ViewChild('processContainer') processContainer!: ElementRef;
  @ViewChild('processWrapper') processWrapper!: ElementRef;
  @ViewChild('progressBar') progressBar!: ElementRef;

  steps: ProcessStep[] = [
    {
      number: 1,
      title: 'Consulenza Gratuita',
      description: 'Call di 30 minuti per capire le tue esigenze e obiettivi',
      icon: '📞',
      duration: '30 min'
    },
    {
      number: 2,
      title: 'Analisi & Preventivo',
      description: 'Studio approfondito e proposta dettagliata con tempi e costi',
      icon: '📋',
      duration: '2-3 giorni'
    },
    {
      number: 3,
      title: 'Sviluppo & Test',
      description: 'Implementazione della soluzione con aggiornamenti costanti',
      icon: '🛠️',
      duration: 'Variabile'
    },
    {
      number: 4,
      title: 'Deploy & Formazione',
      description: 'Rilascio in produzione e training per il tuo team',
      icon: '🚀',
      duration: '1-2 giorni'
    },
    {
      number: 5,
      title: 'Supporto Continuo',
      description: 'Assistenza tecnica e manutenzione post-lancio',
      icon: '🤝',
      duration: 'Sempre'
    }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  initAnimations(): void {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Mobile: Simple fade-in for each step
      this.steps.forEach((_, index) => {
        gsap.from(`.process-step-${index}`, {
          scrollTrigger: {
            trigger: `.process-step-${index}`,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
    } else {
      // Desktop: Pinned Sequential Timeline with Overlap
      const wrapper = this.processWrapper.nativeElement;
      const progressBar = this.progressBar.nativeElement;
      const cards = wrapper.querySelectorAll('.process-card');
      const totalSteps = cards.length;

      // 1. PINNING: Create a master timeline that pins the wrapper for enough scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'center center', // Pin when center of section hits center of viewport
          end: '+=4000', // Scroll for 4000px
          scrub: 0.5, // Smooth scrubbing
          pin: true,  // Pin the section while animating
          anticipatePin: 1
        }
      });

      // 2. PROGRESS BAR: Fills continuously as we scroll through the pinned area
      tl.to(progressBar, { height: '100%', duration: 1, ease: 'none' }, 0);

      // 3. CARDS SEQUENCE: Sequential overlap
      const stepDuration = 1 / totalSteps; 
      const markers = wrapper.querySelectorAll('.rounded-full.bg-slate-600');

      cards.forEach((card: any, i: number) => {
        // Calculate relative start time
        const startTime = i * stepDuration;
        const endTime = startTime + stepDuration;
        
        // Animate Marker
        if (markers[i]) {
            tl.to(markers[i], {
                backgroundColor: '#3b82f6', // blue-500
                scale: 1.5,
                duration: 0.1,
                ease: 'power1.out'
            }, startTime);
        }

        // Entrance: Fade In + Scale Up + Move Up
        tl.to(card, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: stepDuration * 0.5, // First half of the slot
          ease: 'power2.out'
        }, startTime);

        // Exit: Fade Out + Scale Down + Move Up (to clear)
        if (i < totalSteps) { 
           tl.to(card, {
            opacity: 0,
            scale: 0.9,
            y: -30,
            filter: 'blur(5px)',
            duration: stepDuration * 0.4,
            ease: 'power2.in'
          }, endTime - (stepDuration * 0.4)); 
        }
      });
    }
  }
}
