import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../env/env';
import { Category, News } from '@site-gazeta/models';
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
    return this.http.get(`${this.apiUrl}/categories`);
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
    return this.http.post(`${this.apiUrl}/news`, body);
  }
  
}
