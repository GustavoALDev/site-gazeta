# Drag and Drop List Component

Componente genérico de lista arrastável (drag-and-drop) com suporte a hierarquia (parent/child).

## Características

✅ **Drag and Drop Hierárquico** - Arraste itens para reordenar ou mover para dentro de parents  
✅ **Content Projection** - Templates customizados via `ng-content`  
✅ **Totalmente Type-Safe** - TypeScript genérico com interfaces  
✅ **Angular 20** - Signals, Control Flow, Standalone Components  
✅ **Altamente Configurável** - Validações e callbacks customizados  

## Uso Básico

```typescript
import { DragAndDropComponent, DraggableListConfig } from '@site-gazeta/components/drag-and-drop';

interface MyItem {
  id: number;
  name: string;
  children?: MyItem[];
}

@Component({
  template: `
    <lib-drag-and-drop 
      [items]="items()" 
      [config]="config"
      listId="my-list"
    >
      <!-- Item Template -->
      <ng-template #itemTemplate let-item let-isExpanded="isExpanded">
        <div class="item-content">
          <span>{{ item.name }}</span>
          @if (isExpanded) {
            <span>▼</span>
          }
        </div>
      </ng-template>

      <!-- Child Template -->
      <ng-template #childTemplate let-child>
        <span>{{ child.name }}</span>
        <button (click)="remove(child.id)">Remove</button>
      </ng-template>
    </lib-drag-and-drop>
  `
})
export class MyComponent {
  items = signal<MyItem[]>([...]);
  
  config: DraggableListConfig<MyItem> = {
    getItemId: (item) => item.id,
    getItemOrder: (item) => item.order || 0,
    isItemExpandable: (item) => item.type === 'folder',
    onReorder: (items) => this.saveOrder(items),
    onMoveToParent: (childId, parentId) => this.moveToParent(childId, parentId),
    onRemoveFromParent: (childId) => this.removeFromParent(childId)
  };
}
```

## Interfaces

### DraggableItem

```typescript
interface DraggableItem {
  id: number | string;
  children?: DraggableItem[];
  [key: string]: any;
}
```

### DraggableListConfig

```typescript
interface DraggableListConfig<T> {
  // Required
  getItemId: (item: T) => number | string;
  
  // Optional
  getItemOrder?: (item: T) => number;
  sortItems?: (items: T[]) => T[];
  isItemExpandable?: (item: T) => boolean;
  hasChildren?: (item: T) => boolean;
  canDropInParent?: (dragged: T, parent: T) => boolean;
  onReorder?: (items: T[]) => void;
  onMoveToParent?: (draggedId: number | string, parentId: number | string) => void;
  onRemoveFromParent?: (childId: number | string) => void;
}
```

## Templates Disponíveis

### `#itemTemplate`
Template do item principal com context `{ $implicit: T, isExpanded: boolean }`

### `#childTemplate`
Template dos children com context `{ $implicit: T }`

### `#emptyTemplate`
Template customizado para lista vazia

### `#childrenEmptyTemplate`
Template customizado para dropzone de children vazia

### `#headerTemplate`
Template para cabeçalho da lista

### `#footerTemplate`
Template para rodapé da lista

## Inputs

- `items: T[]` - Array de itens
- `config: DraggableListConfig<T>` - Configuração de comportamento
- `listId: string` - ID único da lista (default: 'draggable-list')

## Outputs

Todos os eventos são tratados via callbacks no `config`:
- `onReorder` - Quando reordena itens na mesma lista
- `onMoveToParent` - Quando move item para dentro de parent
- `onRemoveFromParent` - Quando remove item do parent