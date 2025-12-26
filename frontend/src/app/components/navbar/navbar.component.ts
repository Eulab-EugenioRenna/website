import { Component, HostListener } from '@angular/core';
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
  isMenuOpen = false;
  currentTheme: ThemeMode = 'dark';

  constructor(
    public themeService: ThemeService,
    private scrollService: ScrollService
  ) {
    this.themeService.themeMode$.subscribe(mode => {
      this.currentTheme = mode;
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
    const currentIndex = modes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.setTheme(modes[nextIndex]);
  }

  toggleCustomizer() {
    // We'll implement this via an event or direct reference later
    const event = new CustomEvent('toggle-customizer');
    window.dispatchEvent(event);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Staggered entrance for menu links
      setTimeout(() => {
        gsap.from('.mobile-menu-link', {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power4.out'
        });
      }, 50);
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }
}
