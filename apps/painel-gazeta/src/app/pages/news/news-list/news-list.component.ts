import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category, News } from '@site-gazeta/models';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AlertService } from '@site-gazeta/alert';
import { NewsListFiltersComponent } from './news-list-filters/news-list-filters.component';


@Component({
  selector: 'app-news-list',
  imports: [CommonModule, RouterModule, NewsListFiltersComponent],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent implements OnInit {

  private newsService = inject(NewsService);
  private categoryService = inject(CategoryService);
  private alertService = inject(AlertService);
  news = signal<News[]>([]);
  categories = signal<Category[]>([])
  newsEmitter = output<News>()


  filterDate = signal<string>('');
  filterOrder = signal<'desc' | 'asc' | null>(null);
  filterViews = signal<'asc' | 'desc' | ''>('');
  filterCategory = signal<number | null>(null);
  filterSearch = signal<string>('');
  filterEmphasis = signal<boolean | null>(null);

  // Signal computado para notícias filtradas
  filteredNews = computed(() => {
    let filtered = this.news();
    // Filtro por data de publicação
    if (this.filterDate()) {
      filtered = filtered.filter(n => n.published?.slice(0, 10) === this.filterDate());
    }
    // Filtro por categoria
    if (this.filterCategory()) {
      filtered = filtered.filter(n => n.categoryId?.includes(this.filterCategory()!));
    }
    // Filtro por destaque
    if (this.filterEmphasis() !== null) {
      filtered = filtered.filter(n => n.isEmphasis === this.filterEmphasis());
    }
    // Filtro por pesquisa
    if (this.filterSearch()) {
      const search = this.filterSearch().toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(search) ||
        n.subtitle?.toLowerCase().includes(search) ||
        n.author?.toLowerCase().includes(search)
      );
    }
    // Ordenação por data (primeiro, se aplicável)
    if (this.filterOrder()) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.published || 0).getTime();
        const dateB = new Date(b.published || 0).getTime();
        return this.filterOrder() === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }
    // Filtro por visualizações (aplicado após ordenação por data)
    if (this.filterViews()) {
      filtered = [...filtered].sort((a, b) => {
        const viewsA = a.views || 0;
        const viewsB = b.views || 0;
        return this.filterViews() === 'asc' ? viewsA - viewsB : viewsB - viewsA;
      });
    }
    return filtered;
  });

  ngOnInit(): void {
    this.getNews();
    this.getCategories();

  }

  getNews(){
    console.log('getNews')
    this.newsService.getAll()
    .subscribe({
      next:(news)=>{
        console.log(news)
        this.news.set(news);
      },
      error:(error)=>{
        throw error;
      }
    });
  };

  getCategories(){
    firstValueFrom(this.categoryService.getAll())
    .then((categories)=>{
      console.log(categories)
      this.categories.set(categories)
    })
    .catch((error)=> {
      throw error
    });
  };

  openNewsInSite(slug: string) {
    // Abre a notícia no site público em nova aba
    // Assumindo que o site está na mesma origem, ajuste conforme necessário
    const siteUrl = window.location.origin.replace(':4201', ':4200') || 'http://localhost:4200';
    const newsUrl = `${siteUrl}/news/${slug}`;
    window.open(newsUrl, '_blank');
  };

  editNews(news:News){
    this.newsEmitter.emit(news)
  }
  deleteNews(idNews:number){
    const conf = confirm('Tem certeza que deseja apagar a notícia?')
    if(conf){
      firstValueFrom(this.newsService.delete(idNews))
      .then((sucess)=>{
        console.log(sucess)
        this.alertService.success('Sucesso', sucess.message)
        //chama a api novamente para atualizar a lista
        this.getNews()
      })
      .catch((error)=>{
        throw error
      });

    }

  }

  // Métodos para atualizar filtros
  setFilterDate(date: string) { this.filterDate.set(date); }
  setFilterOrder(order: 'desc' | 'asc' | null) { this.filterOrder.set(order); }
  setFilterViews(views: 'asc' | 'desc' | '') { this.filterViews.set(views); }
  setFilterCategory(categoryId: number | null) {
    this.filterCategory.set(categoryId);
  }
  setFilterSearch(search: string) { this.filterSearch.set(search); }
  setFilterEmphasis(isEmphasis: boolean | null) { this.filterEmphasis.set(isEmphasis); }

  // Helper para verificar se não tem imagem com emphasis
  hasNoEmphasisImage(news: News): boolean {
    if (!news.mediaNews || news.mediaNews.length === 0) {
      return true;
    }
    return !news.mediaNews.some(m => m.emphasis);
  }
}
