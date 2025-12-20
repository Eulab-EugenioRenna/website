import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'eulab';
  currentYear = new Date().getFullYear();

  constructor() {
    this.initGlowEffect();
  }

  ngAfterViewInit() {
    this.initGlobalAnimations();
  }

  initGlobalAnimations() {
    // Reveal main sections as they enter the viewport
    const sections = ['app-hero', 'app-about', 'app-skills', 'app-projects', 'app-contact'];
    
    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out'
        });
      }
    });
  }

  initGlowEffect() {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--cursor-x', `${x}px`);
        document.documentElement.style.setProperty('--cursor-y', `${y}px`);
      });
    }
  }
}
