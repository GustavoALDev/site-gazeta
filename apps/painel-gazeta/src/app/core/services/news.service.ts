import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../env/env';
import { News, NewsMedia, NewsVideo } from '@site-gazeta/models';
import { Observable } from 'rxjs';

interface NewsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/news`;

  /**
   * Criar nova notícia
   */
  create(body: News): Observable<News> {
    return this.http.post<News>(this.apiUrl, body);
  }

  /**
   * Listar notícias com filtros opcionais
   */
  getAll(params?: NewsQueryParams): Observable<News[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof NewsQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<News[]>(this.apiUrl, { params: httpParams });
  }

  /**
   * Buscar notícias por termo
   */
  search(searchTerm: string, limit: number = 50): Observable<News[]> {
    const params = new HttpParams()
      .set('search', searchTerm)
      .set('limit', limit.toString());
    
    return this.http.get<News[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Buscar notícia por ID
   */
  getById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar notícia por slug
   */
  getBySlug(slug: string): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/slug/${slug}`);
  }

  /**
   * Atualizar notícia
   */
  update(id: number, body: Partial<News>): Observable<News> {
    return this.http.patch<News>(`${this.apiUrl}/${id}`, body);
  }

  /**
   * Atualizar status da notícia
   */
  updateStatus(id: number, status: string): Observable<News> {
    return this.http.patch<News>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Deletar notícia
   */
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // ========== MEDIA ==========

  /**
   * Upload de mídia para notícia
   */
  uploadMedia(body: FormData): Observable<NewsMedia> {
    return this.http.post<NewsMedia>(`${environment.apiUrl}/media/upload`, body);
  }

  /**
   * Atualizar mídia
   */
  updateMedia(id: number, body: Partial<NewsMedia>): Observable<NewsMedia> {
    return this.http.patch<NewsMedia>(`${environment.apiUrl}/media/${id}`, body);
  }

  /**
   * Deletar mídia
   */
  deleteMedia(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/media/${id}`);
  }

  // ========== VIDEO ==========

  /**
   * Adicionar vídeo à notícia
   */
  addVideo(body: FormData): Observable<NewsVideo> {
    return this.http.post<NewsVideo>(`${environment.apiUrl}/news-videos`, body);
  }

  /**
   * Atualizar vídeo
   */
  updateVideo(id: number, body: Partial<NewsVideo>): Observable<NewsVideo> {
    return this.http.patch<NewsVideo>(`${environment.apiUrl}/news-videos/${id}`, body);
  }

  /**
   * Deletar vídeo
   */
  deleteVideo(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/news-videos/${id}`);
  }
}

