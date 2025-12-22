import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService, Service } from '../../services/pocketbase.service';

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

  // Fallback services if PocketBase is empty
  fallbackServices: Service[] = [
    {
      id: '1',
      name: 'AI & Automazione',
      slug: 'ai-automazione',
      description: 'Integrazione di intelligenza artificiale e workflow automatizzati per ottimizzare i processi aziendali',
      icon: '🤖',
      features: [
        'Chatbot AI personalizzati',
        'Automazione processi con N8N',
        'Analisi dati con ML',
        'Integrazione API AI (OpenAI, Claude, etc.)'
      ],
      pricing_tiers: {
        basic: {
          price: 'Da €1.500',
          features: ['Consulenza AI', 'Setup base automazione', '1 workflow personalizzato']
        },
        professional: {
          price: 'Da €3.500',
          features: ['Chatbot completo', '5+ workflow', 'Integrazione sistemi', 'Training team']
        },
        enterprise: {
          price: 'Su misura',
          features: ['Soluzione enterprise', 'Workflow illimitati', 'Supporto dedicato', 'SLA garantito']
        }
      },
      order: 1,
      created: '',
      updated: ''
    },
    {
      id: '2',
      name: 'Sviluppo Web App',
      slug: 'sviluppo-web',
      description: 'Applicazioni web moderne, performanti e scalabili con tecnologie all\'avanguardia',
      icon: '💻',
      features: [
        'Frontend moderno (Angular, React)',
        'Backend robusto (Node.js, PocketBase)',
        'Design responsive',
        'SEO ottimizzato'
      ],
      pricing_tiers: {
        basic: {
          price: 'Da €2.000',
          features: ['Landing page', 'Design responsive', 'SEO base', 'Hosting incluso 1 anno']
        },
        professional: {
          price: 'Da €5.000',
          features: ['Web app completa', 'Dashboard admin', 'Database', 'API custom', 'Manutenzione 6 mesi']
        },
        enterprise: {
          price: 'Su misura',
          features: ['Architettura scalabile', 'Microservizi', 'CI/CD', 'Supporto 24/7']
        }
      },
      order: 2,
      created: '',
      updated: ''
    },
    {
      id: '3',
      name: 'Cloud & Infrastruttura',
      slug: 'cloud-infrastruttura',
      description: 'Progettazione e gestione infrastrutture cloud e on-premise sicure e performanti',
      icon: '☁️',
      features: [
        'Setup server cloud (AWS, Azure, DigitalOcean)',
        'Containerizzazione Docker',
        'Backup automatici',
        'Monitoraggio 24/7'
      ],
      pricing_tiers: {
        basic: {
          price: 'Da €800',
          features: ['Setup server base', 'Docker setup', 'Backup settimanali', 'Monitoraggio base']
        },
        professional: {
          price: 'Da €2.000',
          features: ['Cluster Kubernetes', 'CI/CD pipeline', 'Backup giornalieri', 'Monitoring avanzato']
        },
        enterprise: {
          price: 'Su misura',
          features: ['Multi-cloud', 'Alta disponibilità', 'Disaster recovery', 'DevOps dedicato']
        }
      },
      order: 3,
      created: '',
      updated: ''
    },
    {
      id: '4',
      name: 'Assistenza IT',
      slug: 'assistenza-it',
      description: 'Supporto tecnico completo per la tua infrastruttura IT aziendale',
      icon: '🛠️',
      features: [
        'Help desk remoto',
        'Manutenzione sistemi',
        'Gestione reti aziendali',
        'Consulenza tecnica'
      ],
      pricing_tiers: {
        basic: {
          price: '€500/mese',
          features: ['Support 9-18', 'Risposta entro 4h', 'Manutenzione mensile', 'Report mensili']
        },
        professional: {
          price: '€1.200/mese',
          features: ['Support 8-20', 'Risposta entro 2h', 'Manutenzione settimanale', 'Monitoraggio proattivo']
        },
        enterprise: {
          price: 'Su misura',
          features: ['Support 24/7', 'Risposta immediata', 'IT Manager dedicato', 'SLA personalizzato']
        }
      },
      order: 4,
      created: '',
      updated: ''
    }
  ];

  selectedTier: 'basic' | 'professional' | 'enterprise' = 'professional';

  constructor(private pb: PocketbaseService) {}

  async ngOnInit() {
    await this.loadServices();
  }

  async loadServices() {
    try {
      const data = await this.pb.getServices() as unknown as Service[];
      this.services = data.length > 0 ? data : this.fallbackServices;
    } catch (error) {
      console.error('Error loading services:', error);
      this.services = this.fallbackServices;
    } finally {
      this.loading = false;
    }
  }

  selectTier(tier: string) {
    this.selectedTier = tier as 'basic' | 'professional' | 'enterprise';
  }

  getTierLabel(tier: string): string {
    const labels: Record<string, string> = {
      basic: 'Base',
      professional: 'Professional',
      enterprise: 'Enterprise'
    };
    return labels[tier] || tier;
  }
}
