import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '@site-gazeta/carousel';
import { CarouselSwipeComponent } from '@site-gazeta/carousel';
import { NewsCategoryGridComponent } from '@site-gazeta/home-components';
import { NewsCategorySectionComponent } from '@site-gazeta/home-components';
import { NewsHighligthsComponent } from '@site-gazeta/home-components';
import { NewsClusterComponent } from '@site-gazeta/home-components';
import { VideoPlayerComponent } from '@site-gazeta/video-player';
import { MoreNewsComponent } from '@site-gazeta/more-news';
import { ApiService } from '../../core/service/api.service';
import { Category, Menu, News, Video } from '@site-gazeta/models';
@Component({
  selector: 'app-home-components',
  imports: [
    CommonModule,
    CarouselComponent,
    CarouselSwipeComponent,
    NewsCategoryGridComponent,
    NewsCategorySectionComponent,
    NewsHighligthsComponent,
    NewsClusterComponent,
    VideoPlayerComponent,
    MoreNewsComponent,
  ],
  templateUrl: './home-components.component.html',
  styleUrl: './home-components.component.scss',
})
export class HomeComponentsComponent implements OnInit{
  private apiService = inject(ApiService);
  protected newsItems = signal<News[]>([]);
  protected categories = signal<Category[]>([]);
  protected videos = signal<Video[]>([]);
  menuItems = signal<Menu[]>([]);
  carouselItems = signal<News[]>([]);
  

  ngOnInit(): void {
    this.getNews();
    this.getCategories();
    this.getVideos();
  }

  getNews() {
    this.apiService.getNews().subscribe((news) => {
      this.newsItems.set(news);
      this.setCarouselItems();
    });
  }

  getCategories() {
    this.apiService.getActiveCategories().subscribe((categories) => {
      this.categories.set(categories.sort(() => Math.random() - 0.5));
    });
  }
  
  getVideos() {
    this.apiService.getVideos().subscribe((videos) => {
      this.videos.set(videos);
    });
  }


  setCarouselItems() {
    const carouselItems = this.newsItems().filter((news)=>{
      return news.isEmphasis;
    })
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    this.carouselItems.set(carouselItems);
  }
 
}
