import { Component, input, computed, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Category, News } from '@site-gazeta/models';
import { ApiConfigService } from '../config/api.config.service';

interface ProcessedNewsItem {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  imageUrl: string;
  slug: string[];
}

interface CategorySection {
  categoryName: string;
  themeColor: string;
  categoryIds: number[];
  news: ProcessedNewsItem[];
}

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/250x180/cccccc/666666?text=Sem+Imagem';
const MAX_NEWS_PER_SECTION = 3;
const MAX_SECTIONS = 2;

@Component({
  selector: 'lib-news-cluster',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './news-cluster.component.html',
  styleUrl: './news-cluster.component.scss',
})
export class NewsClusterComponent implements OnInit{
  private apiService = inject(ApiConfigService);
  // Inputs
  news = signal<News[]>([]);
  categories = signal<Category[]>([]);
  
  // Computed: organiza as seções de categorias com suas notícias processadas
  categorySections = computed<CategorySection[]>(() => {
    const allNews = this.news();
    console.log(allNews);
    const categories = this.categories();
    
    if (allNews.length === 0 || categories.length === 0) {
      return [];
    }

    // Filtra notícias por categoria (mostra apenas as primeiras 2 categorias)
    return categories
      .slice(0, MAX_SECTIONS)
      .map(category => {
        const categoryNews = allNews
          .filter(news => 
            news.categoryId.some(catId => category.id === catId)
          )
          .slice(0, MAX_NEWS_PER_SECTION)
          .map(news => this.processNewsItem(news));

        return {
          categoryName: category.name,
          themeColor: category.color,
          categoryIds: Array.isArray(category.id) ? category.id : [category.id as number],
          news: categoryNews
        };
      })
      .filter(section => section.news.length > 0); // Remove seções vazias
  });
  ngOnInit(): void {
    this.getCategories();
    this.getNews();
  }

  getCategories(){
    this.apiService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  getNews(){
    this.apiService.getNews().subscribe((news) => {
      this.news.set(news);
    });
  }

  // Processa os dados da notícia uma única vez
  private processNewsItem(news: News): ProcessedNewsItem {
    const imageUrl = news.mediaNews?.[0]?.imgSize
      ? (news.mediaNews[0].imgSize.small || news.mediaNews[0].imgSize.medium || news.mediaNews[0].imgSize.original || DEFAULT_IMAGE_URL)
      : DEFAULT_IMAGE_URL;

    return {
      id: news.id,
      title: news.title || '',
      subtitle: (news as { subtitle?: string }).subtitle,
      author: news.author || '',
      imageUrl,
      slug: news.slug 
        ? ['/news', news.slug]
        : ['/news', String(news.id)]
    };
  }
}
