import { Component, inject, signal, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragHandle } from '@angular/cdk/drag-drop';
import { DragAndDropComponent, DraggableListConfig } from '@site-gazeta/drag-and-drop';
import { ApiService } from '../../../core/services/api.service';
import { Menu } from '@site-gazeta/models';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, DragDropModule, DragAndDropComponent, CdkDragHandle],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
})
export class MenuListComponent {
  private apiService = inject(ApiService);

  // Inputs & Outputs
  menus = input.required<Menu[]>();
  onEdit = output<Menu>();
  onDelete = output<number>();
  onReorder = output<Menu[]>();

  // Signals
  isReordering = signal(false);
  menuToDelete = signal<Menu | null>(null);
  showDeleteConfirm = signal(false);

  // Configuração do Drag and Drop
  config: DraggableListConfig<Menu> = {
    getItemId: (item: Menu) => item.id!,
    getItemOrder: (item: Menu) => item.order || 1,
    isItemExpandable: (item: Menu) => item.type === 'submenu',
    canDropInParent: (dragged: Menu, parent: Menu) => {
      // Validações específicas
      if (dragged.type === 'submenu') return false;
      if (dragged.id === parent.id) return false;
      if (dragged.parentId === parent.id) return false;
      return true;
    },
    onReorder: (items: Menu[]) => this.saveOrder(items),
    onMoveToParent: (draggedId: number | string, parentId: number | string) => 
      this.moveToSubmenu(draggedId as number, parentId as number),
    onRemoveFromParent: (childId: number | string) => 
      this.removeFromSubmenu(childId as number),
  };

  private saveOrder(menus: Menu[]): void {
    this.isReordering.set(true);
    const orderData = {
      menus: menus.map(m => ({ id: m.id!, order: m.order || 1 }))
    };

    this.apiService.orderMenu(orderData).subscribe({
      next: () => {
        this.isReordering.set(false);
        this.onReorder.emit(menus);
      },
      error: (err) => {
        this.isReordering.set(false);
        console.error('Erro ao reordenar menus:', err);
      }
    });
  }

  private moveToSubmenu(menuId: number, parentId: number): void {
    this.isReordering.set(true);
    this.apiService.moveMenuToSubmenu(menuId, parentId).subscribe({
      next: () => {
        this.isReordering.set(false);
        this.onReorder.emit([]);
      },
      error: (err) => {
        this.isReordering.set(false);
        console.error('Erro ao mover menu para submenu:', err);
      }
    });
  }

  removeFromSubmenu(childId: number): void {
    this.isReordering.set(true);
    this.apiService.moveMenuToSubmenu(childId, null).subscribe({
      next: () => {
        this.isReordering.set(false);
        this.onReorder.emit([]);
      },
      error: (err) => {
        this.isReordering.set(false);
        console.error('Erro ao remover menu do submenu:', err);
      }
    });
  }

  editMenu(menu: Menu): void {
    this.onEdit.emit(menu);
  }

  confirmDelete(menu: Menu): void {
    this.menuToDelete.set(menu);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.menuToDelete.set(null);
    this.showDeleteConfirm.set(false);
  }

  deleteMenu(): void {
    const menu = this.menuToDelete();
    if (!menu?.id) return;

    this.apiService.deleteMenu(menu.id).subscribe({
      next: () => {
        this.onDelete.emit(menu.id!);
        this.cancelDelete();
        
      },
      error: (err) => {
        console.error('Erro ao deletar menu:', err);
        this.cancelDelete();
      }
    });
  }

  getMenuTypeLabel(type?: string): string {
    const types: Record<string, string> = {
      internal: 'Página Interna',
      externalLink: 'Link Externo',
      category: 'Categoria',
      submenu: 'Submenu'
    };
    return types[type || 'internal'] || 'Desconhecido';
  }

  getMenuTypeIcon(type?: string): string {
    const icons: Record<string, string> = {
      internal: 'home',
      externalLink: 'open_in_new',
      category: 'label',
      submenu: 'arrow_drop_down'
    };
    return icons[type || 'internal'] || 'link';
  }

  getMenuDestination(menu: Menu): string {
    switch (menu.type) {
      case 'internal':
        return menu.routerLink || '/';
      case 'externalLink':
        return menu.externalLink || '';
      case 'category':
        return `/categoria/${menu.slug}`;
      case 'submenu':
        return `${menu.children?.length || 0} item(ns)`;
      default:
        return '-';
    }
  }
}