import { Component } from '@angular/core';
import { MenuComponent } from '@site-gazeta/menu';
import { CarouselComponent } from '@site-gazeta/carousel';
import { CarouselSwipeComponent } from '@site-gazeta/carousel';
import { NewsCategoryGridComponent, NewsCategorySectionComponent, NewsHighligthsComponent, NewsClusterComponent  } from '@site-gazeta/home-components';
import { Category, News, NewsVideo } from '@site-gazeta/models';
import { VideoPlayerComponent } from '@site-gazeta/video-player';
import { mockNewsItems, mockCategories } from '@site-gazeta/mock';

@Component({
  selector: 'app-home',
  imports: [
    MenuComponent,
    CarouselComponent,
    CarouselSwipeComponent,
    NewsCategoryGridComponent,
    NewsCategorySectionComponent,
    NewsHighligthsComponent,
    NewsClusterComponent,
    VideoPlayerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected mockNewsItems: News[] = mockNewsItems;
  protected mockCategories: Category[] = mockCategories;
  

  protected mockVideos: NewsVideo[] = [ 
    {
      id: 1,
      title: 'Usina de Tucuruí 01',
      url: 'videos/video1.mp4',
      thumbnail: 'videos/video1.mp4',
      duration: '01:51',
    },
    {
      id: 2,
      title: 'Lula é orientado a manter discurso de soberania | CNN 360º',
      url: 'videos/video2.mp4',
      thumbnail: 'videos/video2.mp4',
      duration: '01:51',
    },
    
  ];
}
