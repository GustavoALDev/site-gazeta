import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Category, News } from '@site-gazeta/models';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-news-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent implements OnInit {

  private apiService = inject(ApiService);
  news = signal<News[]>([]);
  categories = signal<Category[]>([])
  newsEmitter = output<News>()


  filterDate = signal<string>('');
  filterOrder = signal<'desc' | 'asc'>('desc');
  filterViews = signal<'asc' | 'desc' | ''>('');
  filterCategory = signal<number | null>(null);
  filterSearch = signal<string>('');

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
    // Filtro por pesquisa
    if (this.filterSearch()) {
      const search = this.filterSearch().toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(search) ||
        n.subtitle?.toLowerCase().includes(search) ||
        n.author?.toLowerCase().includes(search)
      );
    }
    // Filtro por visualizações
    if (this.filterViews()) {
      filtered = [...filtered].sort((a, b) => {
        if (this.filterViews() === 'asc') return a.views - b.views;
        else return b.views - a.views;
      });
    }
    // Ordenação por data
    if (this.filterOrder()) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.published).getTime();
        const dateB = new Date(b.published).getTime();
        return this.filterOrder() === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }
    return filtered;
  });

  ngOnInit(): void {
    this.getNews();
    this.getCategories()

  }

  getNews(){
    this.apiService.getNews()
    .subscribe({
      next:(news)=>{
        this.news.set(news); 
      },
      error:(error)=>{
        throw error;
      }
    });
  };

  getCategories(){
    firstValueFrom(this.apiService.getCategories())
    .then((categories)=>{
      console.log(categories)
      this.categories.set(categories) 
    })
    .catch((error)=> {
      throw error
    });
  };

  openNews(){
    //editar quando o front estiver pronto
    return
  };

  editNews(news:News){
    this.newsEmitter.emit(news)
  }
  deleteNews(idNews:number){
    const conf = confirm('Tem certeza que deseja apagar a notícia?')
    if(conf){
      firstValueFrom(this.apiService.deleteNews(idNews))
      .then((sucess)=>{
        console.log(sucess)
        alert(sucess.message)
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
  setFilterOrder(order: 'desc' | 'asc') { this.filterOrder.set(order); }
  setFilterViews(views: 'asc' | 'desc' | '') { this.filterViews.set(views); }
  setFilterCategory(categoryId: string) {
    this.filterCategory.set(categoryId ? Number(categoryId) : null);
  }
  setFilterSearch(search: string) { this.filterSearch.set(search); }
}
