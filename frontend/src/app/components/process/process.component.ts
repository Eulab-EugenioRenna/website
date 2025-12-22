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
      // Desktop: Horizontal scroll-triggered timeline
      const container = this.processContainer.nativeElement;
      
      // Animate the connecting line
      gsap.from('.process-line', {
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        },
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'none'
      });

      // Animate each step
      this.steps.forEach((_, index) => {
        const step = `.process-step-${index}`;
        
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 50,
          scale: 0.8,
          duration: 0.8,
          ease: 'back.out(1.7)'
        });

        // Animate the step number
        gsap.from(`${step} .step-number`, {
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          rotation: 180,
          duration: 0.6,
          delay: 0.2,
          ease: 'back.out(2)'
        });
      });
    }
  }
}
