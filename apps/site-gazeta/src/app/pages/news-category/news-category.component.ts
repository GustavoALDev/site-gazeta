import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/service/api.service';
import { AnalyticsService } from '../../core/service/analytics.service';
import { SessionService } from '../../core/service/session.service';
import { Category, News } from '@site-gazeta/models';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MoreNewsComponent } from '@site-gazeta/more-news';
import { SideNewsComponent } from '@site-gazeta/side-news';

@Component({
  selector: 'app-news-category',
  imports: [CommonModule, RouterLink, MoreNewsComponent, SideNewsComponent],
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
  
  // Signal para controlar loading
  protected isLoading = signal<boolean>(true);
  
  // Computed signals para organizar as notícias no layout
  protected featuredNews = computed(() => {
    const newsList = this.news();
    return newsList.length > 0 ? newsList[0] : null;
  });
  
  protected secondaryNews = computed(() => {
    const newsList = this.news();
    return newsList.slice(1, 3);
  });
  
  protected remainingNews = computed(() => {
    const newsList = this.news();
    return newsList;
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
      this.apiService.getNewsByCategory(category.id as number)
        .subscribe((news) => {
          this.news.set(news as News[]);
          setTimeout(() => {
            this.isLoading.set(false);
          }, 1000);
        
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
