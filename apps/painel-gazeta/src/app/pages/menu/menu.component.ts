import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { ApiService } from '../../core/services/api.service';
import { Menu } from '@site-gazeta/models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuFormComponent, MenuListComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  private apiService = inject(ApiService);

  // Signals
  menus = signal<Menu[]>([]);
  menuToEdit = signal<Menu | null>(null);
  isLoading = signal(false);
  showForm = signal(true);

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.isLoading.set(true);
    this.apiService.getMenu().subscribe({
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
    this.menuToEdit.set(null);
  }

  handleEdit(menu: Menu): void {
    this.menuToEdit.set(menu);
    this.showForm.set(true);
    // Scroll suave para o formulário
    setTimeout(() => {
      const formElement = document.querySelector('.menu-form-section');
      formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
    this.menuToEdit.set(null);
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.menuToEdit.set(null);
    }
  }
}
