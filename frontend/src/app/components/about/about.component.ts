import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('aboutContent') aboutContent!: ElementRef;

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

    // Staggered cards reveal
    if (cards.length > 0) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }
  }
}
