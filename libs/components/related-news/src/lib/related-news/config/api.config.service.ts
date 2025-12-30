import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RELATED_NEWS_CONFIG } from './config';
import { News, Video } from '@site-gazeta/models';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private httpClient = inject(HttpClient);
  private apiUrl = inject(RELATED_NEWS_CONFIG).apiUrl;

  getRelatedNews(newsId: number) {
    return this.httpClient.get<News[]>(`${this.apiUrl}/news/related-news/${newsId}`);
  }
  
}
