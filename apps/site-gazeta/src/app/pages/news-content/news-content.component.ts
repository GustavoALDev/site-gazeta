import { Component, signal, computed, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { News, NewsMedia } from '@site-gazeta/models';
import { ApiService } from '../../core/service/api.service';
import { AnalyticsService } from '../../core/service/analytics.service';
import { SessionService } from '../../core/service/session.service';
import { RouterModule } from '@angular/router';
import { RelatedNewsComponent } from '@site-gazeta/related-news';
import { MoreNewsComponent } from '@site-gazeta/more-news';
import { GalleryComponent } from './gallery/gallery.component';
@Component({
  selector: 'app-news-content',
  imports: [CommonModule, RouterModule, RelatedNewsComponent, MoreNewsComponent, GalleryComponent],
  templateUrl: './news-content.component.html',
  styleUrl: './news-content.component.scss'
})
export class NewsContentComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  apiService = inject(ApiService);
  analyticsService = inject(AnalyticsService);
  sessionService = inject(SessionService);
  news = signal<News | null>(null);
  error = signal<string | null>(null);
  isLoading = signal<boolean>(true);
  relatedNews = signal<News[]>([]);
  moreNews = signal<News[]>([]);
  
  // Analytics tracking
  private sessionId: string = this.sessionService.getSessionId();
  private viewStartTime: number = Date.now();
  private hasTrackedInitialView = false;
  emphasisMedia = computed(() => {
    const currentNews = this.news();
    if (!currentNews) return null;
    return currentNews.mediaNews.find((media: NewsMedia) => media.emphasis);
  });

  // Computed signal para outras mídias
  otherMedias = computed(() => {
    const currentNews = this.news();
    if (!currentNews) return [];
    return currentNews.mediaNews.filter((media: NewsMedia) => !media.emphasis);
  });

  // Computed signal para formatar visualizações
  formattedViews = computed(() => {
    const currentNews = this.news();
    if (!currentNews?.views) return '0 visualizações';
    
    const views = currentNews.views;
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M visualizações';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K visualizações';
    }
    return views.toString() + ' visualizações';
  });

  ngOnInit(): void {
    // Preparado para receber o slug da rota
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      
      if (slug) {
        this.apiService.getNewsBySlug(slug)
          .subscribe({
            next: (news: News | undefined) => {
              if (news) {
                this.news.set(news);
                this.trackInitialView(news);
                this.getRelatedNews();
                this.goToTop();
              }
            },
            error: (err) => {
              console.error('Error fetching news:', err);
              this.error.set("Notícia não encontrada");
            },
            complete: () => {
              this.isLoading.set(false);
            }
          });            
      } 
      
    });
    this.getMoreNews();
  }
  goToTop(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  getRelatedNews() {
    // Agora só precisa passar o newsId, o backend busca as categorias
    this.apiService.getRelatedNews([], this.news()?.id as number)
      .subscribe((news: News[]) => {
        this.relatedNews.set(news);
        console.log(news);
      });
  }

  getMoreNews() {
    this.apiService.getNews()
      .subscribe((news: News[]) => {
        const moreNews = news
        .filter((news) => !this.relatedNews().includes(news))
        this.moreNews.set(moreNews);
      });
  }


  private trackInitialView(news: News): void {
    if (this.hasTrackedInitialView) return;
    
    this.analyticsService.trackNewsView(
      news.id,
      news.slug,
      this.sessionId
    ).subscribe({
      next: (response: any) => {
        console.log('✅ View tracked:', news.slug);
        this.hasTrackedInitialView = true;
        
        // Atualizar o número de visualizações em tempo real se retornado pelo backend
        if (response?.views !== undefined && this.news()) {
          const currentNews = this.news()!;
          this.news.set({
            ...currentNews,
            views: response.views
          });
        }
      },
      error: (err) => {
        console.warn('⚠️ Failed to track view:', err);
      }
    });
  }

 
  ngOnDestroy(): void {
    const currentNews = this.news();
    if (!currentNews || !this.hasTrackedInitialView) return;

    const duration = Math.floor((Date.now() - this.viewStartTime) / 1000);
    
    // Registrar duração apenas se o usuário ficou pelo menos 5 segundos
    if (duration >= 5) {
      this.analyticsService.trackViewDuration(
        currentNews.id,
        `/news/${currentNews.slug}`,
        this.sessionId,
        duration
      ).subscribe({
        next: () => console.log('✅ Duration tracked:', duration, 'seconds'),
        error: (err) => console.warn('⚠️ Failed to track duration:', err)
      });
    }
  }

}
