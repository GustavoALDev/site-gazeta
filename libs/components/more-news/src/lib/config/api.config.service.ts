import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MORE_NEWS_CONFIG } from './config';
import {  News } from '@site-gazeta/models';
import {
  Observable,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private httpClient = inject(HttpClient);
  private apiUrl = inject(MORE_NEWS_CONFIG).apiUrl;



  getNews(): Observable<News[]> {
    return this.httpClient.get<News[]>(`${this.apiUrl}/news`);
  }
  
}
