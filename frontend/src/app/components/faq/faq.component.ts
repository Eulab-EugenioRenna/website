import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PocketbaseService, FAQ } from '../../services/pocketbase.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqs: FAQ[] = [];
  filteredFaqs: FAQ[] = [];
  loading = true;
  selectedCategory: string = 'all';
  searchQuery: string = '';
  expandedIndex: number | null = null;

  categories = [
    { value: 'all', label: 'Tutte' },
    { value: 'generale', label: 'Generale' },
    { value: 'prezzi', label: 'Prezzi' },
    { value: 'supporto', label: 'Supporto' },
    { value: 'tecnico', label: 'Tecnico' }
  ];

  // Fallback FAQs
  fallbackFaqs: FAQ[] = [
    {
      id: '1',
      question: 'Quanto tempo ci vuole per sviluppare un progetto?',
      answer: 'I tempi variano in base alla complessità del progetto. Un sito web semplice richiede 2-4 settimane, mentre una web app complessa può richiedere 2-6 mesi. Durante la consulenza iniziale forniamo una stima precisa dei tempi.',
      category: 'generale',
      order: 1,
      created: '',
      updated: ''
    },
    {
      id: '2',
      question: 'Quali sono le modalità di pagamento?',
      answer: 'Accettiamo pagamenti tramite bonifico bancario. Generalmente richiediamo un acconto del 30% all\'inizio, 40% a metà progetto e il saldo finale del 30% alla consegna. Per progetti enterprise possiamo concordare piani di pagamento personalizzati.',
      category: 'prezzi',
      order: 1,
      created: '',
      updated: ''
    },
    {
      id: '3',
      question: 'Offrite supporto dopo il lancio del progetto?',
      answer: 'Sì! Tutti i nostri progetti includono un periodo di supporto post-lancio. Inoltre offriamo piani di manutenzione mensili che includono aggiornamenti, backup, monitoraggio e assistenza tecnica continua.',
      category: 'supporto',
      order: 1,
      created: '',
      updated: ''
    },
    {
      id: '4',
      question: 'Quali tecnologie utilizzate?',
      answer: 'Utilizziamo tecnologie moderne e affidabili: Angular, React, Node.js, PocketBase per il backend, Docker per la containerizzazione, e cloud provider come AWS, Azure e DigitalOcean. Scegliamo sempre la tecnologia più adatta alle esigenze del progetto.',
      category: 'tecnico',
      order: 1,
      created: '',
      updated: ''
    },
    {
      id: '5',
      question: 'Posso richiedere modifiche durante lo sviluppo?',
      answer: 'Assolutamente sì. Lavoriamo in modo agile con feedback continui. Modifiche minori sono sempre benvenute. Per cambiamenti significativi che impattano tempi e costi, discutiamo insieme le implicazioni prima di procedere.',
      category: 'generale',
      order: 2,
      created: '',
      updated: ''
    },
    {
      id: '6',
      question: 'Fornite anche hosting e dominio?',
      answer: 'Sì, possiamo occuparci di tutto: registrazione dominio, configurazione hosting, SSL, email aziendali. Oppure possiamo lavorare con il vostro provider esistente. La scelta è vostra!',
      category: 'tecnico',
      order: 2,
      created: '',
      updated: ''
    },
    {
      id: '7',
      question: 'Quanto costa un sito web?',
      answer: 'I costi partono da €2.000 per un sito vetrina professionale, €5.000+ per web app complete. Il prezzo finale dipende da funzionalità, design personalizzato, integrazioni e complessità. Contattateci per un preventivo gratuito su misura.',
      category: 'prezzi',
      order: 2,
      created: '',
      updated: ''
    },
    {
      id: '8',
      question: 'Lavorate anche con clienti fuori Italia?',
      answer: 'Sì, lavoriamo con clienti in tutta Europa e oltre. Utilizziamo strumenti di collaborazione remota e siamo abituati a gestire progetti internazionali con comunicazione in italiano, inglese e altre lingue su richiesta.',
      category: 'generale',
      order: 3,
      created: '',
      updated: ''
    }
  ];

  constructor(
    private pb: PocketbaseService,
    private scrollService: ScrollService
  ) {}

  scrollToContact() {
    this.scrollService.scrollToSection('contact');
  }

  async ngOnInit() {
    await this.loadFaqs();
  }

  async loadFaqs() {
    try {
      const data = await this.pb.getFAQs() as unknown as FAQ[];
      this.faqs = data.length > 0 ? data : this.fallbackFaqs;
      this.filterFaqs();
    } catch (error) {
      console.error('Error loading FAQs:', error);
      this.faqs = this.fallbackFaqs;
      this.filterFaqs();
    } finally {
      this.loading = false;
    }
  }

  filterFaqs() {
    let filtered = this.faqs;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
      );
    }

    this.filteredFaqs = filtered;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.expandedIndex = null;
    this.filterFaqs();
  }

  onSearchChange() {
    this.expandedIndex = null;
    this.filterFaqs();
  }

  toggleFaq(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
