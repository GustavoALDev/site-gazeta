import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { News, NewsMedia } from '@site-gazeta/models';
import { SanitizeUrlPipe } from '../../pipes/sanitize-url.pipe';
import { ApiService } from '../../service/api.service';
import { RouterModule } from '@angular/router';
import { RelatedNewsComponent } from '@site-gazeta/related-news';
import { MoreNewsComponent } from '@site-gazeta/more-news';
@Component({
  selector: 'app-news-content',
  imports: [CommonModule, SanitizeUrlPipe, RouterModule, RelatedNewsComponent, MoreNewsComponent],
  templateUrl: './news-content.component.html',
  styleUrl: './news-content.component.scss'
})
export class NewsContentComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  apiService = inject(ApiService);
  news = signal<News | null>(null);
  isLoading = signal<boolean>(true);
  relatedNews = signal<News[]>([]);
  moreNews = signal<News[]>([]);
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
          .subscribe((news: News | undefined) => {
            if (news) {
              this.news.set(news);
              this.getRelatedNews();
              this.goToTop();
              this.isLoading.set(false);
            } else {
              this.isLoading.set(false);
              this.router.navigate(['/']);
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
    this.apiService.getRelatedNews(this.news()!.categoryId, this.news()?.id as number)
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

}
