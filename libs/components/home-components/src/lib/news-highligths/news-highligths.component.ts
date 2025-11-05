import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category, News } from '@site-gazeta/models';

interface TopNewsCategory {
  name: string;
  color: string;
  news: News[];
}

@Component({
  selector: 'lib-news-highligths',
  imports: [RouterModule, CommonModule],
  templateUrl: './news-highligths.component.html',
  styleUrl: './news-highligths.component.scss',
})
export class NewsHighligthsComponent {
  // Input signal para receber as notícias mais vistas
  news = input<News[]>([]);

  // Signals para as categorias
  categories = input<Category[]>([]);

  findNewsByCategory = computed(() => {
    return this.categories().map(category => {
      return {
        id: category.id,
        name: category.name,
        color: category.color,
        news: this.filterAndLimitNews(this.news(), category.id as number)
      }
    })
    
  })

  private filterAndLimitNews(news: News[], categoryId: number): News[] {
    return news
      .filter(item => item.categoryId.includes(categoryId))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }
}
