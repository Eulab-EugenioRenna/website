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
import { ThemeService } from './services/theme.service';
import { CustomizerComponent } from './components/customizer/customizer.component';
import { FooterComponent } from './components/footer/footer.component';

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
    ContactComponent,
    CustomizerComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'eulab';
  currentYear = new Date().getFullYear();

  constructor(private themeService: ThemeService) {
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
        // Global Reveal (enabled for both desktop and mobile)

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
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      
      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          mouseX = e.touches[0].clientX;
          mouseY = e.touches[0].clientY;
        }
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove, { passive: true });

      // Use GSAP ticker to move the element for maximum performance
      gsap.ticker.add(() => {
        gsap.set('.mouse-glow-layer', {
          x: mouseX,
          y: mouseY,
          force3D: true
        });
      });
    }
  }
}
