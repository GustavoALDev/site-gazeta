import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuComponent } from '@site-gazeta/menu';
import { CarouselComponent } from '@site-gazeta/carousel';
import { CarouselSwipeComponent } from '@site-gazeta/carousel';
import { NewsCategoryGridComponent, NewsCategorySectionComponent, NewsHighligthsComponent, NewsClusterComponent  } from '@site-gazeta/home-components';
import { Category, News, NewsVideo, Video, Menu } from '@site-gazeta/models';
import { VideoPlayerComponent } from '@site-gazeta/video-player';
import { mockNewsItems, mockCategories } from '@site-gazeta/mock';
import { ApiService } from '../../service/api.service';
import { MoreNewsComponent } from '@site-gazeta/more-news';

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
    VideoPlayerComponent,
    MoreNewsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit{
  private apiService = inject(ApiService);
  protected mockNewsItems = signal<News[]>([]);
  protected mockCategories = signal<Category[]>([]);
  protected mockVideos = signal<Video[]>([]);
  

  
  ngOnInit(): void {
    this.getNews();
    this.getVideos();
    this.getCategories();

  }

  getNews() {
    this.apiService.getNews().subscribe((news) => {
      this.mockNewsItems.set(news);
    });
  }

  getCategories() {
    this.apiService.getCategories().subscribe((categories) => {
      this.mockCategories.set(categories.sort(() => Math.random() - 0.5));
    });
    console.log(this.mockCategories());
  }
  
  getVideos() {
    this.apiService.getVideos().subscribe((videos) => {
      this.mockVideos.set(videos);
    });
  }

  
}
