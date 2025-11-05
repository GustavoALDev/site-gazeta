import { DraggableItem } from './draggable-item.interface';

/**
 * Configuração para comportamento do draggable list
 */
export interface DraggableListConfig<T extends DraggableItem> {
  /** Função para obter ID único do item */
  getItemId: (item: T) => number | string | undefined;

  /** Função opcional para obter ordem do item (usado para sort) */
  getItemOrder?: (item: T) => number;

  /** Função opcional para ordenar customizada */
  sortItems?: (items: T[]) => T[];

  /** Função para verificar se item pode ser expandido */
  isItemExpandable?: (item: T) => boolean;

  /** Função para verificar se item tem children */
  hasChildren?: (item: T) => boolean;

  /** Função para validar se pode dropar item em parent */
  canDropInParent?: (dragged: T, parent: T) => boolean;

  /** Callback quando reordena itens na mesma lista */
  onReorder?: (items: T[]) => void;

  /** Callback quando move item para dentro de um parent */
  onMoveToParent?: (draggedId: number | string, parentId: number | string) => void;

  /** Callback quando remove item de um parent */
  onRemoveFromParent?: (childId: number | string) => void;
}
