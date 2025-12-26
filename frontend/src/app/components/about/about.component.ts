import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  constructor(private scroller: ViewportScroller) {}

  scrollToContact() {
    this.scroller.scrollToAnchor('contact');
  }

  ngAfterViewInit() {
    const cards = document.querySelectorAll('.about-card');

    // Animate section title and content
    gsap.from('.about-reveal', {
      scrollTrigger: {
        trigger: '.about-reveal',
        start: 'top 95%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // 2. Individual card reveals for better mobile reliability
    cards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  }
}
