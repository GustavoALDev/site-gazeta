import { Component, signal, computed, input, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News } from '@site-gazeta/models';
import { mockCategories } from '@site-gazeta/mock';
import { Category } from '@site-gazeta/models';


@Component({
  selector: 'lib-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnInit, OnDestroy {
  @ViewChild('carouselWrapper', { static: false }) carouselWrapper!: ElementRef<HTMLElement>;
  // Input para receber notícias externamente
  news = input<News[]>([]);

  // Estado do carousel usando signals
  private currentIndex = signal(0);
  private itemsPerView = signal(3); // 3 itens visíveis no desktop
  protected isDragging = signal(false);
  private startX = signal(0);
  private currentX = signal(0);
  private categories = signal<Category[]>(mockCategories);
  // Dados mock das notícias (fallback) - usando modelo News completo
  
  // Computed que usa input ou fallback para mock
  newsItems = computed(() => {
    const inputItems = this.news();
    return inputItems
  });

  // Computed properties
  totalItems = computed(() => this.newsItems().length);
  
  // Para carrossel infinito, sempre podemos navegar
  canGoPrevious = computed(() => true);
  canGoNext = computed(() => true);

  // Métodos de navegação com loop infinito
  goToPrevious(): void {
    this.currentIndex.update(index => {
      const newIndex = index - 1;
      return newIndex < 0 ? this.totalItems() - 1 : newIndex;
    });
  }

  goToNext(): void {
    this.currentIndex.update(index => {
      const newIndex = index + 1;
      return newIndex >= this.totalItems() ? 0 : newIndex;
    });
  }

  // Computed para itens visíveis com loop infinito
  visibleItems = computed(() => {
    const items = this.newsItems();
    const totalItems = items.length;
    const start = this.currentIndex();
    const itemsToShow = this.itemsPerView();
    const visibleItems: News[] = [];

    for (let i = 0; i < itemsToShow; i++) {
      const index = (start + i) % totalItems;
      visibleItems.push(items[index]);
    }

    return visibleItems;
  });

  // Computed para verificar se um item está na posição central
  isCenterItem = computed(() => {
    return (visibleIndex: number) => {
      return visibleIndex === 1; // Sempre a segunda posição (índice 1) é o centro
    };
  });

  // Helpers para extrair dados do modelo News
  getImageUrl(item: News): string {
    return item.mediaNews?.[0]?.imgSize?.original || '';
  }

  getTags(item: News): string[] {
   
    const categoryMap = this.categories();
    
    return item.categoryId.map((id: number) => categoryMap.find((category) => category.id === id)?.name || 'GERAL');
  }

  getFormattedDate(item: News): string {
    return item.published || '';
  }

  getCommentsCount(): number {
    // Por enquanto retorna 0, pode ser implementado futuramente
    return 0;
  }

  // Lifecycle methods
  ngOnInit() {
    this.setupTouchEvents();
  }

  ngOnDestroy() {
    this.removeTouchEvents();
  }

  // Navegação direta para um índice específico
  goToSlide(index: number): void {
    if (index >= 0 && index < this.totalItems()) {
      this.currentIndex.set(index);
    }
  }

  // Helper para indicadores
  isActiveSlide(index: number): boolean {
    return index === this.currentIndex();
  }

  // Touch/Swipe functionality
  private setupTouchEvents() {
    if (typeof window !== 'undefined') {
      // Touch events
      document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
      document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
      document.addEventListener('touchend', this.onTouchEnd.bind(this));

      // Mouse events para desktop testing
      document.addEventListener('mousedown', this.onMouseDown.bind(this));
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }

  private removeTouchEvents() {
    if (typeof window !== 'undefined') {
      document.removeEventListener('touchstart', this.onTouchStart.bind(this));
      document.removeEventListener('touchmove', this.onTouchMove.bind(this));
      document.removeEventListener('touchend', this.onTouchEnd.bind(this));
      document.removeEventListener('mousedown', this.onMouseDown.bind(this));
      document.removeEventListener('mousemove', this.onMouseMove.bind(this));
      document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }

  // Touch Events
  private onTouchStart(event: TouchEvent) {
    if (!this.carouselWrapper || !this.carouselWrapper.nativeElement.contains(event.target as Node)) return;
    
    const touch = event.touches[0];
    this.startDrag(touch.clientX);
    event.preventDefault();
  }

  private onTouchMove(event: TouchEvent) {
    if (!this.isDragging()) return;
    
    const touch = event.touches[0];
    this.updateDrag(touch.clientX);
    event.preventDefault();
  }

  private onTouchEnd() {
    if (!this.isDragging()) return;
    this.endDrag();
  }

  // Mouse Events (para teste no desktop)
  private onMouseDown(event: MouseEvent) {
    if (!this.carouselWrapper || !this.carouselWrapper.nativeElement.contains(event.target as Node)) return;
    
    this.startDrag(event.clientX);
    event.preventDefault();
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isDragging()) return;
    this.updateDrag(event.clientX);
  }

  private onMouseUp() {
    if (!this.isDragging()) return;
    this.endDrag();
  }

  // Drag Logic
  private startDrag(clientX: number) {
    this.isDragging.set(true);
    this.startX.set(clientX);
    this.currentX.set(clientX);
  }

  private updateDrag(clientX: number) {
    this.currentX.set(clientX);
  }

  private endDrag() {
    const deltaX = this.currentX() - this.startX();
    const threshold = window.innerWidth * 0.15; // 15% da largura da tela
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swipe para a direita - item anterior
        this.goToPrevious();
      } else {
        // Swipe para a esquerda - próximo item
        this.goToNext();
      }
    }
    
    this.isDragging.set(false);
    this.startX.set(0);
    this.currentX.set(0);
  }
}
