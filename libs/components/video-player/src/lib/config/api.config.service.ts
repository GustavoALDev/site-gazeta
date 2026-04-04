import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { VIDEOS_CONFIG } from './config';
import { Video } from '@site-gazeta/models';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private httpClient = inject(HttpClient);
  private apiUrl = inject(VIDEOS_CONFIG).apiUrl;

  getVideos(){
    return this.httpClient.get<Video[]>(`${this.apiUrl}/videos`);
  };

  
}
