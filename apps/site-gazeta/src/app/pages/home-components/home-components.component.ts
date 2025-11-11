import { Component, OnInit, OnDestroy, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '@site-gazeta/carousel';
import { CarouselSwipeComponent } from '@site-gazeta/carousel';
import { NewsCategoryGridComponent } from '@site-gazeta/home-components';
import { NewsCategorySectionComponent } from '@site-gazeta/home-components';
import { NewsHighligthsComponent } from '@site-gazeta/home-components';
import { NewsClusterComponent } from '@site-gazeta/home-components';
import { VideoPlayerComponent } from '@site-gazeta/video-player';
import { MoreNewsComponent } from '@site-gazeta/more-news';
import { ApiService } from '../../core/service/api.service';
import { Category, Menu, News, Video } from '@site-gazeta/models';

@Component({
  selector: 'app-home-components',
  imports: [
    CommonModule,
    CarouselComponent,
    CarouselSwipeComponent,
    NewsCategoryGridComponent,
    NewsCategorySectionComponent,
    NewsHighligthsComponent,
    NewsClusterComponent,
    VideoPlayerComponent,
    MoreNewsComponent,
  ],
  templateUrl: './home-components.component.html',
  styleUrl: './home-components.component.scss',
})
export class HomeComponentsComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private readonly MOBILE_BREAKPOINT = 1128;
  private resizeListener?: () => void;

  protected newsItems = signal<News[]>([]);
  protected categories = signal<Category[]>([]);
  protected videos = signal<Video[]>([]);
  menuItems = signal<Menu[]>([]);
  carouselItems = signal<News[]>([]);
  categoryGridConfig = signal<Category[]>([]);
  isMobile = signal<boolean | null>(null); // null = ainda não detectado

  constructor() {
    // Detecta o breakpoint apenas no cliente após a renderização
    afterNextRender(() => {
      this.initializeBreakpointDetection();
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getVideos();
    this.getNews();
  }

  ngOnDestroy(): void {
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private initializeBreakpointDetection(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Verifica o tamanho inicial
    this.checkBreakpoint();

    // Adiciona listener para mudanças de tamanho
    this.resizeListener = () => this.checkBreakpoint();
    window.addEventListener('resize', this.resizeListener);
  }

  private checkBreakpoint(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.isMobile.set(window.innerWidth <= this.MOBILE_BREAKPOINT);
  }

  getNews() {
    this.apiService.getNews().subscribe((news) => {
      this.setCategoryGridItems(news);
      this.setCarouselItems(news);
      this.newsItems.set(news);

    });
  }

  getCategories() {
    this.apiService.getActiveCategories().subscribe((categories) => {
      this.categories.set(categories.sort(() => Math.random() - 0.5));
    });
  }

  getVideos() {
    this.apiService.getVideos().subscribe((videos) => {
      this.videos.set(videos);
    });
  }

  setCarouselItems(news: News[]) {
    const carouselItems = news
      .filter((news) => {
        return news.isEmphasis;
      })
      .sort(
        (a, b) =>
          new Date(b.published).getTime() - new Date(a.published).getTime()
      );
    this.carouselItems.set(carouselItems);
  }

  setCategoryGridItems(news: News[]) {
    console.log(this.categories());
    const mockCategorieNames = this.categories().filter((category) => {
      return (
        category.name == 'Tecnologia' ||
        category.name == 'Política' ||
        category.name == 'Esportes'
      );
    });
    console.log(mockCategorieNames);
    const categoryGridItems = news.filter((news) => {
      return mockCategorieNames.some((category) => {
        return news.categoryId.includes(category.id as number);
      });
    });
    this.categoryGridConfig.set(mockCategorieNames);
  }
}
