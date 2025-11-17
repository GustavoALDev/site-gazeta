import { Component, input, contentChild, TemplateRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { DraggableItem } from '../interfaces/draggable-item.interface';
import { DraggableListConfig } from '../interfaces/draggable-config.interface';

@Component({
  selector: 'lib-drag-and-drop',
  standalone: true,
  imports: [CommonModule, DragDropModule, CdkDragPlaceholder],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.scss'
})
export class DragAndDropComponent<T extends DraggableItem> {
  // Inputs
  items = input.required<T[]>();
  config = input.required<DraggableListConfig<T>>();
  listId = input('draggable-list');
  
  // Content Projection Templates
  itemTemplate = contentChild<TemplateRef<any>>('itemTemplate');
  childTemplate = contentChild<TemplateRef<any>>('childTemplate');
  emptyTemplate = contentChild<TemplateRef<any>>('emptyTemplate');
  childrenEmptyTemplate = contentChild<TemplateRef<any>>('childrenEmptyTemplate');
  headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');
  footerTemplate = contentChild<TemplateRef<any>>('footerTemplate');

  // Signals
  expandedItems = signal<Set<number | string>>(new Set());

  // Computed
  sortedItems = computed<T[]>(() => {
    const items = [...this.items()] as T[];
    const { getItemOrder, sortItems } = this.config();

    if (sortItems) {
      return sortItems(items);
    }

    if (getItemOrder) {
      return items.sort((a, b) => (getItemOrder(a) || 0) - (getItemOrder(b) || 0));
    }

    return items;
  });

  connectedDropLists = computed<string[]>(() => {
    const config = this.config();
    const sublistIds = this.sortedItems()
      .filter(item => config.isItemExpandable?.(item) ?? this.hasChildren(item))
      .map(item => this.getSubDropListId(item));

    return [this.listId(), ...sublistIds];
  });

  // Template context for child items
  getChildContext(item: T): { $implicit: T } {
    return { $implicit: item };
  }

  // Template context for main items (with expanded state and toggle function)
  getItemContext(item: T): { $implicit: T; isExpanded: boolean; toggle: () => void } {
    return { 
      $implicit: item, 
      isExpanded: this.isItemExpanded(item),
      toggle: () => this.toggleExpand(item)
    };
  }

  // Getters
  getSubDropListId(item: T): string {
    const id = this.config().getItemId(item);
    return `${this.listId()}-child-${id}`;
  }

  isItemExpanded(item: T): boolean {
    const id = this.config().getItemId(item);
    return id !== undefined && this.expandedItems().has(id);
  }

  hasChildren(item: T): boolean {
    const config = this.config();
    if (config.hasChildren) {
      return config.hasChildren(item);
    }
    return !!(item.children && item.children.length > 0);
  }

  // Event Handlers
  toggleExpand(item: T): void {
    const id = this.config().getItemId(item);
    if (id === undefined) return;
    
    const expanded = this.expandedItems();
    const newExpanded = new Set(expanded);

    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }

    this.expandedItems.set(newExpanded);
  }

  dropMain(event: CdkDragDrop<T[], T[], T>): void {
    // Se mudou de container, ignora (tratado por dropInParent)
    if (event.previousContainer !== event.container) {
      return;
    }

    // Reordenação na mesma lista
    const items = [...this.sortedItems()] as T[];
    moveItemInArray(items, event.previousIndex, event.currentIndex);

    // Atualizar a propriedade 'order' de cada item após reordenação
    const config = this.config();
    if (config.getItemOrder) {
      items.forEach((item, index) => {
        // Assumindo que a propriedade order pode ser atualizada
        if ('order' in item) {
          (item as any).order = index + 1;
        }
      });
    }

    // Emit reorder
    config.onReorder?.(items);
  }

  dropInParent(event: CdkDragDrop<T[], T[], T>, parent: T): void {
    const dragged = event.item.data as T;
    const config = this.config();

    // Validar se pode dropar
    if (config.canDropInParent) {
      if (!config.canDropInParent(dragged, parent)) {
        return;
      }
    }

    // Garantir que parent esteja expandido
    if (!this.isItemExpanded(parent)) {
      this.toggleExpand(parent);
    }

    // Emit move to parent
    const draggedId = config.getItemId(dragged);
    const parentId = config.getItemId(parent);
    
    // Só chama callback se ambos IDs estiverem definidos
    if (draggedId !== undefined && parentId !== undefined) {
      config.onMoveToParent?.(draggedId, parentId);
    }
  }

  removeFromParent(child: T): void {
    const config = this.config();
    const childId = config.getItemId(child);
    
    // Só chama callback se ID estiver definido
    if (childId !== undefined) {
      config.onRemoveFromParent?.(childId);
    }
  }

  // Helper para verificar se item é expandável
  isExpandable(item: T): boolean {
    const config = this.config();
    if (config.isItemExpandable) {
      return config.isItemExpandable(item);
    }
    return this.hasChildren(item);
  }

  // Helper para obter children tipados corretamente
  getChildren(item: T): T[] {
    return (item.children || []) as T[];
  }
}