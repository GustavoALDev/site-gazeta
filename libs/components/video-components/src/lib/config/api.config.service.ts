import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { VIDEO_COMPONENTS_CONFIG } from './config';
import { Video } from '@site-gazeta/models';
import { BehaviorSubject, Observable, firstValueFrom,} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private httpClient = inject(HttpClient);
  private apiUrl = inject(VIDEO_COMPONENTS_CONFIG).apiUrl;
  $videosFeatured = new BehaviorSubject<Video[]>([]);

  getVideosFeatured(): Observable<Video[]> {
    if(this.$videosFeatured.value.length > 0) {
      return this.$videosFeatured.asObservable();
    } else {
      firstValueFrom(this.httpClient.get<Video[]>(`${this.apiUrl}/videos/featured`))
      .then(videos => {
        this.$videosFeatured.next(videos);
      });
      return this.$videosFeatured.asObservable();
    }
  }

  getVideos(): Observable<Video[]> {
    return this.httpClient.get<Video[]>(`${this.apiUrl}/videos`);
  }

  getVideosLatest(): Observable<Video[]> {
    return this.httpClient.get<Video[]>(`${this.apiUrl}/videos/latest`);
  }

  getVideosByCategory(excludeIds?: number[]): Observable<Video[]> {
    let url = `${this.apiUrl}/videos/by-category`;
    if (excludeIds && excludeIds.length > 0) {
      const idsParam = excludeIds.join(',');
      url += `?excludeIds=${idsParam}`;
    }
    return this.httpClient.get<Video[]>(url);
  }

}
