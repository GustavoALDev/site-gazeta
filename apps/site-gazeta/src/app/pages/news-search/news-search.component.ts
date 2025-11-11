import { Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/service/api.service';
import { map } from 'rxjs';
import { News } from '@site-gazeta/models';
import { MoreNewsComponent } from '@site-gazeta/more-news';

@Component({
  selector: 'app-news-search',
  imports: [CommonModule, MoreNewsComponent],
  templateUrl: './news-search.component.html',
  styleUrl: './news-search.component.scss',
})
export class NewsSearchComponent implements OnDestroy {
  private apiService = inject(ApiService);
  query = input<string>('');
  filteredNews = signal<News[]>([]);
  isLoading = signal<boolean>(true);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  // Computed que sempre retorna uma string válida para o template
  safeQuery = computed(() => this.query() ?? '');

  constructor() {
    effect(() => {
      const query = this.query() ?? '';
      this.getNewsByQuery(query);
    });
  }

  getNewsByQuery(query: string | null | undefined): void {
    // Limpa timeout anterior se existir
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    // Valida se query é válido
    if (!query || typeof query !== 'string' || query.length <= 1) {
      this.filteredNews.set([]);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.searchTimeout = setTimeout(() => {
      const normalizedQuery = this.regexQuery(query);
      this.apiService.getNews().pipe(
        map((news) => {
          return news.filter((news) => this.searchNews(news, normalizedQuery));
        })
      ).subscribe((news) => {
        this.filteredNews.set(news);
        this.isLoading.set(false);
        this.searchTimeout = null;
      });
    }, 3000);
  }
  
  searchNews(news:News, query:string){
    return this.regexQuery(news.title).includes(query) ||
    this.regexQuery(news.subtitle).includes(query);
  }
  regexQuery(value:string){
    return value.normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/[^\w]/g, '') 
    .toLowerCase(); 
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  }
}
