import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/service/api.service';
import { AnalyticsService } from '../../core/service/analytics.service';
import { SessionService } from '../../core/service/session.service';
import { Category, News } from '@site-gazeta/models';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MoreNewsComponent } from '@site-gazeta/more-news';

@Component({
  selector: 'app-news-category',
  imports: [CommonModule, RouterLink, MoreNewsComponent],
  templateUrl: './news-category.component.html',
  styleUrl: './news-category.component.scss',
})
export class NewsCategoryComponent implements OnInit {
  private apiService = inject(ApiService);
  private analyticsService = inject(AnalyticsService);
  private sessionService = inject(SessionService);
  protected category = signal<Category | null>(null);
  protected news = signal<News[]>([]);
  private router = inject(ActivatedRoute);
  
  protected isLoading = signal<boolean>(true);
  
 
  private emphasisNews = computed(() => {
    return this.news()
      .filter(news => news.isEmphasis === true)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  });

  
  protected featuredNews = computed(() => {
    const emphasisList = this.emphasisNews();
    return emphasisList.length > 0 ? emphasisList[0] : null;
  });


  protected secondaryNews = computed(() => {
    return this.emphasisNews().slice(1, 3);
  });

  
  protected moreNews = computed(() => {
    const emphasisIds = this.emphasisNews().map(news => news.id);
    return this.news()
      .filter(news => !emphasisIds.includes(news.id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  ngOnInit(): void {
    this.getSlug();
  }

  getSlug() {
     this.router.params.subscribe(async (params) => {
      const slug = params['slug'];
      if(slug){
        this.getCategories(slug);
      }
    });
  }

  getCategories(slug: string) {
    firstValueFrom(this.apiService.getCategoryBySlug(slug)).then((category) => {
      console.log(category)
      if(category){
        this.category.set(category);
        this.getNewsForCategory(category);
        this.trackCategoryView(slug);
      } else {
        setTimeout(() => {
          this.isLoading.set(false);
        }, 1000);
      }
    });
  }

  getNewsForCategory(category: Category) {
    if (category) {
      // Usa getNewsForCategory que chama o endpoint correto /news/category/:id
      // Este endpoint suporta o parâmetro 'exclude' via interceptor
      this.apiService.getNewsForCategory(category.id as number)
        .subscribe((news) => {
          this.news.set(news as News[]);
          setTimeout(() => {
            this.isLoading.set(false);
          }, 300);
        
        });
    }
  }

  private trackCategoryView(slug: string): void {
    const sessionId = this.sessionService.getSessionId();
    this.analyticsService.trackPageView(`/category/${slug}`, sessionId).subscribe({
      next: () => console.log('✅ Category page view tracked:', slug),
      error: (err) => console.warn('⚠️ Failed to track category page:', err)
    });
  }
}
