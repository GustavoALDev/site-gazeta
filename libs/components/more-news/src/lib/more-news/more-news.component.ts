import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Component, input, signal, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, News } from '@site-gazeta/models';
import { EMPTY, Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config.service';

@Component({
  selector: 'lib-more-news',
  imports: [CommonModule, RouterModule],
  templateUrl: './more-news.component.html',
  styleUrl: './more-news.component.scss',
})
export class MoreNewsComponent implements OnInit{
  private apiService = inject(ApiConfigService);
  $moreNews = toSignal(this.apiService.getNews(), { initialValue: [] as News[] });
  moreNews = input<News[]>([]);
  category = input<Category>();
  slice = input<number>(0);
  showNews = signal<number>(0);
  title = input<string>('Mais notícias');

  newsChecked = computed(() => {
    const news = this.moreNews()
    if(news && news.length > 0){
      return news;
    }
    return this.$moreNews();
  });
  currentCategory = computed(() =>{
    const category = this.category();
    console.log(category);
    if(category){
      return category;
    }
    return null;

  });
  ngOnInit(): void {
    this.sliceNews();
  }



  sliceNews(){
    if(this.slice()){
      this.showNews.set(this.slice()!);
    }
  }
  showMoreNews(){
    this.showNews.update(value => value + 3);
  }
}
