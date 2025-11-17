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

  news = input.required<{featured: News, secondary: News[], category: Category}[]>();
  constructor(){
    console.log('viewport')
  }
}
