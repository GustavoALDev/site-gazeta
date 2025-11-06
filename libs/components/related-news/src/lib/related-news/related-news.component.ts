import { Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { News } from '@site-gazeta/models';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'lib-related-news',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './related-news.component.html',
  styleUrl: './related-news.component.scss',
})
export class RelatedNewsComponent {
  
  relatedNews = input<News[]>([]);

  onNewsClick(news: News): void {
    // Aqui você pode implementar a navegação para a notícia
    // Por exemplo: this.router.navigate(['/news', news.slug]);
    console.log('Navegando para notícia:', news.title);
  }
}
