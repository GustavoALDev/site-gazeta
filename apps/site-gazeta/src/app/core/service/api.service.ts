import { inject, Injectable, signal } from '@angular/core';
import { mockCategories, mockNewsItems, mockVideos, mockMenu } from '@site-gazeta/mock';
import { Category, News, Video, Menu, Ads } from '@site-gazeta/models';
import { BehaviorSubject, firstValueFrom, map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../env/env';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  $newsFeatured = new BehaviorSubject<News[]>([]);
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  constructor() { }
  
  getMenu(){
    return this.http.get<Menu[]>(`${this.apiUrl}/menu`);
  }

  getMenuById(id: number){
    return this.http.get(`${this.apiUrl}/menu/${id}`);
  }

  getVideos(){
    return this.http.get<Video[]>(`${this.apiUrl}/videos`);
  }

  getVideosById(id: number) {
    return this.http.get<Video>(`${this.apiUrl}/videos/${id}`);
  }

  getNews(){
    return this.http.get<News[]>(`${this.apiUrl}/news`);
  }

  getNewsById(id: number){
    return this.http.get(`${this.apiUrl}/news/${id}`);
  }
  
  getCategories(){
    return this.http.get<Category[]>(`${this.apiUrl}/categories/all`);
  }

  getActiveCategories(){
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getCategory(id: number){
    return this.http.get(`${this.apiUrl}/categories/${id}`);
  }

  getAds(){
    return this.http.get<Ads[]>(`${this.apiUrl}/advertisements`);
  }

  getAdsById(id: number){
    return this.http.get(`${this.apiUrl}/advertisements/${id}`);
  }

  getAdsByPositionAndPlacement(placement: string,position: string ){
    return this.http.get<Ads[]>(`${this.apiUrl}/advertisements/active/${placement}/${position}`);
  }

  getNewsBySlug(slug: string): Observable<News | undefined> {
    return this.http.get<News>(`${this.apiUrl}/news/slug/${slug}`);
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.http.get<Category>(`${this.apiUrl}/categories/slug/${slug}`)
  }


  getNewsByCategory(categoryId: number): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news`).pipe(
      map((news) => news.filter((news) => news.categoryId.includes(categoryId)))
    )
  }

  getRelatedNews(categoryId: number[], newsId: number): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news`).pipe(
      map((news) => news.filter((news) =>{
        return news.categoryId.some(id => categoryId.includes(id)) && news.id !== newsId
      })) 
    )
  };

  getNewsFeatured() {
    if(this.$newsFeatured.getValue().length <= 0) {
      firstValueFrom(this.http.get<News[]>(`${this.apiUrl}/news/featured`))
      .then(news => {
        this.$newsFeatured.next(news)
      });
    } 
    return this.$newsFeatured.asObservable();
  }

  getNewsForCategory(categoryId: number): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news/category/${categoryId}`);
  }
  getBySearch(search: string, limit?: number): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news/search?search=${search}&limit=${limit}`);
  }
}
