import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News } from '@site-gazeta/models';


@Component({
  selector: 'lib-news-category-section',
  imports: [CommonModule],
  templateUrl: './news-category-section.component.html',
  styleUrl: './news-category-section.component.scss',
})
export class NewsCategorySectionComponent {
  categoryName = input.required<string>();
  categoryColor = input<string>('#7c3aed');
  newsList = input.required<News[]>();

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x180?text=Imagem+Indisponível';
  }
}
