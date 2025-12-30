import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { News } from '@site-gazeta/models';
import { RouterModule } from '@angular/router';
import { ApiConfigService } from './config/api.config.service';
import { map } from 'rxjs';
@Component({
  selector: 'lib-related-news',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './related-news.component.html',
  styleUrl: './related-news.component.scss',
})
export class RelatedNewsComponent {
  private apiService = inject(ApiConfigService);
  currentNews = input.required<News>();
  relatedNews = computed(() => {
    const currentNewsId = this.currentNews().id as number;
    return this.apiService.getRelatedNews(currentNewsId).pipe(
      map((news: News[]) => news.slice(0,4))
    )
  });


}
