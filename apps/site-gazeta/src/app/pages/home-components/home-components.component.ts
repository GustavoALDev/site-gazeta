import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsCategoryGridComponent } from '@site-gazeta/home-components';
import { NewsHighligthsComponent } from '@site-gazeta/home-components';
import { NewsClusterComponent } from '@site-gazeta/home-components';
  import { VideoManagerComponent } from '@site-gazeta/video-player';
import { MoreNewsComponent } from '@site-gazeta/more-news';
import { ApiService } from '../../core/service/api.service';
import { BreakpointService } from '../../core/service/breakpoint.service';
import { Ads, Category,  Menu, News, HomeData, Video, SectionOrderConfigMap } from '@site-gazeta/models';
import {  Observable, forkJoin, map, tap } from 'rxjs';
import { AdsComponent } from '@site-gazeta/ads';
import { ActivatedRoute } from '@angular/router';
import { CarouselManagerComponent } from '@site-gazeta/carousel';
import { LatestNewsComponent, MostViewedComponent } from '@site-gazeta/home-components';

@Component({
  selector: 'app-home-components',
  imports: [
    CommonModule,
    CarouselManagerComponent,
    NewsCategoryGridComponent,
    NewsHighligthsComponent,
    NewsClusterComponent,
    VideoManagerComponent,
    MoreNewsComponent,
    AdsComponent,
    LatestNewsComponent,
    MostViewedComponent,
  ],
  templateUrl: './home-components.component.html',
  styleUrl: './home-components.component.scss',
})
export class HomeComponentsComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
 
  
  protected newsItems = this.apiService.getNews();
  protected categories = signal<Category[]>([]);
  protected videos = signal<Video[]>([]);
  private ads = signal<{top: Ads[], center: Ads[], bottom: Ads[], lateral: Ads[]}>({top: [], center: [], bottom: [], lateral: []});

  menuItems = signal<Menu[]>([]);
  carouselItems = signal<News[]>([]);
  categoryGridNews = signal<{featured: News, secondary: News[], category: Category}[]>([]);
  homeConfig = signal<SectionOrderConfigMap >({});


  
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
  
   
  homeData = this.route.snapshot.data['data'] as HomeData;
  ngOnInit(): void {
    this.getAds();
  }
<<<<<<< HEAD
  
  
=======

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

>>>>>>> b5f2738636de535f6ccfc333327d5ae48f987cb9
  getAds() {
    console.log('getAds');
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
      this.ads.set(groupedAds);
  }

}
