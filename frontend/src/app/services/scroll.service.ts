import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(private router: Router) {}

  scrollToSection(sectionId: string, delay: number = 0) {
    if (sectionId === 'top') {
      if (this.router.url === '/') {
        gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power4.inOut', delay: delay / 1000 });
      } else {
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power4.inOut' });
          }, 300);
        });
      }
      return;
    }

    if (this.router.url === '/') {
      this.doScroll(sectionId, delay);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.doScroll(sectionId, 0);
        }, 300);
      });
    }
  }

  private doScroll(sectionId: string, delay: number) {
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, { 
        duration: 1.2, 
        scrollTo: { y: element, offsetY: 80 }, 
        ease: 'power4.inOut',
        delay: delay / 1000 
      });
    }
  }
}
