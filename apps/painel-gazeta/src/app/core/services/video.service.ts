import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../env/env';
import { Video } from '@site-gazeta/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/videos`;

  /**
   * Upload de vídeo
   */
  upload(body: FormData): Observable<Video> {
    return this.http.post<Video>(`${this.apiUrl}/upload`, body);
  }

  /**
   * Listar todos os vídeos
   */
  getAll(): Observable<Video[]> {
    return this.http.get<Video[]>(this.apiUrl);
  }

  /**
   * Buscar vídeo por ID
   */
  getById(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiUrl}/${id}`);
  }

  /**
   * Atualizar vídeo
   */
  update(id: number, body: FormData): Observable<Video> {
    return this.http.patch<Video>(`${this.apiUrl}/${id}`, body);
  }

  /**
   * Deletar vídeo
   */
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

