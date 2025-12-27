import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
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
  @ViewChild('processWrapper') processWrapper!: ElementRef;
  @ViewChild('stepsContainer') stepsContainer!: ElementRef;
  @ViewChild('progressBar') progressBar!: ElementRef;

  steps = signal<ProcessStep[]>([
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
  ]);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Initial setup with a small delay to ensure rendering
    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }

  initAnimations(): void {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Mobile: engage participants as they scroll
      this.steps().forEach((_, index) => {
        gsap.from(`.process-step-${index}`, {
          scrollTrigger: {
            trigger: `.process-step-${index}`,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    } else {
      // Desktop: Stacking Cards Switching Logic
      const wrapper = this.processWrapper.nativeElement;
      const progressBar = this.progressBar.nativeElement;
      const cards = wrapper.querySelectorAll('.process-card');
      const markers = wrapper.querySelectorAll('.marker-dot');
      const totalSteps = cards.length;

      // 0. Kill existing ScrollTriggers
      ScrollTrigger.getAll().filter(st => st.vars.trigger === wrapper).forEach(st => st.kill());

      // 1. Setup the master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'center center',
          end: `+=${totalSteps * 1000}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // 2. Progress Bar
      tl.to(progressBar, { height: '100%', duration: totalSteps, ease: 'none' }, 0);

      // 3. Stacking Card Sequence
      cards.forEach((card: any, i: number) => {
        // Entrance
        tl.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, i);

        // Marker activation
        if (markers[i]) {
          tl.to(markers[i], {
            backgroundColor: '#3b82f6',
            scale: 1.5,
            duration: 0.2
          }, i);
        }

        // Exit (fade out stay/overlap)
        // We fade out the card before the NEXT one starts, or slightly overlapping
        if (i < totalSteps - 1) {
          tl.to(card, {
            opacity: 0,
            y: -40,
            scale: 0.95,
            filter: 'blur(10px)',
            duration: 0.5,
            ease: 'power2.in'
          }, i + 0.6); // Starts fading out at 60% of the slot duration

          if (markers[i]) {
            tl.to(markers[i], {
              backgroundColor: '#1e293b', // Reset to dark
              scale: 1,
              duration: 0.2
            }, i + 0.6);
          }
        }
      });
    }

    ScrollTrigger.refresh();
  }
}
