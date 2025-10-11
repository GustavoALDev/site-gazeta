import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News, NewsMedia, Category } from '@site-gazeta/models';
import { mockCategories } from '@site-gazeta/mock';
import { RouterModule } from '@angular/router';


interface CategoryNews {
  category: Category;
  featured: News | null;
  secondary: News[];
}

@Component({
  selector: 'lib-news-category-grid',
  imports: [CommonModule, RouterModule],
  templateUrl: './news-category-grid.component.html',
  styleUrl: './news-category-grid.component.scss',
})
export class NewsCategoryGridComponent {

  news = input.required<News[]>();

  // Configuração das categorias com suas cores
  private categoryConfigs = signal<Category[]>(mockCategories);


  categorizedNews = computed(() => {
    const newsData = this.news();
    const configs = this.categoryConfigs();
    
    return configs
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(category => {
      // Filtra notícias desta categoria
      const categoryNews = newsData.filter(news => 
        news.categoryId.includes(category.id as number)
      );

      // Separa notícia em destaque (isEmphasis) e secundárias
      const featured = categoryNews.find(news => news.isEmphasis) || null;
      const secondary = categoryNews
        .filter(news => !news.isEmphasis)
        .slice(0, 2); // Limita a 2 notícias secundárias

      return {
        category,
        featured,
        secondary
      } as CategoryNews;
    }).filter(item => item.featured || item.secondary.length > 0); // Remove categorias sem notícias
  });

  // Método para obter a imagem principal de uma notícia
  getNewsImage(news: News): string {
    // Procura primeiro por uma mídia com emphasis: true
    const emphasisMedia = news.mediaNews?.find((media: NewsMedia) => media.emphasis);
    
    if (emphasisMedia?.imgSize) {
      // Prioriza medium, depois original, depois small como fallback
      return emphasisMedia.imgSize.medium || 
             emphasisMedia.imgSize.original || 
             emphasisMedia.imgSize.small || 
             'https://via.placeholder.com/400x250?text=Sem+Imagem';
    }
    
    // Se não encontrar mídia com emphasis, pega a primeira disponível
    const firstMedia = news.mediaNews?.[0];
    if (firstMedia?.imgSize) {
      return firstMedia.imgSize.medium || 
             firstMedia.imgSize.original || 
             firstMedia.imgSize.small || 
             'https://via.placeholder.com/400x250?text=Sem+Imagem';
    }
    
    // Fallback final
    return 'https://via.placeholder.com/400x250?text=Sem+Imagem';
  }


  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x250?text=Imagem+Indisponível';
  }
}
