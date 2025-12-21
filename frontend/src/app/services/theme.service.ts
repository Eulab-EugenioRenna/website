import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeModeSubject = new BehaviorSubject<ThemeMode>('dark');
  themeMode$ = this.themeModeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
      if (savedTheme) {
        this.setTheme(savedTheme);
      } else {
        this.setTheme('dark'); // Default
      }

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (this.themeModeSubject.value === 'system') {
          this.applyTheme('system');
        }
      });
      
      this.loadCustomColors();
    }
  }

  setTheme(mode: ThemeMode) {
    this.themeModeSubject.next(mode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme-mode', mode);
      this.applyTheme(mode);
    }
  }

  private applyTheme(mode: ThemeMode) {
    if (!isPlatformBrowser(this.platformId)) return;

    let themeToApply = mode;
    if (mode === 'system') {
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', themeToApply);
  }

  setCustomColor(variable: string, value: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.style.setProperty(variable, value);
      const customColors = JSON.parse(localStorage.getItem('custom-colors') || '{}');
      customColors[variable] = value;
      localStorage.setItem('custom-colors', JSON.stringify(customColors));
    }
  }

  loadCustomColors() {
    if (isPlatformBrowser(this.platformId)) {
      const customColors = JSON.parse(localStorage.getItem('custom-colors') || '{}');
      Object.entries(customColors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value as string);
      });
    }
  }

  resetCustomColors() {
    if (isPlatformBrowser(this.platformId)) {
      const customColors = JSON.parse(localStorage.getItem('custom-colors') || '{}');
      Object.keys(customColors).forEach(key => {
        document.documentElement.style.removeProperty(key);
      });
      localStorage.removeItem('custom-colors');
    }
  }
}
