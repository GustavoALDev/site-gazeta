import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, News } from '@site-gazeta/models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-side-news',
  imports: [CommonModule, RouterModule],
  templateUrl: './side-news.component.html',
  styleUrl: './side-news.component.scss',
})
export class SideNewsComponent {
  newsList = input<News[]>([]);
  title = input<string>('Mais lidas');
  category = input<Category>();
}
