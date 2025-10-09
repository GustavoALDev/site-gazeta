import { Component, input, computed } from '@angular/core';
import { News } from '@site-gazeta/models';

interface CategorySection {
  categoryName: string;
  themeColor: string;
  categoryIds: number[];
  news: News[];
}

interface NewsClusterItem {
  id: number;
  image: string;
  overline: string;
  title: string;
  metadata: string;
}

@Component({
  selector: 'lib-news-cluster',
  standalone: true,
  imports: [],
  templateUrl: './news-cluster.component.html',
  styleUrl: './news-cluster.component.scss',
})
export class NewsClusterComponent {
  // Único input: array de notícias
  news = input.required<News[]>();

  // Mapeamento de categorias e cores (configuração interna)
  private categoryConfig: Record<string, { name: string; color: string; ids: number[] }> = {
    comportamento: {
      name: 'Comportamento',
      color: '#6B46C1', // Roxo
      ids: [1] // IDs das categorias "Comportamento"
    },
    saude: {
      name: 'Saúde e bem-estar',
      color: '#00BCD4', // Azul Ciano
      ids: [2] // IDs das categorias "Saúde"
    },
    politica: {
      name: 'Política',
      color: '#FF5722', // Vermelho
      ids: [3]
    },
    esporte: {
      name: 'Esportes',
      color: '#4CAF50', // Verde
      ids: [4]
    },
    entretenimento: {
      name: 'Entretenimento',
      color: '#FF9800', // Laranja
      ids: [5]
    },
    tecnologia: {
      name: 'Tecnologia',
      color: '#2196F3', // Azul
      ids: [6]
    }
  };

  // Dados mockados para demonstração quando não há notícias reais
  private mockNewsData: Record<string, NewsClusterItem[]> = {
    comportamento: [
      {
        id: 1,
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Noticia+1',
        overline: 'Entenda motivos e como evitar',
        title: 'Número de crianças diagnosticadas com puberdade precoce não para de crescer',
        metadata: 'Saúde · Crescer'
      },
      {
        id: 2,
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Noticia+2',
        overline: 'Tradição nigeriana',
        title: 'Noiva recusa sorrir no casamento até ganhar valor exorbitante em dinheiro; veja',
        metadata: 'Cultura · Marie Claire'
      },
      {
        id: 3,
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Noticia+3',
        overline: "'Fui burra nesse nível'",
        title: 'Shantal diz que ela e Mateus Verdelho querem remover tatuagens e explica',
        metadata: 'Notícias · Quem'
      }
    ],
    saude: [
      {
        id: 4,
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Noticia+4',
        overline: 'Relato da atriz',
        title: 'Flávia Monteiro fala sobre descoberta de um câncer e cirurgia de emergência',
        metadata: 'Famosos · Extra'
      },
      {
        id: 5,
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Noticia+5',
        overline: 'Além de outros nutrientes',
        title: 'Conheça cinco frutas com teor surpreendente de proteína',
        metadata: 'Saúde · g1'
      },
      {
        id: 6,
        image: 'https://via.placeholder.com/250x180/cccccc/666666?text=Noticia+6',
        overline: 'Preenchimento',
        title: "'Quase perdi o pênis': o que está por trás da febre da harmonização no Brasil",
        metadata: 'Saúde · g1'
      }
    ]
  };

  // Computed: organiza as seções de categorias com suas notícias
  categorySections = computed<CategorySection[]>(() => {
    const allNews = this.news();
    
    // Se não houver notícias, usa dados mockados
    if (allNews.length === 0) {
      return [
        {
          categoryName: this.categoryConfig['comportamento'].name,
          themeColor: this.categoryConfig['comportamento'].color,
          categoryIds: this.categoryConfig['comportamento'].ids,
          news: this.mockNewsData['comportamento'] as unknown as News[]
        },
        {
          categoryName: this.categoryConfig['saude'].name,
          themeColor: this.categoryConfig['saude'].color,
          categoryIds: this.categoryConfig['saude'].ids,
          news: this.mockNewsData['saude'] as unknown as News[]
        }
      ];
    }

    // Filtra notícias por categoria
    const sections: CategorySection[] = [];
    
    // Por enquanto, mostra apenas Comportamento e Saúde (como na imagem)
    Object.keys(this.categoryConfig).slice(0, 2).forEach(key => {
      const config = this.categoryConfig[key];
      const categoryNews = allNews
        .filter(news => 
          news.categoryId.some(catId => config.ids.includes(catId))
        )
        .slice(0, 3); // Máximo 3 notícias por seção

      if (categoryNews.length > 0) {
        sections.push({
          categoryName: config.name,
          themeColor: config.color,
          categoryIds: config.ids,
          news: categoryNews
        });
      }
    });

    return sections;
  });

  // Helper: pega a imagem da notícia
  getNewsImage(newsItem: News | NewsClusterItem): string {
    if ('image' in newsItem && newsItem.image) return newsItem.image;
    if ('mediaNews' in newsItem && newsItem.mediaNews && newsItem.mediaNews.length > 0) {
      const media = newsItem.mediaNews[0];
      if (media.imgSize) {
        return media.imgSize.medium || media.imgSize.small || media.imgSize.original;
      }
    }
    return 'https://via.placeholder.com/250x180/cccccc/666666?text=Sem+Imagem';
  }

  // Helper: pega o sobretítulo
  getNewsOverline(newsItem: News | NewsClusterItem): string {
    if ('overline' in newsItem) return newsItem.overline || '';
    if ('subtitle' in newsItem) return newsItem.subtitle || '';
    return '';
  }

  // Helper: pega o título
  getNewsTitle(newsItem: News | NewsClusterItem): string {
    return newsItem.title || '';
  }

  // Helper: pega os metadados
  getNewsMetadata(newsItem: News | NewsClusterItem): string {
    if ('metadata' in newsItem) return newsItem.metadata || '';
    if ('author' in newsItem) return newsItem.author || '';
    return '';
  }
}
