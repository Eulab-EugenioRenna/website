import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService, Testimonial } from '../../services/pocketbase.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  // State using Signals
  testimonials = signal<Testimonial[]>([]);
  loading = signal(true);
  currentIndex = signal(0);
  
  private autoPlayInterval: any;

  // Fallback testimonials
  private fallbackTestimonials: Testimonial[] = [
    {
      id: '1',
      client_name: 'Marco Rossi',
      client_company: 'Tech Solutions SRL',
      rating: 5,
      quote: 'Professionalità e competenza eccezionali. Il progetto è stato completato nei tempi previsti e ha superato le nostre aspettative.',
      project_type: 'Web Application',
      featured: true,
      order: 1,
      created: '',
      updated: ''
    },
    {
      id: '2',
      client_name: 'Laura Bianchi',
      client_company: 'Digital Marketing Pro',
      rating: 5,
      quote: 'Ottima esperienza! Il team ha saputo interpretare perfettamente le nostre esigenze e proporre soluzioni innovative.',
      project_type: 'Automazione AI',
      featured: true,
      order: 2,
      created: '',
      updated: ''
    }
  ];

  constructor(private pb: PocketbaseService) {}

  async ngOnInit() {
    try {
      const data = await this.pb.getTestimonials();
      this.testimonials.set(data.length > 0 ? (data as unknown as Testimonial[]) : this.fallbackTestimonials);
      this.startAutoPlay();
    } catch (error) {
      this.testimonials.set(this.fallbackTestimonials);
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay(); // Safety
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 6000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  next() {
    const total = this.testimonials().length;
    if (total > 0) {
      this.currentIndex.update(current => (current + 1) % total);
    }
  }

  prev() {
    const total = this.testimonials().length;
    if (total > 0) {
      this.currentIndex.update(current => (current - 1 + total) % total);
    }
  }

  goTo(index: number) {
    this.currentIndex.set(index);
    this.startAutoPlay(); // Restart timer
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  getImageUrl(testimonial: Testimonial): string {
    return testimonial.client_logo ? this.pb.getImageUrl(testimonial, testimonial.client_logo) : '';
  }
}
