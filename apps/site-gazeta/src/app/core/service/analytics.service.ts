import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../core/env/env';

interface TrackViewData {
  newsId?: number;
  path: string;
  referer?: string;
  sessionId?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  // Analytics está dentro do prefixo /api do backend
  private analyticsUrl = `${environment.apiUrl}/analytics`;

  /**
   * Registra visualização de página
   * Este endpoint é PÚBLICO - não requer autenticação
   */
  trackView(data: TrackViewData): Observable<any> {
    return this.http.post(`${this.analyticsUrl}/track-view`, data).pipe(
      catchError((error) => {
        console.error('Failed to track view:', error);
        // Não propagar erro - tracking não deve quebrar a aplicação
        return [];
      })
    );
  }

  /**
   * Registra visualização de notícia
   */
  trackNewsView(newsId: number, slug: string, sessionId: string): Observable<any> {
    return this.trackView({
      newsId,
      path: `/news/${slug}`,
      referer: document.referrer || undefined,
      sessionId,
    });
  }

  /**
   * Atualiza visualização com duração
   */
  trackViewDuration(
    newsId: number | undefined,
    path: string,
    sessionId: string,
    duration: number
  ): Observable<any> {
    return this.trackView({
      newsId,
      path,
      sessionId,
      duration,
      referer: document.referrer || undefined,
    });
  }

  /**
   * Registra visualização de página genérica
   */
  trackPageView(path: string, sessionId: string): Observable<any> {
    return this.trackView({
      path,
      sessionId,
      referer: document.referrer || undefined,
    });
  }
}

