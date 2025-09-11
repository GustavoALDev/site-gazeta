import { Component, input, output, signal, computed, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from '@site-gazeta/models';
import { ApiService } from '../../../core/services/api.service';
import { first, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent {
  private elementRef = inject(ElementRef);
  private apiService = inject(ApiService);
  protected types: {[key: string]: string} = {
    internal: 'Página',
    category: 'Categoria',
    external: 'Link Externo'
  }
  items = input.required<Menu[]>();

  itemsReordered = output<Menu[]>();
  itemDeleted = output<number>();

  draggedItem = signal<Menu | null>(null);
  draggedIndex = signal<number>(-1);
  dropTargetIndex = signal<number>(-1);
  isDragging = signal<boolean>(false);
  itemHeight = signal<number>(0);
  dropIndicatorPosition = signal<'before' | 'after' | null>(null);

  hasItems = computed(() => this.items().length > 0);

  onDragStart(event: DragEvent, item: Menu, index: number): void {
    this.draggedItem.set(item);
    this.draggedIndex.set(index);
    this.isDragging.set(true);

    // Capturar altura do item para cálculos
    const draggedElement = event.target as HTMLElement;
    const itemElement = draggedElement.closest('.menu-item') as HTMLElement;
    if (itemElement) {
      this.itemHeight.set(itemElement.offsetHeight + 8); // +8 para margin
    }

    // Configurar dados de transferência
    event.dataTransfer?.setData('text/plain', '');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';

      // Criar uma imagem de preview customizada
      const dragImage = this.createDragPreview(item);
      event.dataTransfer.setDragImage(dragImage, 10, 10);
    }

    document.body.classList.add('is-dragging');
  }

  private createDragPreview(item: Menu): HTMLElement {
    const preview = document.createElement('div');
    preview.className = 'drag-preview';
    preview.innerHTML = `
      <div class="preview-content">
        <span class="preview-name">${item.name}</span>
        <span class="preview-type">${item.type}</span>
      </div>
    `;
    preview.style.cssText = `
      position: absolute;
      top: -1000px;
      background: white;
      padding: 0.75rem;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      border: 2px solid var(--primary);
      font-size: 0.9rem;
      min-width: 200px;
      z-index: 9999;
    `;
    document.body.appendChild(preview);

    // Remove depois de um tempo
    setTimeout(() => {
      if (document.body.contains(preview)) {
        document.body.removeChild(preview);
      }
    }, 100);

    return preview;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    // Calcular posição do drop target baseado na posição do mouse
    this.updateDropTargetFromEvent(event);
  }

  private updateDropTargetFromEvent(event: DragEvent): void {
    const listElement = this.elementRef.nativeElement.querySelector('.menu-list');
    if (!listElement) return;

    const items = Array.from(listElement.querySelectorAll('.menu-item')) as HTMLElement[];
    const draggedIdx = this.draggedIndex();

    if (draggedIdx === -1) return;

    let targetIndex = -1;
    let indicatorPosition: 'before' | 'after' | null = null;
    const mouseY = event.clientY;

    // Encontrar sobre qual item o mouse está
    for (let i = 0; i < items.length; i++) {
      if (i === draggedIdx) continue;

      const rect = items[i].getBoundingClientRect();
      const itemMiddle = rect.top + (rect.height / 2);

      if (mouseY <= itemMiddle) {
        targetIndex = i;
        indicatorPosition = 'before';
        break;
      }
    }

    // Se não encontrou posição específica, coloca no final
    if (targetIndex === -1) {
      targetIndex = items.length - 1;
      indicatorPosition = 'after';

      // Se o item arrastado é o último, mantém na mesma posição
      if (draggedIdx === items.length - 1) {
        targetIndex = draggedIdx;
        indicatorPosition = null;
      }
    }

    this.dropTargetIndex.set(targetIndex);
    this.dropIndicatorPosition.set(indicatorPosition);
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    const draggedItem = this.draggedItem();
    const draggedIdx = this.draggedIndex();
    const dropTarget = this.dropTargetIndex();

    if (draggedItem && draggedIdx !== -1 && dropTarget !== -1 && draggedIdx !== dropTarget) {
      const currentItems = [...this.items()];

      // Remover o item da posição original
      const [movedItem] = currentItems.splice(draggedIdx, 1);

      // Inserir na nova posição
      const finalTargetIndex = dropTarget > draggedIdx ? dropTarget : dropTarget;
      currentItems.splice(finalTargetIndex, 0, movedItem);

      // Atualizar ordens: garantir que o primeiro seja 1, o segundo 2, etc.
      const updatedItems = currentItems.map((item, index) => ({
        ...item,
        order: index + 1
      }));

      // Salvar a nova ordem na API
      this.saveMenuOrder(updatedItems);
    }

    this.resetDrag();
  }

  private saveMenuOrder(updatedItems: Menu[]): void {
    const menuOrder = updatedItems.map((item)=>{
      return {
        id: item.id as number,
        order: item.order as number
      };
    })
    const menuBody = { menu: menuOrder };
    this.itemsReordered.emit(updatedItems);
    console.log(menuBody);;
    this.apiService.orderMenu({menus:menuOrder}).subscribe({
      next: (response) => {
        console.log('resposta da api', response);
        // Emitir o evento apenas após sucesso na API
        console.log('Ordem do menu salva com sucesso:', response);
      },
      error: (error) => {
        console.error('Erro ao salvar ordem do menu:', error);
        // Aqui você pode adicionar uma notificação de erro para o usuário
        // Por exemplo: this.showError('Erro ao reordenar itens do menu');

        // Reverter para a ordem original em caso de erro
        // (os itens não serão atualizados na UI)
      }
    });
  }

  onDragEnd(event: DragEvent): void {
    this.resetDrag();
  }

  private resetDrag(): void {
    this.draggedItem.set(null);
    this.draggedIndex.set(-1);
    this.dropTargetIndex.set(-1);
    this.isDragging.set(false);
    this.itemHeight.set(0);
    this.dropIndicatorPosition.set(null);
    document.body.classList.remove('is-dragging');
  }

  getItemTransform(index: number): string {
    const draggedIdx = this.draggedIndex();
    const dropTarget = this.dropTargetIndex();
    const itemHeight = this.itemHeight();

    if (!this.isDragging() || draggedIdx === -1 || dropTarget === -1 || draggedIdx === dropTarget) {
      return 'translateY(0)';
    }

    if (index === draggedIdx) {
      return 'translateY(0)';
    }

    let offset = 0;

    if (draggedIdx < dropTarget) {
      if (index > draggedIdx && index <= dropTarget) {
        offset = -itemHeight;
      }
    } else if (draggedIdx > dropTarget) {
      if (index >= dropTarget && index < draggedIdx) {
        offset = itemHeight;
      }
    }

    return `translateY(${offset}px)`;
  }

  getItemClass(index: number): string {
    const classes = ['menu-item'];

    if (index === this.draggedIndex() && this.isDragging()) {
      classes.push('dragging');
    }

    if (index === this.dropTargetIndex() && index !== this.draggedIndex() && this.isDragging()) {
      classes.push('drop-target');
    }

    return classes.join(' ');
  }

  deleteItem(id: number, index: number): void {
    const conf = confirm(`Tem certeza que deseja excluir o item?`);
    if (conf) {
      this.itemDeleted.emit(index);
      firstValueFrom(this.apiService.deleteMenu(id))
      .then(()=>{
        alert('Item excluído com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao excluir item do menu:', error);
        alert('Erro ao excluir item. Tente novamente mais tarde.');
      });


    }
  }

  shouldShowDropIndicator(index: number, position: 'before' | 'after'): boolean {
    if (!this.isDragging()) return false;

    const draggedIdx = this.draggedIndex();
    const dropTarget = this.dropTargetIndex();
    const indicatorPos = this.dropIndicatorPosition();

    if (index === draggedIdx) return false;

    if (position === 'before' && index === dropTarget && indicatorPos === 'before') {
      return true;
    }

    if (position === 'after' && index === dropTarget && indicatorPos === 'after') {
      return true;
    }

    return false;
  }
}
