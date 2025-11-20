import { Component, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdsService } from '../../../core/services/ads.service';
import { Subject, takeUntil } from 'rxjs';
import { Ads } from '@site-gazeta/models';
import { AlertService } from '@site-gazeta/alert';
import { AdsFilters, SortConfig } from '@site-gazeta/ads-config';

@Component({
  selector: 'app-ads-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss']
})
export class AdsListComponent implements OnInit, OnDestroy {
  private adsService = inject(AdsService);
  private alertService = inject(AlertService);
  
  advertisements = signal<Ads[]>([]);
  filteredAdvertisements = signal<Ads[]>([]);
  loading = signal(false);
  ExportEditAdvertisement = output<Ads>();
  private destroy$ = new Subject<void>();

  // Filtros com persistência
  private readonly FILTERS_STORAGE_KEY = 'ads-filters';
  filters: AdsFilters = this.loadFiltersFromStorage();

  // Ordenação
  private readonly SORT_STORAGE_KEY = 'ads-sort';
  sortConfig = signal<SortConfig>(this.loadSortFromStorage());

  // Paginação
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  totalPages = 0;
  
  // Opções para filtros
  readonly positions = [
    { value: '', label: 'Todas as posições' },
    { value: 'top', label: 'Topo' },
    { value: 'bottom', label: 'Rodapé' },
    { value: 'sidebar', label: 'Barra Lateral' },
    { value: 'header', label: 'Cabeçalho' },
    { value: 'footer', label: 'Rodapé da Página' },
    { value: 'content', label: 'Conteúdo' }
  ];

  readonly placements = [
    { value: '', label: 'Todas as páginas' },
    { value: 'home', label: 'Home' },
    { value: 'content', label: 'Conteúdo' },
    { value: 'header', label: 'Cabeçalho' }
  ];

  readonly statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'true', label: 'Ativo' },
    { value: 'false', label: 'Inativo' }
  ];

  readonly sortOptions = [
    { field: 'title' as const, label: 'Título' },
    { field: 'priority' as const, label: 'Prioridade' },
    { field: 'startDate' as const, label: 'Data de Início' },
    { field: 'endDate' as const, label: 'Data de Fim' },
    { field: 'isActive' as const, label: 'Status' },
  ];

  ngOnInit(): void {
    this.loadAdvertisements();
  }

  private loadFiltersFromStorage(): AdsFilters {
    const stored = localStorage.getItem(this.FILTERS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultFilters();
      }
    }
    return this.getDefaultFilters();
  }

  private getDefaultFilters(): AdsFilters {
    return {
      position: '',
      placement: '',
      status: '',
      search: ''
    };
  }

  private saveFiltersToStorage(): void {
    localStorage.setItem(this.FILTERS_STORAGE_KEY, JSON.stringify(this.filters));
  }

  private loadSortFromStorage(): SortConfig {
    const stored = localStorage.getItem(this.SORT_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { field: 'priority', direction: 'desc' };
      }
    }
    return { field: 'priority', direction: 'desc' };
  }

  private saveSortToStorage(): void {
    localStorage.setItem(this.SORT_STORAGE_KEY, JSON.stringify(this.sortConfig()));
  }

  loadAdvertisements(): void {
    this.loading.set(true);
    this.adsService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ads) => {
          this.advertisements.set(ads);
          this.applyFilters();
          this.loading.set(false);
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Erro ao carregar anúncios';
          this.alertService.error('Erro ao carregar', errorMessage);
          this.loading.set(false);
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.advertisements()];

    // Filtro por posição
    if (this.filters.position) {
      filtered = filtered.filter(ad => ad.position === this.filters.position);
    }

    // Filtro por página de exibição
    if (this.filters.placement) {
      filtered = filtered.filter(ad => ad.placement === this.filters.placement);
    }

    // Filtro por status
    if (this.filters.status !== '') {
      const isActive = this.filters.status === 'true';
      filtered = filtered.filter(ad => ad.isActive === isActive);
    }

    // Filtro por busca textual
    if (this.filters.search.trim()) {
      const searchTerm = this.filters.search.toLowerCase().trim();
      filtered = filtered.filter(ad => 
        ad.title.toLowerCase().includes(searchTerm) ||
        (ad.description && ad.description.toLowerCase().includes(searchTerm))
      );
    }

    // Aplicar ordenação
    filtered = this.applySorting(filtered);

    this.filteredAdvertisements.set(filtered);
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    
    // Salvar filtros
    this.saveFiltersToStorage();
  }

  private applySorting(ads: Ads[]): Ads[] {
    const sort = this.sortConfig();
    return [...ads].sort((a, b) => {
      let aValue: any = a[sort.field as keyof Ads];
      let bValue: any = b[sort.field as keyof Ads];

      // Tratamento especial para datas
      if (sort.field === 'startDate' || sort.field === 'endDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Tratamento para booleanos
      if (typeof aValue === 'boolean') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }

      // Tratamento para strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }

      if (aValue < bValue) {
        return sort.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sort.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(field: SortConfig['field']): void {
    const current = this.sortConfig();
    if (current.field === field) {
      // Alternar direção
      this.sortConfig.set({
        field,
        direction: current.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Novo campo, começar com ascendente
      this.sortConfig.set({ field, direction: 'asc' });
    }
    this.saveSortToStorage();
    this.applyFilters();
  }

  getSortIcon(field: SortConfig['field']): string {
    const current = this.sortConfig();
    if (current.field !== field) {
      return 'unfold_more';
    }
    return current.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  clearFilters(): void {
    this.filters = this.getDefaultFilters();
    this.saveFiltersToStorage();
    this.applyFilters();
  }

  // Métodos de paginação
  get paginatedAdvertisements(): Ads[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAdvertisements().slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  editAdvertisement(ad: Ads): void {
    this.ExportEditAdvertisement.emit(ad);
  }

  deleteAdvertisement(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) {
      return;
    }

    this.loading.set(true);
    this.adsService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.alertService.success(
            'Anúncio excluído!',
            'O anúncio foi excluído com sucesso'
          );
          this.loadAdvertisements();
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Erro ao excluir anúncio';
          this.alertService.error('Erro ao excluir', errorMessage);
          this.loading.set(false);
        }
      });
  }

  toggleStatus(ad: Ads): void {
    const newStatus = !ad.isActive;   
    
    this.adsService.toggleActive(ad.id!).subscribe({
      next: () => {
          this.alertService.success(
            'Status atualizado!',
            `Anúncio ${newStatus ? 'ativado' : 'desativado'} com sucesso`
          );
          this.loadAdvertisements();
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Erro ao alterar status';
          this.alertService.error('Erro ao alterar status', errorMessage);
        }
      });
  }

  getPositionLabel(position: string): string {
    const positions: { [key: string]: string } = {
      'top': 'Topo',
      'bottom': 'Rodapé',
      'sidebar': 'Barra Lateral',
      'header': 'Cabeçalho',
      'footer': 'Rodapé da Página',
      'content': 'Conteúdo'
    };
    return positions[position] || position;
  }

  getPlacementLabel(placement: string): string {
    const placements: { [key: string]: string } = {
      'home': 'Home',
      'content': 'Conteúdo'
    };
    return placements[placement] || placement;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
