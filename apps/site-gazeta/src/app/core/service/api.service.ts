import { inject, Injectable } from '@angular/core';
import { Category, News, Video, Menu, Ads, TopCategoriesConfig,SectionOrderConfig, SectionOrderConfigMap } from '@site-gazeta/models';
import { BehaviorSubject, firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import { environment } from '../env/env';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  constructor() { }
  
  getMenu(){
    return this.http.get<Menu[]>(`${this.apiUrl}/menu`);
  }

  getMenuById(id: number){
    return this.http.get(`${this.apiUrl}/menu/${id}`);
  }
  getHomeConfig(){
    return this.http.get<SectionOrderConfig[]>(`${this.apiUrl}/config/sections`);
  }

  getHomeConfigMap(){
    return this.http.get<SectionOrderConfigMap>(`${this.apiUrl}/config/sections-map`);
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
  getAdsByPlacement(placement: string){
    return this.http.get<Ads[]>(`${this.apiUrl}/advertisements/by-page/${placement}`);
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
    // Usa o endpoint correto /news/related-news/:id
    // Este endpoint não suporta exclude (notícias relacionadas devem mostrar todas)
    return this.http.get<News[]>(`${this.apiUrl}/news/related-news/${newsId}`);
  }

  

  getNewsForCategory(categoryId: number): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news/category/${categoryId}`);
  }
  getBySearch(search: string, limit?: number): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news/search?search=${search}&limit=${limit}`);
  }
}
