import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { News, Category } from '@site-gazeta/models';
import { RouterModule } from '@angular/router';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { ApiConfigService } from '../config/api.config.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-news-category-grid',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './news-category-grid.component.html',
  styleUrl: './news-category-grid.component.scss',
})
export class NewsCategoryGridComponent implements OnInit{
  private apiService = inject(ApiConfigService);

  $news = toSignal(
    this.apiService.getCategoryGrid().pipe(tap(news=> console.log(news))),
    { initialValue: [] as { category: Category; news: News[] }[] }
  )

  newsInColumns = computed(() => {
    const categoriesData = this.$news();

    if (!categoriesData || categoriesData.length === 0) {
      return [];
    }

    const result: Array<{ category: Category; featured: News; secondary: News[] }> = [];

    // Itera sobre cada categoria (uma coluna por categoria)
    for (const categoryData of categoriesData) {
      const { category, news } = categoryData;

      if (!news || news.length === 0) {
        continue;
      }

      // Pega apenas as primeiras 3 notícias de cada categoria
      const threeNews = news.slice(0, 3);

      if (threeNews.length > 0 && threeNews[0]) {
        result.push({
          category: category,
          featured: threeNews[0],
          secondary: threeNews.slice(1, 3).filter((item): item is News => item !== undefined)
        });
      }
    }

    return result;
  })

  ngOnInit(): void {
    this.apiService.getNewsForCategory(21).subscribe(news => {
      console.log(news);
    });
  }
}
