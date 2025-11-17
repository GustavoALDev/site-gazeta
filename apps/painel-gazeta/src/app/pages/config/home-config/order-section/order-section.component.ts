import { Component, OnInit, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface HomeSection {
  id: string;
  name: string;
  title: string;
  order: number;
  showTitle: boolean;
  icon: string;
}

@Component({
  selector: 'app-order-section',
  imports: [CommonModule],
  templateUrl: './order-section.component.html',
  styleUrl: './order-section.component.scss',
})
export class OrderSectionComponent implements OnInit {
  // Output para comunicar mudanças com o pai
  sectionsChange = output<HomeSection[]>();
  
  // Input para receber seções iniciais (para edição)
  initialSections = input<HomeSection[] | null>(null);
  
  sections = signal<HomeSection[]>([
    { id: 'carousel', name: 'Carrossel', title: 'Últimas Notícias', order: 1, showTitle: true, icon: 'view_carousel' },
    { id: 'videos', name: 'Vídeos', title: 'Vídeos em Alta', order: 2, showTitle: true, icon: 'play_circle' },
    { id: 'destaques', name: 'Destaques', title: 'Notícias em Destaque', order: 3, showTitle: true, icon: 'star' },
    { id: 'top-gazeta', name: 'Top Gazeta', title: 'Top Gazeta', order: 4, showTitle: true, icon: 'trending_up' },
    { id: 'cluster', name: 'Cluster de Notícias', title: 'Mais Lidas', order: 5, showTitle: true, icon: 'grid_view' },
  ]);

  ngOnInit() {
    const initial = this.initialSections();
    if (initial && initial.length > 0) {
      this.sections.set([...initial]);
    }
  }

  getSortedSections(): HomeSection[] {
    return [...this.sections()].sort((a, b) => a.order - b.order);
  }

  moveSection(index: number, direction: 'up' | 'down') {
    const sortedSections = this.getSortedSections();
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= sortedSections.length) {
      return;
    }

    // Troca as ordens
    const tempOrder = sortedSections[index].order;
    sortedSections[index].order = sortedSections[newIndex].order;
    sortedSections[newIndex].order = tempOrder;

    this.sections.set([...sortedSections]);
    this.emitSectionsChange();
  }

  updateSectionTitle(sectionId: string, newTitle: string) {
    const updatedSections = this.sections().map(section =>
      section.id === sectionId ? { ...section, title: newTitle } : section
    );
    this.sections.set(updatedSections);
    this.emitSectionsChange();
  }

  toggleSectionTitle(sectionId: string) {
    const updatedSections = this.sections().map(section =>
      section.id === sectionId ? { ...section, showTitle: !section.showTitle } : section
    );
    this.sections.set(updatedSections);
    this.emitSectionsChange();
  }

  private emitSectionsChange() {
    this.sectionsChange.emit(this.sections());
  }

  // Método público para reset
  reset() {
    this.sections.set([
      { id: 'carousel', name: 'Carrossel', title: 'Últimas Notícias', order: 1, showTitle: true, icon: 'view_carousel' },
      { id: 'destaques', name: 'Destaques', title: 'Notícias em Destaque', order: 3, showTitle: true, icon: 'star' },
      { id: 'videos', name: 'Vídeos', title: 'Vídeos em Alta', order: 2, showTitle: true, icon: 'play_circle' },
      { id: 'cluster', name: 'Cluster de Notícias', title: 'Mais Lidas', order: 5, showTitle: true, icon: 'grid_view' },
      { id: 'top-gazeta', name: 'Top Gazeta', title: 'Top Gazeta', order: 4, showTitle: true, icon: 'trending_up' },
    ]);
    this.emitSectionsChange();
  }
}
