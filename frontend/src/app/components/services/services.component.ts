import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PocketbaseService, Service } from '../../services/pocketbase.service';
import { ScrollService } from '../../services/scroll.service';

type TierType = 'basic' | 'professional' | 'enterprise';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  // State using Signals
  services = signal<Service[]>([]);
  loading = signal(true);
  showAllServices = signal(false);
  isModalOpen = signal(false);
  selectedService = signal<Service | null>(null);
  selectedTier = signal<TierType>('basic');

  // Lead Funnel State
  isPricingUnlocked = signal(false);
  isSubmitting = signal(false);
  leadForm = {
    name: '',
    email: ''
  };

  tiers: TierType[] = ['basic', 'professional', 'enterprise'];

  constructor(
    private pb: PocketbaseService,
    private scrollService: ScrollService
  ) {}

  async ngOnInit() {
    // Check if prices already unlocked in this browser
    if (typeof window !== 'undefined') {
      const unlocked = localStorage.getItem('eulab_prices_unlocked');
      if (unlocked === 'true') {
        this.isPricingUnlocked.set(true);
      }
    }

    try {
      const data = await this.pb.getServices();
      this.services.set(data);
    } catch (error) {
      console.error('Error in ServicesComponent:', error);
    } finally {
      this.loading.set(false);
    }
  }

  toggleServices() {
    this.showAllServices.update(val => !val);
  }

  openPricingModal(service: Service) {
    this.selectedService.set(service);
    this.selectedTier.set('basic');
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closePricingModal() {
    this.isModalOpen.set(false);
    this.selectedService.set(null);
    document.body.style.overflow = 'auto';
  }

  selectTier(tier: TierType) {
    this.selectedTier.set(tier);
  }

  getTierLabel(tier: TierType): string {
    const labels: Record<TierType, string> = {
      basic: 'Essenziale',
      professional: 'Professionale',
      enterprise: 'Custom / Enterprise'
    };
    return labels[tier];
  }

  scrollToContact() {
    this.closePricingModal();
    this.scrollService.scrollToSection('contact');
  }

  async submitLead(event: Event) {
    event.preventDefault();
    if (!this.leadForm.name || !this.leadForm.email) return;

    this.isSubmitting.set(true);
    try {
      await this.pb.createLead({
        name: this.leadForm.name,
        email: this.leadForm.email,
        service_interest: this.selectedService()?.name,
        metadata: {
          browser: navigator.userAgent,
          unlocked_at: new Date().toISOString()
        }
      });

      // Unlock and persist
      this.isPricingUnlocked.set(true);
      localStorage.setItem('eulab_prices_unlocked', 'true');
    } catch (error) {
      console.error('Failed to submit lead:', error);
      // Even on error, we might want to unlock to not block the user, 
      // but let's be strict for now or show a message.
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
