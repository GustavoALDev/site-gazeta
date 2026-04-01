import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News } from '@site-gazeta/models';
import { CarouselComponent } from '../carousel/carousel.component';
import { CarouselSwipeComponent } from '../carousel-swipe/carousel-swipe.component';
import { ApiConfigService } from 'libs/api/service/api-config.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'lib-carousel-manager',
  imports: [CommonModule, CarouselComponent, CarouselSwipeComponent],
  templateUrl: './carousel-manager.component.html',
  styleUrl: './carousel-manager.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CarouselManagerComponent implements OnInit {
  private apiConfigService = inject(ApiConfigService);

  $news = this.apiConfigService.getNewsFeatured();
  $carouselLimit = this.apiConfigService.getCarouselConfig();

  $limitedNews = combineLatest([this.$news, this.$carouselLimit]).pipe(
    map(([news, limit]) => {
      return news.slice(0, limit);
    })
  );

  ngOnInit(): void {
    // Inicialização se necessário
  }
}
