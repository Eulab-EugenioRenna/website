import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';
import { TrustComponent } from '../trust/trust.component';
import { ServicesComponent } from '../services/services.component';
import { ProcessComponent } from '../process/process.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { BlogComponent } from '../blog/blog.component';
import { FaqComponent } from '../faq/faq.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    TrustComponent,
    ServicesComponent,
    ProcessComponent,
    TestimonialsComponent,
    BlogComponent,
    FaqComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.initGlobalAnimations();
  }

  initGlobalAnimations() {
    // Reveal main sections as they enter the viewport
    const sections = [
      'app-hero', 
      'app-trust',
      'app-about', 
      'app-services',
      'app-process',
      'app-skills', 
      'app-projects',
      'app-testimonials',
      'app-blog',
      'app-faq',
      'app-contact'
    ];
    
    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
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

    // Refresh ScrollTrigger to ensure all positions are correct after view init
    ScrollTrigger.refresh();
  }
}
