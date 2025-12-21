import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-customizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customizer.component.html',
  styleUrl: './customizer.component.css'
})
export class CustomizerComponent implements OnInit, OnDestroy {
  isOpen = false;

  presets = [
    { name: 'Classic Blue', primary: '#3b82f6', secondary: '#8b5cf6', tertiary: '#ec4899', glow: '#2563eb' },
    { name: 'Emerald Isle', primary: '#10b981', secondary: '#06b6d4', tertiary: '#3b82f6', glow: '#10b981' },
    { name: 'Golden Sun', primary: '#f59e0b', secondary: '#ef4444', tertiary: '#ec4899', glow: '#f59e0b' },
    { name: 'Cyberpunk', primary: '#f472b6', secondary: '#8b5cf6', tertiary: '#06b6d4', glow: '#f472b6' }
  ];

  private toggleListener: any;

  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.toggleListener = () => {
        this.isOpen = !this.isOpen;
      };
      window.addEventListener('toggle-customizer', this.toggleListener);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('toggle-customizer', this.toggleListener);
    }
  }

  applyPreset(preset: any) {
    this.themeService.setCustomColor('--primary-accent', preset.primary);
    this.themeService.setCustomColor('--secondary-accent', preset.secondary);
    this.themeService.setCustomColor('--tertiary-accent', preset.tertiary);
    
    // Smoothly update glows to match the primary selection
    this.themeService.setCustomColor('--glow-blue', `${preset.glow}26`); // 15% alpha
    this.themeService.setCustomColor('--glow-purple', `${preset.secondary}1f`); // 12% alpha
  }

  reset() {
    this.themeService.resetCustomColors();
  }
}
