import { Component, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = signal(false);
  
  // Use computed signal for theme from service if service supported it, 
  // but for now we bridge the existing observable if necessary, 
  // though let's check if ThemeService has signals.
  currentTheme = signal<ThemeMode>('dark');

  constructor(
    public themeService: ThemeService,
    private scrollService: ScrollService
  ) {
    // Bridge observable to signal for component reactivity
    this.themeService.themeMode$.subscribe(mode => {
      this.currentTheme.set(mode);
    });
  }

  scrollToSection(sectionId: string) {
    this.scrollService.scrollToSection(sectionId);
    this.closeMenu();
  }

  setTheme(mode: ThemeMode) {
    this.themeService.setTheme(mode);
  }

  toggleTheme() {
    const modes: ThemeMode[] = ['dark', 'light', 'system'];
    const currentIndex = modes.indexOf(this.currentTheme());
    const nextIndex = (currentIndex + 1) % modes.length;
    this.setTheme(modes[nextIndex]);
  }

  toggleMenu() {
    this.isMenuOpen.update(val => !val);
    if (this.isMenuOpen()) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        gsap.from('.mobile-menu-link', {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power4.out',
          clearProps: 'all'
        });
      }, 50);
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMenu() {
    this.isMenuOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768 && this.isMenuOpen()) {
      this.closeMenu();
    }
  }
}
