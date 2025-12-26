import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('heroText') heroText!: ElementRef;
  @ViewChild('heroSub') heroSub!: ElementRef;
  @ViewChild('heroBtn') heroBtn!: ElementRef;
  @ViewChild('floatingCircle') floatingCircle!: ElementRef;

  constructor(private scrollService: ScrollService) {}

  scrollTo(section: string) {
    this.scrollService.scrollToSection(section);
  }

  ngAfterViewInit() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    tl.from(this.heroText.nativeElement, {
      y: 100,
      opacity: 0,
    })
    .from(this.heroSub.nativeElement, {
      y: 40,
      opacity: 0,
    }, '-=0.8')
    .from(this.heroBtn.nativeElement, {
      y: 20,
      opacity: 0,
    }, '-=0.6');

    // Subtle floating animation for background circle
    gsap.to(this.floatingCircle.nativeElement, {
      y: 30,
      x: 20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
}
