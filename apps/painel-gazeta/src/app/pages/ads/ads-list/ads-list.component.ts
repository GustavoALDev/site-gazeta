import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Ads } from '@site-gazeta/models';

@Component({
  selector: 'app-ads-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss']
})
export class AdsListComponent implements OnInit, OnDestroy {
  apiService = inject(ApiService);
  advertisements: Ads[] = [];
  filteredAdvertisements: Ads[] = [];
  loading = false;
  ExportEditAdvertisement = output<Ads>();
  destroy$ = new Subject<void>();

  // Filtros
  filters = {
    position: '',
    placement: '',
    status: '',
    search: ''
  };

  // Paginação
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  totalPages = 0;
  
  // Opções para filtros
  positions = [
    { value: '', label: 'Todas as posições' },
    { value: 'top', label: 'Topo' },
    { value: 'bottom', label: 'Rodapé' },
    { value: 'sidebar', label: 'Barra Lateral' },
    { value: 'header', label: 'Cabeçalho' },
    { value: 'footer', label: 'Rodapé da Página' },
    { value: 'content', label: 'Conteúdo' }
  ];

  placements = [
    { value: '', label: 'Todas as páginas' },
    { value: 'home', label: 'Home' },
    { value: 'content', label: 'Conteúdo' }
  ];

  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'true', label: 'Ativo' },
    { value: 'false', label: 'Inativo' }
  ];

  ngOnInit(): void {
    this.loadAdvertisements();
  }

  loadAdvertisements(): void {
    this.loading = true;
    this.apiService.getAds()
    .pipe(takeUntil(this.destroy$))
    .subscribe((ads) => {
      console.log(ads);
      this.advertisements = ads;
      this.applyFilters();
      this.loading = false;
    });
  }

  applyFilters(): void {
    let filtered = [...this.advertisements];

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
        ad.description.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredAdvertisements = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1; // Reset para primeira página quando filtrar
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      position: '',
      placement: '',
      status: '',
      search: ''
    };
    this.applyFilters();
  }

  // Métodos de paginação
  get paginatedAdvertisements(): Ads[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAdvertisements.slice(startIndex, endIndex);
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
    console.log('Editar anúncio:', ad);
    this.ExportEditAdvertisement.emit(ad);
  }

  deleteAdvertisement(id: number): void {
    
    if (confirm('Tem certeza que deseja excluir este anúncio?')) {
      console.log('Excluir anúncio:', id);
      this.apiService.deleteAds(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadAdvertisements();
      });
    }
  }

  toggleStatus(ad: Ads): void {
    ad.isActive = !ad.isActive;
    console.log('Alternar status:', ad);
    this.apiService.editAdsStatus(ad.id!, ad)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.loadAdvertisements();
    });
    // Implementar lógica para atualizar status
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
    this.advertisements = [];
    this.destroy$.next();
    this.destroy$.complete();
  }
}
