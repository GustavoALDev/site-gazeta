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
import { firstValueFrom, forkJoin, map } from 'rxjs';

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
  categoryGridNews = signal<{featured: News, secondary: News[], category: Category}[]>([]);
  isMobile = signal<boolean | null>(null); // null = ainda não detectado

  constructor() {
    // Detecta o breakpoint apenas no cliente após a renderização
    afterNextRender(() => {
      this.initializeBreakpointDetection();
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.setCarouselItems();
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
      this.newsItems.set(news);
    });
  }

  getCategories() {
    this.apiService.getActiveCategories().subscribe((categories) => {
      this.categories.set(categories);
      this.setCategoryGridItems();
    });
  }

  getVideos() {
    this.apiService.getVideos().subscribe((videos) => {
      this.videos.set(videos);
    });
  }

  setCarouselItems() {
    this.apiService.getNewsFeatured().subscribe((news) => {
      this.carouselItems.set(news);
    });
  }

  setCategoryGridItems() {
    console.log('setCategoryGridItems');
    console.log(this.categories());
    const mockCategorieNames = this.categories().filter((category) => {
      return (
        category.name == 'Política' ||
        category.name == 'Tecnologia' ||
        category.name == 'Esportes'
      );
    });

    forkJoin(
      mockCategorieNames.map(category =>
        this.apiService.getNewsForCategory(category.id as number).pipe(
          map(news=>{return {news:news, category:category}})
        )
      )
    ).subscribe({
      next: (news) =>{
        console.log(news);
        this.categoryGridNews.set(this.categoryGridNewsConfig(news));
      }
    });
  }

  categoryGridNewsConfig(config: {news: News[], category: Category}[]){
    const categorized = config.map(config=>{
      return {
        featured: config.news[0],
        secondary: config.news.slice(1, 3),
        category: config.category
      }
    })
    return categorized;
  }
}
