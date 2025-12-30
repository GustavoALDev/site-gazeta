import { Component, signal, computed, input, output, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '@site-gazeta/models';

@Component({
  selector: 'lib-video-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-carousel.component.html',
  styleUrl: './video-carousel.component.scss',
})
export class VideoCarouselComponent implements OnInit, OnDestroy {
  videos = input<Video[]>([]);
  categoryName = input<string>('');
  currentVideo = output<Video>();

  @ViewChild('carouselWrapper', { static: false }) carouselWrapper!: ElementRef<HTMLElement>;
  
  private currentIndex = signal(0);
  protected itemsPerView = signal(3);
  protected isDragging = signal(false);
  private startX = signal(0);
  private currentX = signal(0);

  totalItems = computed(() => this.videos().length);
  
  canGoPrevious = computed(() => this.currentIndex() > 0);
  canGoNext = computed(() => {
    const maxIndex = Math.max(0, this.totalItems() - this.itemsPerView());
    return this.currentIndex() < maxIndex;
  });

  goToPrevious(): void {
    this.currentIndex.update(index => {
      const newIndex = index - this.itemsPerView();
      return newIndex < 0 ? 0 : newIndex;
    });
  }

  goToNext(): void {
    this.currentIndex.update(index => {
      const maxIndex = Math.max(0, this.totalItems() - this.itemsPerView());
      const newIndex = index + this.itemsPerView();
      return newIndex > maxIndex ? maxIndex : newIndex;
    });
  }

  visibleItems = computed(() => {
    const items = this.videos();
    const totalItems = items.length;
    if (totalItems === 0) return [];
    
    const start = this.currentIndex();
    const itemsToShow = this.itemsPerView();
    const visibleItems: Video[] = [];

    for (let i = 0; i < itemsToShow && (start + i) < totalItems; i++) {
      visibleItems.push(items[start + i]);
    }

    return visibleItems;
  });

  activeSlideIndex = computed(() => this.currentIndex());

  // Calcula os grupos de slides para os indicadores
  slideGroups = computed(() => {
    const total = this.totalItems();
    const perView = this.itemsPerView();
    const groups = Math.ceil(total / perView);
    return Array.from({ length: groups }, (_, i) => i * perView);
  });

  activeGroupIndex = computed(() => {
    const current = this.currentIndex();
    const perView = this.itemsPerView();
    return Math.floor(current / perView);
  });

  playVideo(video: Video, event: Event): void {
    event.stopPropagation();
    this.currentVideo.emit(video);
  }

  onVideoClick(video: Video): void {
    this.currentVideo.emit(video);
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.totalItems()) {
      this.currentIndex.set(index);
    }
  }

  private setupTouchEvents() {
    if (typeof window !== 'undefined') {
      document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
      document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
      document.addEventListener('touchend', this.onTouchEnd.bind(this));
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

  ngOnInit() {
    this.setupTouchEvents();
  }

  ngOnDestroy() {
    this.removeTouchEvents();
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
    const threshold = window.innerWidth * 0.15;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        this.goToPrevious();
      } else {
        this.goToNext();
      }
    }
    
    this.isDragging.set(false);
    this.startX.set(0);
    this.currentX.set(0);
  }
}

