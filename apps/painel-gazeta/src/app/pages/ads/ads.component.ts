import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsListComponent } from './ads-list/ads-list.component';
import { AdsFormComponent } from './ads-form/ads-form.component';
import { Ads } from '@site-gazeta/models';

interface AdsComponentState {
  activeTab: 'form' | 'list';
  adToEdit: Ads | null;
}

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [CommonModule, AdsListComponent, AdsFormComponent],
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent {
  // Estado do componente usando signals
  state = signal<AdsComponentState>({
    activeTab: 'list',
    adToEdit: null,
  });

  // Computed signals
  isEdit = computed(() => !!this.state().adToEdit);

  setActiveTab(tab: 'form' | 'list'): void {
    this.state.update(state => ({ 
      ...state, 
      activeTab: tab,
      // Limpa o modo de edição ao trocar para lista OU ao clicar novamente em form (reset)
      adToEdit: null
    }));
  }

  setEditAdvertisement(ad: Ads): void {
    this.state.update(state => ({
      ...state,
      activeTab: 'form',
      adToEdit: ad,
    }));
  }

  onFormSubmitted(): void {
    this.state.update(state => ({
      ...state,
      activeTab: 'list',
      adToEdit: null,
    }));
  }

  onFormCancelled(): void {
    this.state.update(state => ({
      ...state,
      activeTab: 'list',
      adToEdit: null,
    }));
  }
}
