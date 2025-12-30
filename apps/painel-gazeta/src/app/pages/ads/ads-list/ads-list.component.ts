import { Component, inject, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsService } from '../../../core/services/ads.service';
import { Subject, takeUntil } from 'rxjs';
import { Ads } from '@site-gazeta/models';
import { AlertService } from '@site-gazeta/alert';
import { Router } from '@angular/router';
import { AdsListFiltersComponent } from './ads-list-filters/ads-list-filters.component';

@Component({
  selector: 'app-ads-list',
  standalone: true,
  imports: [CommonModule, AdsListFiltersComponent],
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss']
})
export class AdsListComponent implements OnInit, OnDestroy {
  private adsService = inject(AdsService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  
  advertisements = signal<Ads[]>([]);
  loading = signal(false);
  private destroy$ = new Subject<void>();
  
  // Signals para modal de confirmação
  adToDelete = signal<Ads | null>(null);
  showDeleteConfirm = signal(false);

  // Filtros
  filterDate = signal<string>('');
  filterOrder = signal<'desc' | 'asc' | null>(null);
  filterPosition = signal<string>('');
  filterPlacement = signal<string>('');
  filterStatus = signal<boolean | null>(null);
  filterSearch = signal<string>('');

  // Signal computado para anúncios filtrados
  filteredAdvertisements = computed(() => {
    let filtered = this.advertisements();

    // Filtro por data
    if (this.filterDate()) {
      filtered = filtered.filter(ad => {
        if (ad.startDate) {
          return ad.startDate.slice(0, 10) === this.filterDate();
        }
        return false;
      });
    }

    // Filtro por posição
    if (this.filterPosition()) {
      filtered = filtered.filter(ad => ad.position === this.filterPosition());
    }

    // Filtro por página de exibição
    if (this.filterPlacement()) {
      filtered = filtered.filter(ad => ad.placement === this.filterPlacement());
    }

    // Filtro por status
    if (this.filterStatus() !== null) {
      filtered = filtered.filter(ad => ad.isActive === this.filterStatus());
    }

    // Filtro por busca textual
    if (this.filterSearch()) {
      const search = this.filterSearch().toLowerCase();
      filtered = filtered.filter(ad => 
        ad.title.toLowerCase().includes(search) ||
        (ad.description && ad.description.toLowerCase().includes(search))
      );
    }

    // Ordenação por data
    if (this.filterOrder()) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.startDate || 0).getTime();
        const dateB = new Date(b.startDate || 0).getTime();
        return this.filterOrder() === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }

    return filtered;
  });

  ngOnInit(): void {
    this.loadAdvertisements();
  }

  loadAdvertisements(): void {
    this.loading.set(true);
    this.adsService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ads) => {
          this.advertisements.set(ads);
          this.loading.set(false);
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Erro ao carregar anúncios';
          this.alertService.error('Erro ao carregar', errorMessage);
          this.loading.set(false);
        }
      });
  }

  editAdvertisement(ad: Ads): void {
    this.router.navigate(['/ads', ad.id]);
  }

  confirmDelete(ad: Ads): void {
    this.adToDelete.set(ad);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.adToDelete.set(null);
    this.showDeleteConfirm.set(false);
  }

  deleteAdvertisement(): void {
    const ad = this.adToDelete();
    if (!ad?.id) return;

    this.loading.set(true);
    this.adsService.delete(ad.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.advertisements.update(ads => ads.filter(a => a.id !== ad.id));
          this.alertService.success(
            'Anúncio excluído!',
            'O anúncio foi excluído com sucesso'
          );
          this.cancelDelete();
          this.loading.set(false);
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Erro ao excluir anúncio';
          this.alertService.error('Erro ao excluir', errorMessage);
          this.cancelDelete();
          this.loading.set(false);
        }
      });
  }

  toggleStatus(ad: Ads): void {
    const newStatus = !ad.isActive;   
    
    this.adsService.toggleActive(ad.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.advertisements.update(ads => 
            ads.map(a => a.id === ad.id ? { ...a, isActive: newStatus } : a)
          );
          this.alertService.success(
            'Status atualizado!',
            `Anúncio ${newStatus ? 'ativado' : 'desativado'} com sucesso`
          );
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
      'content': 'Conteúdo',
      'header': 'Cabeçalho'
    };
    return placements[placement] || placement;
  }

  // Métodos para atualizar filtros
  setFilterDate(date: string): void {
    this.filterDate.set(date);
  }

  setFilterOrder(order: 'desc' | 'asc' | null): void {
    this.filterOrder.set(order);
  }

  setFilterPosition(position: string): void {
    this.filterPosition.set(position);
  }

  setFilterPlacement(placement: string): void {
    this.filterPlacement.set(placement);
  }

  setFilterStatus(status: boolean | null): void {
    this.filterStatus.set(status);
  }

  setFilterSearch(search: string): void {
    this.filterSearch.set(search);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
