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
  showAllServices = false;

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
      order: 4,
      created: '',
      updated: ''
    },
    {
        id: '5',
        name: 'Cybersecurity',
        slug: 'cybersecurity',
        description: 'Protezione degli asset digitali e dei dati aziendali',
        icon: '🛡️',
        features: [
          'Vulnerability assessment',
          'Penetration testing',
          'Configurazione firewall',
          'Formazione sicurezza team'
        ],
        order: 5,
        created: '',
        updated: ''
      }
  ];

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

  toggleServices() {
    this.showAllServices = !this.showAllServices;
  }
}
