import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
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

  async getSlug() {
     firstValueFrom(this.router.params).then(async (params) => {
      await this.getCategories(params['slug']);
    });
  }

  getCategories(slug: string) {
    firstValueFrom(this.apiService.getCategoryBySlug(slug)).then((category) => {
      if(category){
        this.category.set(category);
        this.getNewsForCategory(category);
      } else {
        setTimeout(() => {
          this.isLoading.set(false);
        }, 1000);
      }
    });
  }

  getNewsForCategory(category: Category) {
    if (category) {
      this.apiService
        .getNewsByCategory(category.id as number)
        .subscribe((news) => {
          this.news.set(news as News[]);
          setTimeout(() => {
            this.isLoading.set(false);
          }, 1000);
        
        });
    }
  }
}
