import { Component, computed, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { News, NewsMedia, Category } from '@site-gazeta/models';
import { mockCategories } from '@site-gazeta/mock';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-news-category-grid',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './news-category-grid.component.html',
  styleUrl: './news-category-grid.component.scss',
})
export class NewsCategoryGridComponent {

  news = input.required<News[]>();

  // Configuração das categorias com suas cores
  categories = input.required<Category[]>();


  categorizedNews = computed(() => {
    const newsData = this.news();
    const configs = this.categories();
    
    return configs
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(category => {
      // Filtra notícias desta categoria
      const categoryNews = newsData.filter(news => 
        news.categoryId.includes(category.id as number)
      );

      // Separa notícia em destaque (isEmphasis) e secundárias
      const featured = categoryNews[0]
      const secondary = categoryNews
        .slice(1,3); // Limita a 2 notícias secundárias

      return {
        category,
        featured,
        secondary
      };
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
