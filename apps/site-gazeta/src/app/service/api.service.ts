import { Injectable } from '@angular/core';
import { mockCategories, mockNewsItems, mockVideos, mockMenu } from '@site-gazeta/mock';
import { Category, News, Video, Menu } from '@site-gazeta/models';
import { BehaviorSubject, map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private mockNews = new BehaviorSubject<News[]>(mockNewsItems);
  private mockCategories = new BehaviorSubject<Category[]>(mockCategories);
  private mockVideos = new BehaviorSubject<Video[]>(mockVideos);
  private mockMenu = new BehaviorSubject<Menu[]>(mockMenu);
  constructor() { }
  getMenu(): Observable<Menu[]> {
    return this.mockMenu.asObservable();
  }
  getVideos(): Observable<Video[]> {
    return this.mockVideos.asObservable();
  }
  getNews(): Observable<News[]> {
    return this.mockNews.asObservable();
  }
  
  getCategories(): Observable<Category[]> {
    return this.mockCategories.asObservable();
  }

  getNewsBySlug(slug: string): Observable<News | undefined> {
    return this.mockNews.pipe(
      map((news) => news.find((news) => news.slug === slug))
    )
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.mockCategories.pipe(
      map((categories) => categories.find((category) => category.slug === slug))
    )
  }


  getNewsByCategory(categoryId: number): Observable<News[]> {
    return this.mockNews.pipe(
      map((news) => news.filter((news) => news.categoryId.includes(categoryId)))
    )
  }
  getRelatedNews(categoryId: number[], newsId: number): Observable<News[]> {
    return this.mockNews.pipe(
      map((news) => news.filter((news) =>{
        return news.categoryId.some(id => categoryId.includes(id)) && news.id !== newsId
      })) 
    )
  }
}
