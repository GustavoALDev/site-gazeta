import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../env/env';
import { Ads, Category, Menu, News, NewsMedia } from '@site-gazeta/models';
import { firstValueFrom, tap } from 'rxjs';

@Injectable({ 
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;  

  setCategory(body: Category){
    return this.http.post(`${this.apiUrl}/categories`, body);
  }

  getCategories(){
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
  
  getCategory(id: number){
    return this.http.get(`${this.apiUrl}/categories/${id}`);
  }
  
  editCategory(id: number, body: Category){
    return this.http.patch(`${this.apiUrl}/categories/${id}`, body)
    .pipe(
      tap(()=>{
        firstValueFrom(this.getCategories())
      })
    );
  }

  deleteCategory(id: number){
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  setNews(body: News){
    return this.http.post<News>(`${this.apiUrl}/news`, body);
  }

  editNews(id: number, body: News){
    return this.http.patch(`${this.apiUrl}/news/${id}`, body);
  }

  getNews(){
    return this.http.get<News[]>(`${this.apiUrl}/news`);
  }

  getNewsById(id: number){
    return this.http.get(`${this.apiUrl}/news/${id}`);
  }

  deleteNews(id: number){
    return this.http.delete<{message:string}>(`${this.apiUrl}/news/${id}`);
  }

  setNewsMedia( body: FormData){
    return this.http.post(`${this.apiUrl}/media/upload`, body).pipe(tap(()=>console.log('upload media')));
  }

  setAds(body: FormData){
    return this.http.post(`${this.apiUrl}/advertisements`, body);
  }

  editAds(id: number, body: FormData){
    return this.http.patch(`${this.apiUrl}/advertisements/${id}`, body);
  }

  editAdsStatus(id: number, body: Ads){
    return this.http.patch(`${this.apiUrl}/advertisements/${id}/toggle-active`, body);
  }

  getAds(){
    return this.http.get<Ads[]>(`${this.apiUrl}/advertisements`);
  }

  getAdsById(id: number){
    return this.http.get(`${this.apiUrl}/advertisements/${id}`);
  }

  getAdsByPositionAndPlacement(position: string, placement: string){
    return this.http.get(`${this.apiUrl}/advertisements/active/${placement}/${position}`);
  }

  deleteAds(id: number){
    return this.http.delete(`${this.apiUrl}/advertisements/${id}`);
  }

  setMenu(body: Menu){
    return this.http.post<Menu>(`${this.apiUrl}/menu`, body);
  }

  editMenu(id: number, body: Menu){
    return this.http.patch(`${this.apiUrl}/menu/${id}`, body);
  }

  orderMenu(body: Menu[]){
    return this.http.patch(`${this.apiUrl}/menu/reorder/batch`, body);
  }

  getMenu(){
    return this.http.get<Menu[]>(`${this.apiUrl}/menu`);
  }

  getMenuById(id: number){
    return this.http.get(`${this.apiUrl}/menu/${id}`);
  }

  deleteMenu(id: number){
    return this.http.delete(`${this.apiUrl}/menu/${id}`);
  }
}
