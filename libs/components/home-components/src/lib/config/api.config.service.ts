import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HOMECOMPONENTS_CONFIG } from './config';
import { Category, News, PrimaryConfig, SecondaryConfig } from '@site-gazeta/models';
import {
  BehaviorSubject,
  Observable,
  firstValueFrom,
  forkJoin,
  map,
  switchMap,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private httpClient = inject(HttpClient);
  private apiUrl = inject(HOMECOMPONENTS_CONFIG).apiUrl;

  private $mostViewedNews = new BehaviorSubject<News[]>([]);
  private $latestNews = new BehaviorSubject<News[]>([]);


  getHomeCategoryConfig() {
    return this.httpClient.get<{
      primary: PrimaryConfig;
      secondary: SecondaryConfig;
    }>(`${this.apiUrl}/config/top-categories`);
  }

  getNewsForCategory(categoryId: number): Observable<News[]> {
    return this.httpClient.get<News[]>(
      `${this.apiUrl}/news/category/${categoryId}`
    );
  }

  getLatestNews(): Observable<News[]> {
    if (this.$latestNews.value.length > 0) {
      return this.$latestNews.asObservable();
    } else {
      firstValueFrom(
        this.httpClient.get<News[]>(`${this.apiUrl}/news/latest-news`)
      ).then((news) => {
        this.$latestNews.next(news);
      });
      return this.$latestNews.asObservable();
    }
  }

  getMostViewedNews(): Observable<News[]> {
    return this.httpClient.get<News[]>(`${this.apiUrl}/news/most-viewed`);
  }

  getCategoryGrid() {
   return this.getHomeCategoryConfig().pipe(
      switchMap((config) => {
        return forkJoin(config.primary.categories.map(
          category => this.getNewsForCategory(category.id as number).pipe(
            map(news=> {
              return {
                category: category,
                news: news,
              }
            })
          )
        )
      )}),
    );
  }

  gethighlights() {
   return this.getHomeCategoryConfig().pipe(
      switchMap((config) => {
        return forkJoin(config.secondary.categories.map(
          category => this.getNewsForCategory(category.id as number).pipe(
            map(news=> {
              return {
                category: category,
                news: news.slice(0,5),
              }
            })
          )
        )
      )}),
    );
  }

  getNews(): Observable<News[]> {
    return this.httpClient.get<News[]>(`${this.apiUrl}/news`);
  }
  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
