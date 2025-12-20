import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements AfterViewInit {
  ngAfterViewInit() {
    gsap.from('.contact-card', {
      scrollTrigger: {
        trigger: '.contact-card',
        start: 'top 95%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      scale: 0.95,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.contact-reveal', {
      scrollTrigger: {
        trigger: '.contact-card',
        start: 'top 95%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });
  }
}
