import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CAROUSEL_CONFIG } from './config';
import { News } from '@site-gazeta/models';
import { BehaviorSubject, Observable, firstValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface CarouselConfig {
  id: number;
  featuredNewsLimit: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private httpClient = inject(HttpClient);
  private apiUrl = inject(CAROUSEL_CONFIG).apiUrl;
  $newsFeatured = new BehaviorSubject<News[]>([]);

  getNewsFeatured(): Observable<News[]> {
    if(this.$newsFeatured.value.length > 0) {
      return this.$newsFeatured.asObservable();
    } else {
      firstValueFrom(this.httpClient.get<News[]>(`${this.apiUrl}/news/featured`))
      .then(news => {
        this.$newsFeatured.next(news);
      });
      return this.$newsFeatured.asObservable();
    }
  }

  getCarouselConfig(): Observable<number> {
    return this.httpClient.get<CarouselConfig | null>(`${this.apiUrl}/config/carousel`).pipe(
      map(config => config?.featuredNewsLimit ?? 5),
      catchError(() => of(5)) // Valor padrão em caso de erro
    );
  }
  
}
