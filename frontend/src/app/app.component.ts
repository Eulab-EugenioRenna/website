import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CustomizerComponent } from './components/customizer/customizer.component';
import { FooterComponent } from './components/footer/footer.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeService } from './services/theme.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    NavbarComponent, 
    CustomizerComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
