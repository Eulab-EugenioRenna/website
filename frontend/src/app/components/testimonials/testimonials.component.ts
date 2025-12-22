import { Component, OnInit, OnDestroy } from '@angular/core';
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
  testimonials: Testimonial[] = [];
  loading = true;
  currentIndex = 0;
  autoPlayInterval: any;

  // Fallback testimonials
  fallbackTestimonials: Testimonial[] = [
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
    },
    {
      id: '3',
      client_name: 'Giuseppe Verdi',
      client_company: 'Manifattura Italiana',
      rating: 5,
      quote: 'Supporto tecnico impeccabile e sempre disponibile. Hanno risolto problemi complessi con grande efficienza.',
      project_type: 'Infrastruttura Cloud',
      featured: true,
      order: 3,
      created: '',
      updated: ''
    }
  ];

  constructor(private pb: PocketbaseService) {}

  async ngOnInit() {
    await this.loadTestimonials();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  async loadTestimonials() {
    try {
      const data = await this.pb.getTestimonials() as unknown as Testimonial[];
      this.testimonials = data.length > 0 ? data : this.fallbackTestimonials;
    } catch (error) {
      console.error('Error loading testimonials:', error);
      this.testimonials = this.fallbackTestimonials;
    } finally {
      this.loading = false;
    }
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev() {
    this.currentIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
  }

  goTo(index: number) {
    this.currentIndex = index;
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  getImageUrl(testimonial: Testimonial): string {
    if (testimonial.client_logo) {
      return this.pb.getImageUrl(testimonial, testimonial.client_logo);
    }
    return '';
  }
}
