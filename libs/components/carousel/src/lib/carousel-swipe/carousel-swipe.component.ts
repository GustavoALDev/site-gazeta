import {
  Component,
  signal,
  computed,
  input,
  ElementRef,
  ViewChild,
  OnDestroy,
  DestroyRef,
  inject,
  ChangeDetectionStrategy,
  effect,
  PLATFORM_ID,
  afterNextRender,
  Injector,
} from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
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

const DRAG_THRESHOLD = 30;
const SWIPE_THRESHOLD = 0.2;
const MOVE_DETECTION_THRESHOLD = 15;
const TRANSITION_DURATION = 320;

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselSwipeComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private listenersSetup = false;
  private mutationObserver?: MutationObserver;

  @ViewChild('carouselTrack', { static: false }) 
  private carouselTrack?: ElementRef<HTMLElement>;

  readonly news = input<News[]>([]);

  protected readonly currentIndex = signal(1);
  private readonly dragState = signal<DragState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
  });
  protected readonly isTransitioning = signal(false);

  private readonly newsItemsWithData = computed<NewsItemWithData[]>(() => {
    const items = this.news();
    return items.map(item => {
      const imageUrl: ImageUrls = item.mediaNews?.[0]?.imgSize || {
        original: '',
        small: '',
        medium: '',
        superSmall: '',
      };
      const tags = item.tags && item.tags.length > 0 ? item.tags : [];
      return {
        ...item,
        imageUrl,
        tags,
      } as NewsItemWithData;
    });
  });

  readonly extendedItems = computed<NewsWithClone[]>(() => {
    const items = this.newsItemsWithData();
    if (items.length === 0) return [];
    const lastItem = items[items.length - 1];
    const firstItem = items[0];
    const extended: NewsWithClone[] = [];
    extended.push({
      ...lastItem,
      id: `${lastItem.id}_clone_last`,
      isClone: true,
      originalIndex: items.length - 1,
    });
    items.forEach((item, index) => {
      extended.push({
        ...item,
        originalIndex: index,
      });
    });
    extended.push({
      ...firstItem,
      id: `${firstItem.id}_clone_first`,
      isClone: true,
      originalIndex: 0,
    });
    return extended;
  });

  readonly totalItems = computed(() => this.news().length);

  readonly currentItem = computed(() => {
    const index = this.currentIndex();
    const items = this.extendedItems();
    return items[index];
  });

  readonly currentRealIndex = computed(() => {
    return this.currentItem()?.originalIndex ?? 0;
  });

  protected readonly isDragging = computed(() => this.dragState().isDragging);

  readonly trackTransform = computed(() => {
    const index = this.currentIndex();
    const baseTranslate = -index * 100;
    const drag = this.dragState();
    const dragOffset = drag.isDragging
      ? ((drag.currentX - drag.startX) / window.innerWidth) * 100
      : 0;
    return `translateX(${baseTranslate + dragOffset}%)`;
  });

  private readonly boundHandlers = {
    touchStart: this.onTouchStart.bind(this),
    touchMove: this.onTouchMove.bind(this),
    touchEnd: this.onTouchEnd.bind(this),
    mouseDown: this.onMouseDown.bind(this),
    mouseMove: this.onMouseMove.bind(this),
    mouseUp: this.onMouseUp.bind(this),
    transitionEnd: this.onTransitionEnd.bind(this),
  };

  constructor() {
    if (!this.isBrowser) return;
    effect(() => {
      const items = this.extendedItems();
      const track = this.carouselTrack?.nativeElement;
      if (items.length > 0 && track && !this.listenersSetup) {
        queueMicrotask(() => this.trySetupListeners());
      }
    }, { injector: this.injector });
    afterNextRender(
      () => {
        this.initializeListenersWhenReady();
      },
      { 
        injector: this.injector
      }
    );
  }

  private initializeListenersWhenReady(): void {
    if (this.trySetupListeners()) {
      return;
    }
    const track = this.carouselTrack?.nativeElement;
    if (!track) {
      setTimeout(() => this.initializeListenersWhenReady(), 100);
      return;
    }
    this.mutationObserver = new MutationObserver(() => {
      if (this.trySetupListeners()) {
        this.mutationObserver?.disconnect();
        this.mutationObserver = undefined;
      }
    });
    this.mutationObserver.observe(track, { 
      childList: true, 
      subtree: true,
      attributes: true 
    });
    this.destroyRef.onDestroy(() => {
      this.mutationObserver?.disconnect();
      this.mutationObserver = undefined;
    });
    setTimeout(() => {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = undefined;
        this.trySetupListeners();
      }
    }, 5000);
  }

  private trySetupListeners(): boolean {
    if (this.listenersSetup) {
      return true;
    }
    const track = this.carouselTrack?.nativeElement;
    const items = this.extendedItems();
    if (!track) {
      return false;
    }
    if (items.length === 0) {
      return false;
    }
    const slides = track.querySelectorAll('.carousel-swipe-slide');
    if (slides.length === 0) {
      return false;
    }
    this.setupEventListeners();
    this.listenersSetup = true;
    return true;
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
    this.mutationObserver = undefined;
    this.removeEventListeners();
    this.listenersSetup = false;
  }

  private setupEventListeners(): void {
    const trackElement = this.carouselTrack?.nativeElement;
    if (!trackElement || typeof window === 'undefined') {
      return;
    }
    this.removeEventListeners();
    trackElement.addEventListener('touchstart', this.boundHandlers.touchStart, {
      passive: true,
    });
    trackElement.addEventListener('touchmove', this.boundHandlers.touchMove, {
      passive: false,
    });
    trackElement.addEventListener('touchend', this.boundHandlers.touchEnd, {
      passive: false,
    });
    trackElement.addEventListener('mousedown', this.boundHandlers.mouseDown, {
      passive: true,
    });
    document.addEventListener('mousemove', this.boundHandlers.mouseMove);
    document.addEventListener('mouseup', this.boundHandlers.mouseUp);
    trackElement.addEventListener('transitionend', this.boundHandlers.transitionEnd);
  }

  private removeEventListeners(): void {
    const trackElement = this.carouselTrack?.nativeElement;
    if (!trackElement || typeof window === 'undefined') return;
    trackElement.removeEventListener('touchstart', this.boundHandlers.touchStart);
    trackElement.removeEventListener('touchmove', this.boundHandlers.touchMove);
    trackElement.removeEventListener('touchend', this.boundHandlers.touchEnd);
    trackElement.removeEventListener('mousedown', this.boundHandlers.mouseDown);
    document.removeEventListener('mousemove', this.boundHandlers.mouseMove);
    document.removeEventListener('mouseup', this.boundHandlers.mouseUp);
    trackElement.removeEventListener('transitionend', this.boundHandlers.transitionEnd);
  }

  private onTouchStart(event: TouchEvent): void {
    if (this.shouldIgnoreEvent(event.target as HTMLElement)) {
      return;
    }
    const touch = event.touches[0];
    this.startDrag(touch.clientX);
  }

  private onTouchMove(event: TouchEvent): void {
    const drag = this.dragState();
    if (!drag.isDragging) return;
    const touch = event.touches[0];
    this.updateDrag(touch.clientX);
    const deltaX = Math.abs(touch.clientX - drag.startX);
    if (deltaX > MOVE_DETECTION_THRESHOLD) {
      event.preventDefault();
    }
  }

  private onTouchEnd(event: TouchEvent): void {
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

  private onMouseDown(event: MouseEvent): void {
    if (this.shouldIgnoreEvent(event.target as HTMLElement)) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
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

  private shouldIgnoreEvent(target: HTMLElement): boolean {
    const isButton = target.closest('button') !== null;
    const isInsideCard = target.closest('.news-card') !== null;
    return isButton && !isInsideCard;
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

  goToPrevious(): void {
    if (this.isTransitioning()) return;
    const currentIndex = this.currentIndex();
    const totalReal = this.totalItems();
    if (currentIndex === 1) {
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
    const index = this.currentIndex();
    const totalReal = this.totalItems();
    const totalExtended = this.extendedItems().length;
    if (index === totalReal) {
      this.currentIndex.set(totalExtended - 1);
      setTimeout(() => {
        this.repositionToRealItem(1);
      }, TRANSITION_DURATION);
    } else {
      this.currentIndex.update(i => i + 1);
    }
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.totalItems()) return;
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

  private onTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName !== 'transform') return;
  }

  isActiveSlide(index: number): boolean {
    return index === this.currentRealIndex();
  }
}
