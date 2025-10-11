import { RouterModule } from '@angular/router';
import { Component, input, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, News } from '@site-gazeta/models';

@Component({
  selector: 'lib-more-news',
  imports: [CommonModule, RouterModule],
  templateUrl: './more-news.component.html',
  styleUrl: './more-news.component.scss',
})
export class MoreNewsComponent implements OnInit{
  moreNews = input<News[]>([]);
  category = input<Category>();
  slice = input<number>();
  showNews = signal<number>(0);

  
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
