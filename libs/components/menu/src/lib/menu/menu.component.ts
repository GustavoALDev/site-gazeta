import { Component, inject, OnDestroy, OnInit, signal, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from '@site-gazeta/dark-mode';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '@site-gazeta/sidebar';
import { Menu } from '@site-gazeta/models';
import { RouterModule } from '@angular/router';
import { ApiService } from 'apps/site-gazeta/src/app/service/api.service';


@Component({
  selector: 'lib-menu',
  imports: [CommonModule, FormsModule, SidebarComponent, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, OnDestroy {
  apiService = inject(ApiService);
  darkModeService = inject(DarkModeService);
  isDarkMode$ = signal<boolean>(false);
  destroy$ = new Subject<void>();
  showSideMenu = signal<boolean>(false);
  // Estados para controle da pesquisa
  showSearchBar = signal<boolean>(false);
  searchTerm = signal<string>('');
  menuItems = signal<Menu[]>([]);
  ngOnInit(): void {
    this.getMenu();
  }
  getMenu() {
    this.apiService.getMenu().subscribe((menu) => {
      this.menuItems.set(menu);
    });
  }
  onSearchClick(): void {
    this.showSearchBar.set(!this.showSearchBar());
    if (this.showSearchBar()) {
      // Foca no input de busca após a animação
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 400);
    } else {
      // Limpa o termo de busca quando fecha
      this.searchTerm.set('');
    }
  }

  onSearch(): void {
    const term = this.searchTerm();
    if (term.trim()) {
      console.log('Pesquisando por:', term);
      // Aqui você pode implementar a lógica de busca
      // Por exemplo, emitir um evento ou navegar para página de resultados
    }
  }

  onCloseSearch(): void {
    this.showSearchBar.set(false);
    this.searchTerm.set('');
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    } else if (event.key === 'Escape') {
      this.onCloseSearch();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showSearchBar()) {
      this.onCloseSearch();
    }
  }

  onToggleSideMenu(): void {
    this.showSideMenu.set(!this.showSideMenu());
  }

  onCloseSideMenu(): void {
    this.showSideMenu.set(false);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
