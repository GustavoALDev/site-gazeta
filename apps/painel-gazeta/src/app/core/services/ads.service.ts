import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../env/env';
import { Ads } from '@site-gazeta/models';
import { Observable } from 'rxjs';

interface AdsQueryParams {
  placement?: string;
  position?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/advertisements`;

  /**
   * Criar novo anúncio
   */
  create(body: FormData): Observable<Ads> {
    return this.http.post<Ads>(this.apiUrl, body);
  }

  /**
   * Listar todos os anúncios
   */
  getAll(params?: AdsQueryParams): Observable<Ads[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof AdsQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<Ads[]>(this.apiUrl, { params: httpParams });
  }

  /**
   * Buscar anúncio por ID
   */
  getById(id: number): Observable<Ads> {
    return this.http.get<Ads>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar anúncios ativos por posição e placement
   */
  getByPositionAndPlacement(placement: string, position: string): Observable<Ads[]> {
    return this.http.get<Ads[]>(`${this.apiUrl}/active/${placement}/${position}`);
  }

  /**
   * Atualizar anúncio
   */
  update(id: number, body: FormData): Observable<Ads> {
    return this.http.patch<Ads>(`${this.apiUrl}/${id}`, body);
  }

  /**
   * Alternar status ativo/inativo
   */
  toggleActive(id: number): Observable<Ads> {
    return this.http.patch<Ads>(`${this.apiUrl}/${id}/toggle-active`, {});
  }

  /**
   * Deletar anúncio
   */
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

