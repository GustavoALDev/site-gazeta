# Multi-Select Component

Componente **verdadeiramente genérico** e reutilizável de multi-seleção com suporte a busca, focus/blur e integração com Angular Forms.

## 🚀 Características

- ✅ **Verdadeiramente Genérico**: Aceita **qualquer tipo** de array, apenas requer `id` e `label`
- ✅ **Sem Conversão Necessária**: Preserva **todas** as propriedades dos seus objetos originais
- ✅ **Focus/Blur Inteligente**: Gerencia abertura e fechamento automaticamente
- ✅ **Performance Otimizada**: Usa `OnPush` change detection e signals do Angular
- ✅ **Integração com Forms**: Implementa `ControlValueAccessor` para uso com Reactive e Template Forms
- ✅ **Busca em Tempo Real**: Filtro integrado para grandes listas
- ✅ **Acessibilidade**: ARIA labels e suporte a teclado
- ✅ **Responsivo**: Design adaptável para mobile e desktop
- ✅ **Customizável**: Configuração completa de textos e comportamentos

## 📦 Instalação

```typescript
import { MultiSelectComponent, MultiSelectConfig } from '@site-gazeta/multi-select';
```

## ⚡ Requisitos Mínimos

O componente aceita **qualquer tipo** de array! Seus objetos precisam ter apenas:

```typescript
{
  id: string | number;  // Identificador único
  label: string;        // Texto a ser exibido
}
```

**Todas as outras propriedades são preservadas automaticamente!**

## 🎯 Uso Básico

### Exemplo Simples

```typescript
import { Component, signal } from '@angular/core';
import { MultiSelectComponent } from '@site-gazeta/multi-select';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <multi-select
      [items]="items()"
      [selectedItems]="selectedItems()"
      (selectedItemsChange)="onSelectionChange($event)"
    />
  `
})
export class ExampleComponent {
  items = signal([
    { id: 1, label: 'Item 1', description: 'Descrição do item 1' },
    { id: 2, label: 'Item 2', description: 'Descrição do item 2' },
    { id: 3, label: 'Item 3' }
  ]);

  selectedItems = signal([]);

  onSelectionChange(items: any[]) {
    this.selectedItems.set(items);
  }
}
```

### Exemplo com Seu Tipo (Category[])

```typescript
import { Component, signal, computed } from '@angular/core';
import { MultiSelectComponent } from '@site-gazeta/multi-select';
import { Category } from '@site-gazeta/models';

@Component({
  selector: 'app-category-example',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <multi-select
      [items]="categoriesForSelect()"
      [selectedItems]="selectedForSelect()"
      (selectedItemsChange)="onCategoriesChange($event)"
    />
  `
})
export class CategoryExampleComponent {
  // Suas categorias originais (tipo Category)
  allCategories = signal<Category[]>([
    { id: 1, name: 'Tecnologia', description: 'Tech news', slug: 'tech', active: true },
    { id: 2, name: 'Esportes', description: 'Sports', slug: 'sports', active: true }
  ]);

  selectedCategories = signal<Category[]>([]);

  // Computed: adiciona 'label' para o componente
  categoriesForSelect = computed(() =>
    this.allCategories().map(cat => ({
      ...cat,              // Mantém TODAS as propriedades
      label: cat.name      // Adiciona 'label'
    }))
  );

  selectedForSelect = computed(() =>
    this.selectedCategories().map(cat => ({
      ...cat,
      label: cat.name
    }))
  );

  // Recebe de volta objetos Category completos!
  onCategoriesChange(items: any[]) {
    const categories = items as Category[];
    this.selectedCategories.set(categories);
    
    // Você tem acesso a todas as propriedades originais
    console.log('Slugs:', categories.map(c => c.slug));
  }
}
```

### Exemplo com Configuração Customizada

```typescript
import { Component, signal } from '@angular/core';
import { MultiSelectComponent, MultiSelectConfig } from '@site-gazeta/multi-select';

@Component({
  selector: 'app-example',
  template: `
    <lib-multi-select
      [items]="categories()"
      [selectedItems]="selectedCategories()"
      [config]="config()"
      (selectedItemsChange)="onCategoriesChange($event)"
      (dropdownStateChange)="onDropdownStateChange($event)"
    />
  `
})
export class ExampleComponent {
  config = signal<Partial<MultiSelectConfig>>({
    placeholder: 'Nenhuma categoria selecionada',
    searchPlaceholder: 'Buscar categorias...',
    emptyMessage: 'Nenhuma categoria disponível',
    noResultsMessage: 'Nenhuma categoria encontrada para',
    addButtonLabel: 'Adicionar Categoria',
    addMoreButtonLabel: 'Adicionar mais categorias',
    showSearch: true,
    maxHeight: '300px',
    disabled: false
  });

  categories = signal<MultiSelectItem[]>([
    { id: 1, label: 'Tecnologia', description: 'Artigos sobre tecnologia' },
    { id: 2, label: 'Esportes', description: 'Notícias esportivas' },
    { id: 3, label: 'Política', description: 'Assuntos políticos' }
  ]);

  selectedCategories = signal<MultiSelectItem[]>([]);

  onCategoriesChange(items: MultiSelectItem[]) {
    this.selectedCategories.set(items);
    console.log('Categorias selecionadas:', items);
  }

  onDropdownStateChange(isOpen: boolean) {
    console.log('Dropdown está', isOpen ? 'aberto' : 'fechado');
  }
}
```

### Exemplo com Reactive Forms

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent, MultiSelectItem } from '@site-gazeta/multi-select';

@Component({
  selector: 'app-form-example',
  standalone: true,
  imports: [ReactiveFormsModule, MultiSelectComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <lib-multi-select
        [items]="items"
        formControlName="selectedItems"
      />
      <button type="submit">Enviar</button>
    </form>
  `
})
export class FormExampleComponent {
  form: FormGroup;

  items: MultiSelectItem[] = [
    { id: 1, label: 'Opção 1' },
    { id: 2, label: 'Opção 2' },
    { id: 3, label: 'Opção 3' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedItems: [[]]
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
```

### Exemplo com Items Desabilitados

```typescript
items = signal<MultiSelectItem[]>([
  { id: 1, label: 'Item Normal' },
  { id: 2, label: 'Item Desabilitado', disabled: true },
  { id: 3, label: 'Outro Item Normal' }
]);
```

## 🎓 Uso Genérico

O componente é **verdadeiramente genérico** e não requer conversão de tipos!

✅ **Aceita:** `Category[]`, `Tag[]`, `Author[]`, `Product[]`, ou **qualquer** array  
✅ **Requisito:** Objetos com `id` e `label` (ou mapeie para `label`)  
✅ **Preserva:** TODAS as propriedades originais dos seus objetos

**📖 Veja o guia completo:** [GENERIC_USAGE.md](./GENERIC_USAGE.md)

---

## 🔧 API

### Inputs

| Propriedade | Tipo | Obrigatório | Padrão | Descrição |
|------------|------|-------------|--------|-----------|
| `items` | `any[]` | ✅ | - | Lista de itens (qualquer tipo com `id` e `label`) |
| `selectedItems` | `any[]` | ❌ | `[]` | Itens atualmente selecionados |
| `config` | `Partial<MultiSelectConfig>` | ❌ | `DEFAULT_CONFIG` | Configuração do componente |

### Outputs

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `selectedItemsChange` | `EventEmitter<any[]>` | Emitido quando a seleção muda (retorna os mesmos objetos recebidos) |
| `dropdownStateChange` | `EventEmitter<boolean>` | Emitido quando o dropdown abre/fecha |

### Interfaces

#### MultiSelectItem (Referência)

Esta interface é apenas uma **referência** dos campos mínimos necessários.  
**Você não precisa implementá-la!** Seus objetos apenas precisam ter `id` e `label`.

```typescript
interface MultiSelectItem {
  id: string | number;           // ID único (obrigatório)
  label: string;                 // Texto exibido (obrigatório)
  description?: string;          // Descrição opcional (reconhecido pelo componente)
  disabled?: boolean;            // Se desabilitado (reconhecido pelo componente)
}

// Exemplo: Seu tipo Category funciona se tiver id e label
interface Category {
  id: number;
  name: string;  // mapeia para 'label'
  slug: string;  // preservado
  active: boolean;  // preservado
  // ... qualquer outra propriedade é preservada!
}
```

#### MultiSelectCompatible (Helper Type)

Use este tipo helper para garantir type safety:

```typescript
import { MultiSelectCompatible } from '@site-gazeta/multi-select';

// Garante que tem id e label
type CategoryForSelect = MultiSelectCompatible<Category>;
```

#### MultiSelectConfig

```typescript
interface MultiSelectConfig {
  placeholder?: string;          // Texto quando nenhum item está selecionado
  searchPlaceholder?: string;    // Placeholder do campo de busca
  emptyMessage?: string;         // Mensagem quando não há itens
  noResultsMessage?: string;     // Mensagem quando a busca não retorna resultados
  addButtonLabel?: string;       // Texto do botão adicionar (sem itens)
  addMoreButtonLabel?: string;   // Texto do botão adicionar (com itens)
  showSearch?: boolean;          // Mostrar campo de busca
  maxHeight?: string;            // Altura máxima do dropdown
  disabled?: boolean;            // Desabilitar o componente
}
```

#### Configuração Padrão

```typescript
const DEFAULT_CONFIG: Required<MultiSelectConfig> = {
  placeholder: 'Nenhum item selecionado',
  searchPlaceholder: 'Buscar...',
  emptyMessage: 'Nenhum item disponível',
  noResultsMessage: 'Nenhum item encontrado',
  addButtonLabel: 'Adicionar Item',
  addMoreButtonLabel: 'Adicionar mais itens',
  showSearch: true,
  maxHeight: '250px',
  disabled: false
};
```

## ⌨️ Atalhos de Teclado

- `Escape`: Fecha o dropdown
- `Enter` / `Space`: Seleciona/desseleciona item quando focado
- `Tab`: Navega entre elementos

## 🎨 Customização de Estilos

O componente usa variáveis CSS para fácil customização:

```scss
:root {
  --accent-blue: #0a80c4;
  --accent-red: #eb3237;
  --border: #e0e0e0;
  --light: #f5f5f5;
  --text: #333;
  --text-muted: #999;
  --radius: 8px;
  --transition: 0.2s ease;
}
```

### Customizar Cores

```scss
lib-multi-select {
  --accent-blue: #1976d2;
  --accent-red: #d32f2f;
}
```

## 🔄 Migração do CategoryMultiSelectComponent

Se você está migrando do antigo `CategoryMultiSelectComponent`, siga estas etapas:

### Antes

```typescript
<app-category-multi-select
  [selectedCategories]="selectedCategories()"
  (onCategoriesChange)="onCategoriesChange($event)"
/>
```

### Depois

```typescript
<lib-multi-select
  [items]="categoriesToItems(allCategories())"
  [selectedItems]="categoriesToItems(selectedCategories())"
  [config]="categoryConfig()"
  (selectedItemsChange)="onSelectionChange($event)"
/>
```

```typescript
// Helper para converter Category para MultiSelectItem
categoriesToItems(categories: Category[]): MultiSelectItem[] {
  return categories.map(cat => ({
    id: cat.id,
    label: cat.name,
    description: cat.description,
    // Adicione propriedades customizadas
    ...cat
  }));
}

categoryConfig = signal<Partial<MultiSelectConfig>>({
  placeholder: 'Nenhuma categoria selecionada',
  searchPlaceholder: 'Buscar categoria...',
  addButtonLabel: 'Adicionar Categoria',
  addMoreButtonLabel: 'Adicionar mais categorias'
});
```

## 🐛 Troubleshooting

### O dropdown não fecha ao clicar fora

- Certifique-se de que o evento `blur` está funcionando corretamente
- Verifique se não há `stopPropagation()` bloqueando eventos de click

### Items não aparecem no dropdown

- Verifique se `items` não está vazio
- Confirme que todos os itens têm `id` único e `label`

### Performance lenta com muitos itens

- Considere implementar virtualização para listas > 100 itens
- Use `trackBy` function otimizada (já implementada no componente)

## 📝 Notas de Implementação

### Focus/Blur

O componente usa uma estratégia de focus/blur inteligente:

1. Ao abrir o dropdown, o foco é automaticamente movido para o campo de busca
2. Ao perder o foco (blur), o dropdown fecha automaticamente após um pequeno delay (150ms)
3. O delay evita fechamento acidental ao clicar em elementos internos

### Performance

- **OnPush Change Detection**: Reduz verificações desnecessárias
- **Signals**: Reatividade eficiente do Angular 18+
- **Computed Values**: Cache automático de valores derivados
- **TrackBy**: Otimiza renderização de listas

### Acessibilidade

- ARIA labels para leitores de tela
- Suporte completo a navegação por teclado
- Estados visuais claros (focus, hover, disabled)
- Semântica HTML apropriada

## 📄 Licença

Este componente faz parte do projeto Site Gazeta.
