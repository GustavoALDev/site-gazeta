import {
  Component,
  signal,
  computed,
  input,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { News } from '@site-gazeta/models';
import { RouterModule } from '@angular/router';


interface ImageUrls {
  original: string;
  small: string;
  medium: string;
  superSmall: string;
}

interface NewsItemWithData extends News {
  imageUrl: ImageUrls;
  tags: string[];
}

interface NewsWithClone extends Omit<NewsItemWithData, 'id'> {
  id: number | string;
  isClone?: boolean;
  originalIndex?: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  currentX: number;
}

// ============================================
// CONSTANTS
// ============================================

const DRAG_THRESHOLD = 30; // pixels para diferenciar click de drag
const SWIPE_THRESHOLD = 0.2; // 20% da largura da tela
const MOVE_DETECTION_THRESHOLD = 15; // pixels para detectar movimento
const TRANSITION_DURATION = 320; // ms

// ============================================
// COMPONENT
// ============================================

@Component({
  selector: 'lib-carousel-swipe',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NgOptimizedImage,
  ],
  templateUrl: './carousel-swipe.component.html',
  styleUrl: './carousel-swipe.component.scss',
})
export class CarouselSwipeComponent implements AfterViewInit, OnDestroy {
  // ============================================
  // INJECTIONS & VIEW REFERENCES
  // ============================================
  
  private readonly destroyRef = inject(DestroyRef);
  
  @ViewChild('carouselTrack', { static: false }) 
  private carouselTrack?: ElementRef<HTMLElement>;

  // ============================================
  // INPUTS
  // ============================================
  
  readonly news = input<News[]>([]);

  // ============================================
  // SIGNALS - STATE
  // ============================================
  
  private readonly currentIndex = signal(1); // Inicia em 1 (primeiro item real)
  private readonly dragState = signal<DragState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
  });
  protected readonly isTransitioning = signal(false);

  // ============================================
  // COMPUTED SIGNALS - DATA PROCESSING
  // ============================================

  /**
   * Processa os itens de notícias adicionando imageUrl e validando tags
   */
  private readonly newsItemsWithData = computed<NewsItemWithData[]>(() => {
    const items = this.news();
    
    return items.map(item => {
      // Extrai imageUrl com fallback seguro
      const imageUrl: ImageUrls = item.mediaNews?.[0]?.imgSize || {
        original: '',
        small: '',
        medium: '',
        superSmall: '',
      };

      // Usa tags do backend se disponíveis, senão array vazio
      const tags = item.tags && item.tags.length > 0 ? item.tags : [];

      return {
        ...item,
        imageUrl,
        tags,
      } as NewsItemWithData;
    });
  });

  /**
   * Cria array estendido com clones para loop infinito
   * Estrutura: [clone_último, item0, item1, ..., itemN, clone_primeiro]
   */
  readonly extendedItems = computed<NewsWithClone[]>(() => {
    const items = this.newsItemsWithData();
    if (items.length === 0) return [];

    const lastItem = items[items.length - 1];
    const firstItem = items[0];

    const extended: NewsWithClone[] = [];

    // Clone do último item no início
    extended.push({
      ...lastItem,
      id: `${lastItem.id}_clone_last`,
      isClone: true,
      originalIndex: items.length - 1,
    });

    // Itens originais
    items.forEach((item, index) => {
      extended.push({
        ...item,
        originalIndex: index,
      });
    });

    // Clone do primeiro item no final
    extended.push({
      ...firstItem,
      id: `${firstItem.id}_clone_first`,
      isClone: true,
      originalIndex: 0,
    });

    return extended;
  });

  // ============================================
  // COMPUTED SIGNALS - DERIVED STATE
  // ============================================

  readonly totalItems = computed(() => this.news().length);
  readonly totalExtendedItems = computed(() => this.extendedItems().length);

  readonly currentItem = computed(() => {
    const index = this.currentIndex();
    const items = this.extendedItems();
    return items[index];
  });

  readonly currentRealIndex = computed(() => {
    return this.currentItem()?.originalIndex ?? 0;
  });

  readonly activeIndex = computed(() => this.currentIndex());

  protected readonly isDragging = computed(() => this.dragState().isDragging);

  /**
   * Calcula a transformação CSS para o track do carousel
   */
  readonly trackTransform = computed(() => {
    const index = this.currentIndex();
    const baseTranslate = -index * 100;

    const drag = this.dragState();
    const dragOffset = drag.isDragging
      ? ((drag.currentX - drag.startX) / window.innerWidth) * 100
      : 0;

    return `translateX(${baseTranslate + dragOffset}%)`;
  });

  // ============================================
  // EVENT HANDLERS - BOUND REFERENCES
  // ============================================

  private readonly boundHandlers = {
    touchStart: this.onTouchStart.bind(this),
    touchMove: this.onTouchMove.bind(this),
    touchEnd: this.onTouchEnd.bind(this),
    mouseDown: this.onMouseDown.bind(this),
    mouseMove: this.onMouseMove.bind(this),
    mouseUp: this.onMouseUp.bind(this),
    transitionEnd: this.onTransitionEnd.bind(this),
  };

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================

  ngAfterViewInit(): void {
    this.setupEventListeners();

    if (this.totalItems() > 0) {
      console.log(`[CarouselSwipe] Initialized with ${this.totalItems()} items`);
    }
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  // ============================================
  // EVENT LISTENER MANAGEMENT
  // ============================================

  private setupEventListeners(): void {
    const trackElement = this.carouselTrack?.nativeElement;
    if (!trackElement || typeof window === 'undefined') return;

    // Touch events com passive correto
    trackElement.addEventListener('touchstart', this.boundHandlers.touchStart, {
      passive: true,
    });
    trackElement.addEventListener('touchmove', this.boundHandlers.touchMove, {
      passive: false, // Necessário para preventDefault
    });
    trackElement.addEventListener('touchend', this.boundHandlers.touchEnd, {
      passive: false, // Necessário para preventDefault condicional
    });

    // Mouse events
    trackElement.addEventListener('mousedown', this.boundHandlers.mouseDown, {
      passive: true,
    });
    document.addEventListener('mousemove', this.boundHandlers.mouseMove);
    document.addEventListener('mouseup', this.boundHandlers.mouseUp);

    // Transition events
    trackElement.addEventListener('transitionend', this.boundHandlers.transitionEnd);
  }

  private removeEventListeners(): void {
    const trackElement = this.carouselTrack?.nativeElement;
    if (!trackElement || typeof window === 'undefined') return;

    // Touch events
    trackElement.removeEventListener('touchstart', this.boundHandlers.touchStart);
    trackElement.removeEventListener('touchmove', this.boundHandlers.touchMove);
    trackElement.removeEventListener('touchend', this.boundHandlers.touchEnd);

    // Mouse events
    trackElement.removeEventListener('mousedown', this.boundHandlers.mouseDown);
    document.removeEventListener('mousemove', this.boundHandlers.mouseMove);
    document.removeEventListener('mouseup', this.boundHandlers.mouseUp);

    // Transition events
    trackElement.removeEventListener('transitionend', this.boundHandlers.transitionEnd);
  }

  // ============================================
  // TOUCH EVENT HANDLERS
  // ============================================

  private onTouchStart(event: TouchEvent): void {
    if (this.shouldIgnoreEvent(event.target as HTMLElement)) return;

    const touch = event.touches[0];
    this.startDrag(touch.clientX);
  }

  private onTouchMove(event: TouchEvent): void {
    const drag = this.dragState();
    if (!drag.isDragging) return;

    const touch = event.touches[0];
    this.updateDrag(touch.clientX);

    const deltaX = Math.abs(touch.clientX - drag.startX);
    
    // Só previne scroll se movimento for significativo
    if (deltaX > MOVE_DETECTION_THRESHOLD) {
      event.preventDefault();
    }
  }

  private onTouchEnd(event: TouchEvent): void {
    const drag = this.dragState();
    if (!drag.isDragging) return;

    const deltaX = Math.abs(drag.currentX - drag.startX);

    // Movimento pequeno = click, não previne
    if (deltaX < DRAG_THRESHOLD) {
      this.resetDrag();
      return;
    }

    // Movimento significativo = swipe, previne click
    this.endDrag();
    event.preventDefault();
    event.stopPropagation();
  }

  // ============================================
  // MOUSE EVENT HANDLERS
  // ============================================

  private onMouseDown(event: MouseEvent): void {
    if (this.shouldIgnoreEvent(event.target as HTMLElement)) return;
    if (event.button !== 0) return; // Apenas botão esquerdo

    this.startDrag(event.clientX);
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.dragState().isDragging) return;
    this.updateDrag(event.clientX);
  }

  private onMouseUp(event: MouseEvent): void {
    const drag = this.dragState();
    if (!drag.isDragging) return;

    const deltaX = Math.abs(drag.currentX - drag.startX);

    if (deltaX < DRAG_THRESHOLD) {
      this.resetDrag();
      return;
    }

    this.endDrag();
    event.preventDefault();
    event.stopPropagation();
  }

  // ============================================
  // DRAG LOGIC
  // ============================================

  private shouldIgnoreEvent(target: HTMLElement): boolean {
    // Ignora eventos em botões de navegação (exceto dentro do card)
    return !!(target.closest('button') && !target.closest('.news-card'));
  }

  private startDrag(clientX: number): void {
    this.dragState.set({
      isDragging: true,
      startX: clientX,
      currentX: clientX,
    });
  }

  private updateDrag(clientX: number): void {
    this.dragState.update(state => ({
      ...state,
      currentX: clientX,
    }));
  }

  private resetDrag(): void {
    this.dragState.set({
      isDragging: false,
      startX: 0,
      currentX: 0,
    });
  }

  private endDrag(): void {
    const drag = this.dragState();
    const deltaX = drag.currentX - drag.startX;
    const threshold = window.innerWidth * SWIPE_THRESHOLD;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        this.goToPrevious();
      } else {
        this.goToNext();
      }
    }

    this.resetDrag();
  }

  // ============================================
  // NAVIGATION
  // ============================================

  goToPrevious(): void {
    if (this.isTransitioning()) return;

    const currentIndex = this.currentIndex();
    const totalReal = this.totalItems();

    if (currentIndex === 1) {
      // Primeiro item real -> vai para clone do último
      this.currentIndex.set(0);
      setTimeout(() => {
        this.repositionToRealItem(totalReal);
      }, TRANSITION_DURATION);
    } else {
      this.currentIndex.update(index => index - 1);
    }
  }

  goToNext(): void {
    if (this.isTransitioning()) return;

    const currentIndex = this.currentIndex();
    const totalExtended = this.totalExtendedItems();
    const totalReal = this.totalItems();

    if (currentIndex === totalReal) {
      // Último item real -> vai para clone do primeiro
      this.currentIndex.set(totalExtended - 1);
      setTimeout(() => {
        this.repositionToRealItem(1);
      }, TRANSITION_DURATION);
    } else {
      this.currentIndex.update(index => index + 1);
    }
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.totalItems()) return;

    // Converte índice real para índice estendido (+1 por causa do clone no início)
    this.currentIndex.set(index + 1);
    this.isTransitioning.set(false);
  }

  private repositionToRealItem(targetIndex: number): void {
    this.isTransitioning.set(true);
    this.currentIndex.set(targetIndex);

    requestAnimationFrame(() => {
      this.isTransitioning.set(false);
    });
  }

  // ============================================
  // EVENT HANDLERS - TRANSITION
  // ============================================

  private onTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName !== 'transform') return;
    // Lógica adicional se necessário
  }

  // ============================================
  // PUBLIC HELPERS (TEMPLATE)
  // ============================================

  isActiveSlide(index: number): boolean {
    return index === this.currentRealIndex();
  }
}
