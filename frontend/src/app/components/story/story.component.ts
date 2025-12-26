import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements AfterViewInit, OnDestroy {
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

  isLineVisible = false;
  @ViewChild('timelineContainer') timelineContainer!: ElementRef;
  private scrollTriggers: ScrollTrigger[] = [];

  ngAfterViewInit() {
    this.setupGSAPTimeline();
  }

  setupGSAPTimeline() {
    const container = this.timelineContainer?.nativeElement;
    const currentYearDisplay = document.getElementById('currentStoryYearDisplay');
    
    if (!container) return;

    // 1. Animate Center Line
    const centerLine = container.querySelector('.timeline-center-line');
    if (centerLine) {
      const lineST = ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        onEnter: () => this.isLineVisible = true
      });
      this.scrollTriggers.push(lineST);
    }

    // 2. Animate Year Groups
    const yearGroups = container.querySelectorAll('.timeline-year-group');
    yearGroups.forEach((group: HTMLElement) => {
      const year = group.getAttribute('data-year');
      
      const yearST = ScrollTrigger.create({
        trigger: group,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => this.updateYearDisplay(year, currentYearDisplay),
        onEnterBack: () => this.updateYearDisplay(year, currentYearDisplay)
      });
      this.scrollTriggers.push(yearST);

      // Animate the year marker
      const marker = group.querySelector('.timeline-year-marker');
      if (marker) {
        gsap.from(marker, {
          scrollTrigger: {
            trigger: marker,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          },
          scale: 0.5,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        });
      }
    });

    // 3. Animate Timeline Items
    const items = container.querySelectorAll('.timeline-item');
    items.forEach((item: HTMLElement) => {
      const content = item.querySelector('.timeline-item-content');
      const dot = item.querySelector('.timeline-dot');
      const isLeft = item.classList.contains('side-left');

      if (content && dot) {
        gsap.from(content, {
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          },
          x: isLeft ? -50 : 50,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        });

        gsap.from(dot, {
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          duration: 0.4,
          ease: 'back.out(2)'
        });
      }
    });

    // 4. Global Timeline Visibility Control
    if (currentYearDisplay) {
        ScrollTrigger.create({
            trigger: container,
            start: 'top top+=200',
            end: 'bottom top+=100',
            onEnter: () => gsap.to(currentYearDisplay, { opacity: 0.2, duration: 0.3 }),
            onLeave: () => gsap.to(currentYearDisplay, { opacity: 0, duration: 0.3 }),
            onEnterBack: () => gsap.to(currentYearDisplay, { opacity: 0.2, duration: 0.3 }),
            onLeaveBack: () => gsap.to(currentYearDisplay, { opacity: 0, duration: 0.3 }) 
        });
    }

    ScrollTrigger.refresh();
  }

  updateYearDisplay(year: string | null, display: HTMLElement | null) {
    if (year && display) {
      display.textContent = year;
      gsap.fromTo(display, 
        { scale: 0.8, opacity: 0.1 }, 
        { scale: 1, opacity: 0.2, duration: 0.5, ease: 'power2.out' }
      );
    }
  }

  ngOnDestroy() {
    this.scrollTriggers.forEach(st => st.kill());
  }
}
