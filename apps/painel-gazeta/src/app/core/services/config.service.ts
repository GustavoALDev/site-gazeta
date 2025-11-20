import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../env/env';
import { Observable } from 'rxjs';
import { CreateDestaqueConfigDto, DestaqueConfig, CreateTopGazetaConfigDto, TopGazetaConfig, CreateSectionOrderDto, SectionOrderConfig, CreateSocialMediaConfigDto, SocialMediaConfig } from '@site-gazeta/models';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/config`;

  
  createDestaque(body: CreateDestaqueConfigDto): Observable<DestaqueConfig> {
    return this.http.post<DestaqueConfig>(`${this.apiUrl}/destaques`, body);
  }

 
  getDestaque(): Observable<DestaqueConfig | null> {
    return this.http.get<DestaqueConfig | null>(`${this.apiUrl}/destaques`);
  }

 
  updateDestaque(body: Partial<CreateDestaqueConfigDto>): Observable<DestaqueConfig> {
    return this.http.patch<DestaqueConfig>(`${this.apiUrl}/destaques`, body);
  }

 
  createTopGazeta(body: CreateTopGazetaConfigDto): Observable<TopGazetaConfig> {
    return this.http.post<TopGazetaConfig>(`${this.apiUrl}/top-gazeta`, body);
  }


  getTopGazeta(): Observable<TopGazetaConfig | null> {
    return this.http.get<TopGazetaConfig | null>(`${this.apiUrl}/top-gazeta`);
  }

 
  updateTopGazeta(body: Partial<CreateTopGazetaConfigDto>): Observable<TopGazetaConfig> {
    return this.http.patch<TopGazetaConfig>(`${this.apiUrl}/top-gazeta`, body);
  }

 
  createSection(body: CreateSectionOrderDto): Observable<SectionOrderConfig> {
    return this.http.post<SectionOrderConfig>(`${this.apiUrl}/sections`, body);
  }


  getSections(): Observable<SectionOrderConfig[]> {
    return this.http.get<SectionOrderConfig[]>(`${this.apiUrl}/sections`);
  }

 
  getSection(sectionId: string): Observable<SectionOrderConfig> {
    return this.http.get<SectionOrderConfig>(`${this.apiUrl}/sections/${sectionId}`);
  }


  updateSection(sectionId: string, body: Partial<CreateSectionOrderDto>): Observable<SectionOrderConfig> {
    return this.http.patch<SectionOrderConfig>(`${this.apiUrl}/sections/${sectionId}`, body);
  }

  
  bulkUpdateSections(sections: CreateSectionOrderDto[]): Observable<SectionOrderConfig[]> {
    return this.http.patch<SectionOrderConfig[]>(`${this.apiUrl}/sections`, { sections });
  }


  deleteSection(sectionId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/sections/${sectionId}`);
  }

  createSocialMedia(body: CreateSocialMediaConfigDto): Observable<SocialMediaConfig> {
    return this.http.post<SocialMediaConfig>(`${this.apiUrl}/social-media`, body);
  }


  getSocialMedia(): Observable<SocialMediaConfig | null> {
    return this.http.get<SocialMediaConfig | null>(`${this.apiUrl}/social-media`);
  }


  updateSocialMedia(body: Partial<CreateSocialMediaConfigDto>): Observable<SocialMediaConfig> {
    return this.http.patch<SocialMediaConfig>(`${this.apiUrl}/social-media`, body);
  }
}

