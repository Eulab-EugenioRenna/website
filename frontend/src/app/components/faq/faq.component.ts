import { Component, OnInit, signal, computed } from '@angular/core';
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
  // Signal Form Pattern: Grouping form state into a single signal
  faqForm = signal({
    search: '',
    category: 'all'
  });

  // Data State
  faqs = signal<FAQ[]>([]);
  loading = signal(true);
  expandedIndex = signal<number | null>(null);

  categories = [
    { value: 'all', label: 'Tutte' },
    { value: 'generale', label: 'Generale' },
    { value: 'prezzi', label: 'Prezzi' },
    { value: 'supporto', label: 'Supporto' },
    { value: 'tecnico', label: 'Tecnico' }
  ];

  // Computed signal for filtered FAQs based on faqForm
  filteredFaqs = computed(() => {
    const data = this.faqs();
    const { search, category } = this.faqForm();
    const query = search.toLowerCase().trim();

    return data.filter(f => {
      const matchCategory = category === 'all' || f.category === category;
      const matchSearch = !query || 
        f.question.toLowerCase().includes(query) || 
        f.answer.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  });

  // Fallback FAQs
  private fallbackFaqs: FAQ[] = [
    {
      id: '1',
      question: 'Quanto tempo ci vuole per sviluppare un progetto?',
      answer: 'I tempi variano in base alla complessità del progetto. Un sito web semplice richiede 2-4 settimane, mentre una web app complessa può richiedere 2-6 mesi.',
      category: 'generale',
      order: 1,
      created: '',
      updated: ''
    },
    {
      id: '2',
      question: 'Quali sono le modalità di pagamento?',
      answer: 'Accettiamo pagamenti tramite bonifico bancario. Generalmente richiediamo un acconto del 30% all\'inizio, 40% a metà progetto e il saldo finale del 30% alla consegna.',
      category: 'prezzi',
      order: 1,
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
      const data = await this.pb.getFAQs();
      // Explicit casting to match our interface
      this.faqs.set(data.length > 0 ? (data as unknown as FAQ[]) : this.fallbackFaqs);
    } catch (error) {
      this.faqs.set(this.fallbackFaqs);
    } finally {
      this.loading.set(false);
    }
  }

  updateSearch(search: string) {
    this.faqForm.update(f => ({ ...f, search }));
    this.expandedIndex.set(null);
  }

  updateCategory(category: string) {
    this.faqForm.update(f => ({ ...f, category }));
    this.expandedIndex.set(null);
  }

  toggleFaq(index: number) {
    this.expandedIndex.update(current => current === index ? null : index);
  }

  scrollToContact() {
    this.scrollService.scrollToSection('contact');
  }

  resetFilters() {
    this.faqForm.set({ search: '', category: 'all' });
  }
}
