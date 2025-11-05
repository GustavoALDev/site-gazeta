import { RouterModule } from '@angular/router';
import { Component, signal, computed, input, ElementRef, ViewChild, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { News } from '@site-gazeta/models';
import { mockCategories } from '@site-gazeta/mock';
import { Category } from '@site-gazeta/models';
import { ApiService } from 'apps/painel-gazeta/src/app/core/services/api.service';

// Tipo auxiliar para itens com dados processados
interface NewsItemWithData extends News {
  imageUrl: string;
  tags: string[];
}


@Component({
  selector: 'lib-carousel',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnInit, OnDestroy {
  @ViewChild('carouselWrapper', { static: false }) carouselWrapper!: ElementRef<HTMLElement>;
  news = input<News[]>([]);
  apiService = inject(ApiService);

  private currentIndex = signal(0);
  private itemsPerView = signal(3); 
  protected isDragging = signal(false);
  private startX = signal(0);
  private currentX = signal(0);
  private categories = signal<Category[]>([]);

  

  newsItems = computed(() => {
    const inputItems = this.news()
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, 5);
    return inputItems
  });


  totalItems = computed(() => this.newsItems().length);
  
  canGoPrevious = computed(() => true);
  canGoNext = computed(() => true);
  getCategories() {
    this.apiService.getActiveCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }
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

  visibleItems = computed(() => {
    const items = this.newsItemsWithData();
    const totalItems = items.length;
    if (totalItems === 0) return [];
    
    const start = this.currentIndex();
    const itemsToShow = this.itemsPerView();
    const visibleItems: NewsItemWithData[] = [];

    for (let i = 0; i < itemsToShow; i++) {
      const index = (start + i) % totalItems;
      visibleItems.push(items[index]);
    }

    return visibleItems;
  });

  centerItemIndex = computed(() => 1);

  activeSlideIndex = computed(() => this.currentIndex());

  readonly commentsCount = 0;

  ngOnInit() {
    this.setupTouchEvents();
    this.getCategories();
  }

  ngOnDestroy() {
    this.removeTouchEvents();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.totalItems()) {
      this.currentIndex.set(index);
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
