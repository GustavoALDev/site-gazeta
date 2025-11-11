import { Component, signal, computed, input, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { News } from '@site-gazeta/models';
import { Category } from '@site-gazeta/models';
import { RouterModule } from '@angular/router';
import { ApiService } from 'apps/painel-gazeta/src/app/core/services/api.service';

// Interface para itens com dados processados
interface NewsItemWithData extends News {
  imageUrl: string;
  tags: string[];
}

// Interface para itens com clones mínimos
interface NewsWithClone extends Omit<NewsItemWithData, 'id'> {
  id: number | string; // Permite IDs originais e de clones
  isClone?: boolean;
  originalIndex?: number;
}

@Component({
  selector: 'lib-carousel-swipe',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './carousel-swipe.component.html',
  styleUrl: './carousel-swipe.component.scss',
})
export class CarouselSwipeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef<HTMLElement>;

  // Input para receber notícias externamente
  news = input<News[]>([]);
  apiService = inject(ApiService);

  // Estado do carousel usando signals - com sistema de clones mínimo
  private currentIndex = signal(1); // Índice no array estendido (inicia em 1 - primeiro item real)
  protected isDragging = signal(false);
  private startX = signal(0);
  private currentX = signal(0);
  protected isTransitioning = signal(false);
  private animationFrameId: number | null = null;
  private categories = signal<Category[]>([]);

  // Computed que processa os itens de notícias
  newsItems = computed(() => {
    const inputItems = this.news()
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
      .slice(0, 5);
    return inputItems;
  });

  // Computed que adiciona imageUrl e tags aos itens
  newsItemsWithData = computed(() => {
    const items = this.newsItems();
    const categoryMap = this.categories();
    
    return items.map(item => {
      const imageUrl = item.mediaNews?.[0]?.imgSize?.original || '';
      const tags = item.categoryId.map((id: number) => 
        categoryMap.find((category) => category.id === id)?.name || 'GERAL'
      );
      
      return {
        ...item,
        imageUrl,
        tags
      } as NewsItemWithData;
    });
  });

  // Array estendido com clones mínimos: [último, ...originais, primeiro]
  extendedItems = computed((): NewsWithClone[] => {
    const items = this.newsItemsWithData();
    if (items.length === 0) return [];
    
    const extended: NewsWithClone[] = [];
    
    // Clone do último item no início
    extended.push({
      ...items[items.length - 1],
      id: `${items[items.length - 1].id}_clone_last`,
      isClone: true,
      originalIndex: items.length - 1
    });
    
    // Itens originais
    items.forEach((item, index) => {
      extended.push({
        ...item,
        originalIndex: index
      });
    });
    
    // Clone do primeiro item no final
    extended.push({
      ...items[0],
      id: `${items[0].id}_clone_first`,
      isClone: true,
      originalIndex: 0
    });
    
    return extended;
  });

  // Computed properties
  totalItems = computed(() => this.newsItems().length);
  totalExtendedItems = computed(() => this.extendedItems().length);
  
  // Item atual visível (baseado no índice real)
  currentItem = computed(() => {
    const extendedIndex = this.currentIndex();
    const extended = this.extendedItems();
    return extended[extendedIndex];
  });

  // Índice real do item atual (0 a n-1)
  currentRealIndex = computed(() => {
    const currentItem = this.currentItem();
    return currentItem?.originalIndex ?? 0;
  });

  // Índice atual do carousel (para uso no template)
  activeIndex = computed(() => this.currentIndex());

  // Transform style para o track (usando array estendido)
  trackTransform = computed(() => {
    const currentIndex = this.currentIndex();
    const baseTranslate = -currentIndex * 100;
    const dragOffset = this.isDragging() ? (this.currentX() - this.startX()) / window.innerWidth * 100 : 0;
    
    return `translateX(${baseTranslate + dragOffset}%)`;
  });

  ngOnInit() {
    // Event listeners para touch events
    this.setupTouchEvents();
    this.getCategories();
  }

  getCategories() {
    this.apiService.getActiveCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  ngAfterViewInit() {
    // Inicialização do carousel após view ready
    if (this.totalItems() > 0) {
      console.log('Carousel initialized with', this.totalItems(), 'items');
    }
    
    // Event listener para detectar fim da transição CSS
    if (this.carouselTrack?.nativeElement) {
      this.carouselTrack.nativeElement.addEventListener('transitionend', this.onTransitionEnd.bind(this));
    }
  }

  ngOnDestroy() {
    this.removeTouchEvents();
    
    // Remove event listener da transição
    if (this.carouselTrack?.nativeElement) {
      this.carouselTrack.nativeElement.removeEventListener('transitionend', this.onTransitionEnd.bind(this));
    }
  }

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
    if (!this.carouselTrack || !this.carouselTrack.nativeElement.contains(event.target as Node)) return;
    
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
    if (!this.carouselTrack || !this.carouselTrack.nativeElement.contains(event.target as Node)) return;
    
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
    const threshold = window.innerWidth * 0.2; // 20% da largura da tela
    
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

  // Navegação com loop infinito usando clones
  goToPrevious(): void {
    if (this.isTransitioning()) return;
    
    const currentIndex = this.currentIndex();
    const totalReal = this.totalItems();
    
    if (currentIndex === 1) {
      // Está no primeiro item real, vai para o clone do último
      this.currentIndex.set(0);
      // Após a transição, reposiciona para o último item real
      setTimeout(() => {
        this.repositionToRealItem(totalReal);
      }, 320);
    } else {
      // Navegação normal
      this.currentIndex.update(index => index - 1);
    }
  }

  goToNext(): void {
    if (this.isTransitioning()) return;
    
    const currentIndex = this.currentIndex();
    const totalExtended = this.totalExtendedItems();
    const totalReal = this.totalItems();
    
    if (currentIndex === totalReal) {
      // Está no último item real, vai para o clone do primeiro
      this.currentIndex.set(totalExtended - 1);
      // Após a transição, reposiciona para o primeiro item real
      setTimeout(() => {
        this.repositionToRealItem(1);
      }, 320);
    } else {
      // Navegação normal
      this.currentIndex.update(index => index + 1);
    }
  }

  // Event handler para fim da transição CSS
  private onTransitionEnd(event: TransitionEvent): void {
    // Só processa se a transição foi do transform (não de outras propriedades)
    if (event.propertyName !== 'transform') return;
  }

  // Reposiciona para um item real sem animação
  private repositionToRealItem(targetIndex: number): void {
    this.isTransitioning.set(true);
    this.currentIndex.set(targetIndex);
    
    // Remove a classe transitioning após um frame
    requestAnimationFrame(() => {
      this.isTransitioning.set(false);
    });
  }

  // Navegação direta para um índice específico (baseado no índice real)
  goToSlide(index: number): void {
    if (index >= 0 && index < this.totalItems()) {
      // Converte índice real para índice estendido (+ 1 por causa do clone no início)
      this.currentIndex.set(index + 1);
      this.isTransitioning.set(false);
    }
  }

  // Helper para indicadores (baseado no índice real)
  isActiveSlide(index: number): boolean {
    return index === this.currentRealIndex();
  }

  // Helpers para extrair dados do modelo News (aceita NewsWithClone)
  getImageUrl(item: NewsWithClone): string {
    return item.imageUrl || '';
  }

  getTags(item: NewsWithClone): string[] {
    return item.tags || [];
  }

  getFormattedDate(item: NewsWithClone): string {
    return item.published || '';
  }

  getCommentsCount(): number {
    // Por enquanto retorna 0, pode ser implementado futuramente
    return 0;
  }
}
