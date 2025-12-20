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
    this.detectDevice();
  }

  detectDevice() {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      const isChrome = /Chrome|CriOS/i.test(ua);

      if (isMobile) document.documentElement.classList.add('is-mobile');
      if (isIOS) document.documentElement.classList.add('is-ios');
      if (isChrome) document.documentElement.classList.add('is-chrome');
    }
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
        // Fallback for mobile if visibility is an issue
        if (document.documentElement.classList.contains('is-mobile')) {
          gsap.set(element, { opacity: 1, y: 0 });
          return;
        }

        gsap.from(element, {
          scrollTrigger: {
            trigger: selector,
            start: 'top 98%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 40,
          duration: 1,
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
