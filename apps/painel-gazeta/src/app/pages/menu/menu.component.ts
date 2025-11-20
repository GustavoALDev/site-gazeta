import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuService } from '../../core/services/menu.service';
import { Menu } from '@site-gazeta/models';

interface MenuComponentState {
  activeTab: 'form' | 'list';
  menuToEdit: Menu | null;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuFormComponent, MenuListComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  private menuService = inject(MenuService);

  // Estado do componente usando signals
  state = signal<MenuComponentState>({
    activeTab: 'list',
    menuToEdit: null,
  });

  // Signals para dados
  menus = signal<Menu[]>([]);
  isLoading = signal(false);

  // Computed signals
  isEdit = computed(() => !!this.state().menuToEdit);

  ngOnInit(): void {
    this.loadMenus();
  }

  setActiveTab(tab: 'form' | 'list'): void {
    this.state.update(state => ({ 
      ...state, 
      activeTab: tab,
      // Limpa o modo de edição ao trocar para lista OU ao clicar novamente em form (reset)
      menuToEdit: null
    }));
  }

  loadMenus(): void {
    this.isLoading.set(true);
    this.menuService.getAll().subscribe({
      next: (menus) => {
        console.log('🔄 Menus carregados:', menus);
        this.menus.set(menus);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar menus:', err);
        this.isLoading.set(false);
      }
    });
  }

  handleSave(menu: Menu): void {
    this.loadMenus();
    this.state.update(state => ({
      ...state,
      activeTab: 'list',
      menuToEdit: null,
    }));
  }

  handleEdit(menu: Menu): void {
    this.state.update(state => ({
      ...state,
      activeTab: 'form',
      menuToEdit: menu,
    }));
  }

  handleDelete(menuId: number): void {
    // Recarregar do backend após deletar para garantir consistência
    // (especialmente se for um submenu com children)
    this.loadMenus();
  }

  handleReorder(reorderedMenus: Menu[]): void {
    // Se receber array vazio, significa que precisa recarregar do backend
    // (moveu item para/de submenu)
    if (reorderedMenus.length === 0) {
      this.loadMenus();
    } else {
      // Reordenação simples, atualiza localmente
      this.menus.set(reorderedMenus);
    }
  }

  handleCancel(): void {
    this.state.update(state => ({
      ...state,
      activeTab: 'list',
      menuToEdit: null,
    }));
  }
}
