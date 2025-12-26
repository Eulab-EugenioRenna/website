import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService, Service } from '../../services/pocketbase.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  loading = true;
  showAllServices = false;
  
  // Modal State
  isModalOpen = false;
  selectedService: any = null;
  selectedTier: 'basic' | 'professional' | 'enterprise' = 'professional';
  tiers: ('basic' | 'professional' | 'enterprise')[] = ['basic', 'professional', 'enterprise'];

  // Fallback services if PocketBase is empty
  fallbackServices: Service[] = [
    {
      id: '1',
      name: 'Modern Web Solutions',
      slug: 'sviluppo-web-app',
      description: 'Applicazioni web veloci, scalabili e sicure sviluppate con le ultime tecnologie.',
      icon: '💻',
      features: ['Sviluppo Angular/React', 'Integrazioni API complesse', 'Cloud Native Ready', 'SEO Optimization'],
      pricing_tiers: {
        basic: { 
          price: '€1.200+', 
          features: ['Sito Landing-page', 'SEO Base', 'Hosting 1 Anno inclusi', 'Supporto via Email'] 
        },
        professional: { 
          price: '€3.500+', 
          features: ['E-commerce / CMS', 'SEO Avanzata', 'Dashboard Admin', 'Supporto Chat H24'] 
        },
        enterprise: { 
          price: 'Custom', 
          features: ['Architettura Microservizi', 'Multi-tenant', 'Scalabilità infinita', 'SLA Garantito'] 
        }
      },
      order: 1,
      created: '',
      updated: ''
    },
    {
      id: '2',
      name: 'Infrastrutture Cloud',
      slug: 'cloud-infrastructure',
      description: 'Architetture cloud robuste e scalabili per supportare la crescita della tua azienda.',
      icon: '☁️',
      features: ['AWS / GCP Management', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Monitoraggio 24/7'],
      pricing_tiers: {
        basic: { 
          price: '€600+', 
          features: ['Setup VPS', 'Backup Settimanali', 'Sito Statico', 'Supporto Base'] 
        },
        professional: { 
          price: '€1.800+', 
          features: ['High Availability', 'Auto-scaling', 'Database Managed', 'Monitoraggio Real-time'] 
        },
        enterprise: { 
          price: 'Custom', 
          features: ['Multi-region Setup', 'Hybrid Cloud', 'Security Audit Mensili', 'Architettura custom'] 
        }
      },
      order: 2,
      created: '',
      updated: ''
    },
    {
      id: '3',
      name: 'Smart Automation & AI',
      slug: 'ai-automation',
      description: 'Ottimizza i tuoi processi aziendali con workflow intelligenti e integrazioni AI.',
      icon: '🤖',
      features: ['Integrazione LLM (OpenAI)', 'Automazione N8N/Zapier', 'Chatbot Custom', 'Data Analysis'],
      pricing_tiers: {
        basic: { 
          price: '€900+', 
          features: ['Automazione base', '1 Workflow N8N', 'Email Automation', 'Training base'] 
        },
        professional: { 
          price: '€2.400+', 
          features: ['Integrazione OpenAI', 'Workflow complessi', 'DB Vector Integration', 'Maintenance 6 mesi'] 
        },
        enterprise: { 
          price: 'Custom', 
          features: ['Training Modelli Custom', 'AI Interna', 'RAG System Avanzato', 'Consulenza Strategica'] 
        }
      },
      order: 3,
      created: '',
      updated: ''
    }
  ];

  constructor(
    private pb: PocketbaseService,
    private scrollService: ScrollService
  ) {}

  async ngOnInit() {
    try {
      const records = await this.pb.getServices();
      this.services = records.map((r: any) => ({
        ...r,
        features: Array.isArray(r['features']) ? r['features'] : []
      })) as unknown as Service[];
      
      if (this.services.length === 0) {
        this.services = this.fallbackServices;
      }
      this.loading = false;
    } catch (error) {
      console.error('Error loading services:', error);
      this.services = this.fallbackServices;
      this.loading = false;
    }
  }

  toggleServices() {
    this.showAllServices = !this.showAllServices;
  }

  openPricingModal(service: any) {
    this.selectedService = service;
    this.selectedTier = 'professional';
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; 
  }

  closePricingModal() {
    this.isModalOpen = false;
    this.selectedService = null;
    document.body.style.overflow = 'auto'; 
  }

  scrollToContact() {
    this.closePricingModal();
    this.scrollService.scrollToSection('contact');
  }

  selectTier(tier: any) {
    this.selectedTier = tier;
  }

  getTierLabel(tier: string): string {
    switch(tier) {
      case 'basic': return 'Essential';
      case 'professional': return 'Growth';
      case 'enterprise': return 'Scale';
      default: return tier;
    }
  }
}
