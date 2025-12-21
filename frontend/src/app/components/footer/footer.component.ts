import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="py-10 text-center text-gray-500 text-sm border-t border-white/5 bg-[#0f172a]">
      <div class="container mx-auto px-6">
        <p>© {{ currentYear }} EULAB. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
