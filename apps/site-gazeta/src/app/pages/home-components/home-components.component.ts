import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
import { BreakpointService } from '../../core/service/breakpoint.service';
import { Ads, Category, Menu, News, SectionOrderConfig, SectionOrderConfigMap, TopGazetaConfig, Video } from '@site-gazeta/models';
import { firstValueFrom, forkJoin, map, tap } from 'rxjs';
import { AdsComponent } from '@site-gazeta/ads';

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
    AdsComponent,
  ],
  templateUrl: './home-components.component.html',
  styleUrl: './home-components.component.scss',
})
export class HomeComponentsComponent implements OnInit {
  private apiService = inject(ApiService);

  protected breakpointService = inject(BreakpointService);
  get isMobile() {
    return this.breakpointService.isMobile;
  }

  protected newsItems = signal<News[]>([]);
  protected categories = signal<Category[]>([]);
  protected videos = signal<Video[]>([]);
  private ads = signal<{top: Ads[], center: Ads[], bottom: Ads[], lateral: Ads[]}>({top: [], center: [], bottom: [], lateral: []});

  menuItems = signal<Menu[]>([]);
  carouselItems = signal<News[]>([]);
  categoryGridNews = signal<{featured: News, secondary: News[], category: Category}[]>([]);
  topGazeta = signal<TopGazetaConfig | null>(null);
  homeConfig = this.apiService.getHomeConfigMap().pipe(tap(config => console.log(config)));

  // Computed signals para otimização do template
  protected hasCarouselItems = computed(() => this.carouselItems().length > 0);
  protected hasCategoryGrid = computed(() => this.categoryGridNews().length > 0);
  protected hasVideos = computed(() => this.videos().length > 0);
  protected hasNews = computed(() => this.newsItems().length > 0);
  protected hasCategories = computed(() => this.categories().length > 0);
  
  // Computed para anúncios com validação
  protected topAd = computed(() => this.ads().top.length > 0 ? this.ads().top[0] : null);
  protected centerAd = computed(() => this.ads().center.length > 0 ? this.ads().center[0] : null);
  protected bottomAd = computed(() => this.ads().bottom.length > 0 ? this.ads().bottom[0] : null);
  protected lateralAd = computed(() => this.ads().lateral.length > 0 ? this.ads().lateral[0] : null);
  protected hasTopAd = computed(() => this.topAd() !== null);
  protected hasBottomAd = computed(() => this.bottomAd() !== null);
  protected hasLateralAd = computed(() => this.lateralAd() !== null);

  // Computed para primeiro categoria
  protected firstCategory = computed(() => 
    this.categories().length > 0 ? this.categories()[0] : null
  );

  // Computed para Top Gazeta com validação
  protected hasTopGazeta = computed(() => 
    this.topGazeta() !== null && 
    this.topGazeta()!.categories !== undefined && 
    this.topGazeta()!.categories.length > 0
  );
  constructor() {
    
  }
  ngOnInit(): void {
    
    this.setCarouselItems();
    this.getHomeCategoryConfig();
    this.getNews();
    this.getCategories();
    this.getVideos();
    this.getAds();
    
  }

  getHomeCategoryConfig() {
    this.apiService.getHomeCategoryConfig().subscribe((config) => {
      // Verificar se há categorias de destaque antes de processar
      if (config.destaque && config.destaque.categories && config.destaque.categories.length > 0) {
        const categories = config.destaque.categories as Category[];
        this.setCategoryGridItems(categories);
      }
      // Verificar se há top gazeta antes de definir
      if (config.topGazeta) {
        this.topGazeta.set(config.topGazeta);
      }
      console.log('Home Category Config:', config);
      console.log('Top Gazeta:', this.topGazeta());
    });
  }
  getNews() {
    this.apiService.getNews().subscribe((news) => {
      this.newsItems.set(news);
    });
  }

  getCategories() {
    this.apiService.getActiveCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  getVideos() {
    this.apiService.getVideos().subscribe((videos) => {
      this.videos.set(videos);
    });
  }

  setCarouselItems() {
    this.apiService.getNewsFeatured()
    .pipe(
      map(news => news.slice(0, 5))
    )
    .subscribe((news) => {
      this.carouselItems.set(news);
    });
  }

  getAds() {
    this.apiService.getAdsByPlacement('home').subscribe((ads) => {
      this.setAds(ads);
    });
  }

  setAds(ads: Ads[]) {
      const groupedAds = {
        top: ads.filter(ad => ad.position === 'top'),
        center: ads.filter(ad => ad.position === 'center'),
        bottom: ads.filter(ad => ad.position === 'bottom'),
        lateral: ads.filter(ad => ad.position === 'lateral'),
      };
      console.log(groupedAds);
      this.ads.set(groupedAds);
  }
  setCategoryGridItems(categories: Category[]) {

    forkJoin(
      categories.map(category =>
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
