import { Component, input, computed } from '@angular/core';
import { News } from '@site-gazeta/models';

interface TopNewsCategory {
  name: string;
  color: string;
  news: News[];
}

@Component({
  selector: 'lib-news-highligths',
  imports: [],
  templateUrl: './news-highligths.component.html',
  styleUrl: './news-highligths.component.scss',
})
export class NewsHighligthsComponent {
  // Input signal para receber as notícias mais vistas
  news = input<News[]>([]);

  // Signals para as categorias
  categories = computed<TopNewsCategory[]>(() => {
    const news = this.news();
    
    // IDs das categorias conforme seu sistema
    const jornalismoId = 1; // Ajuste conforme necessário
    const esporteId = 2;    // Ajuste conforme necessário
    const entretenimentoId = 3; // Ajuste conforme necessário

    return [
      {
        name: 'Jornalismo',
        color: 'jornalismo',
        news: this.filterAndLimitNews(news, jornalismoId)
      },
      {
        name: 'Esporte',
        color: 'esporte',
        news: this.filterAndLimitNews(news, esporteId)
      },
      {
        name: 'Entretenimento',
        color: 'entretenimento',
        news: this.filterAndLimitNews(news, entretenimentoId)
      }
    ];
  });

  private filterAndLimitNews(news: News[], categoryId: number): News[] {
    return news
      .filter(item => item.categoryId.includes(categoryId))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }
}
