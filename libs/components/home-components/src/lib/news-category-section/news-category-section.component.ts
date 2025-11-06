import { Component, computed, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category, News } from '@site-gazeta/models';


@Component({
  selector: 'lib-news-category-section',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './news-category-section.component.html',
  styleUrl: './news-category-section.component.scss',
})
export class NewsCategorySectionComponent {
  category = input.required<Category>();
  news = input.required<News[]>();
  newslist = computed(() => {
    return this.news().filter(news => news.categoryId.includes(this.category().id as number));
  });
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x180?text=Imagem+Indisponível';
  }
}
