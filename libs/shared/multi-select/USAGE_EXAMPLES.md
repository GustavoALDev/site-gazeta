# Exemplos de Uso do Multi-Select Component

Exemplos práticos de como usar o componente `MultiSelectComponent` em diferentes cenários.

## 📚 Índice

1. [Exemplo Básico](#exemplo-básico)
2. [Com Categorias](#com-categorias)
3. [Com Tags](#com-tags)
4. [Com Autores](#com-autores)
5. [Com Reactive Forms](#com-reactive-forms)
6. [Com Template Forms](#com-template-forms)
7. [Com Validação](#com-validação)
8. [Com Dados Assíncronos](#com-dados-assíncronos)
9. [Com Filtros Customizados](#com-filtros-customizados)
10. [Com Items Desabilitados](#com-items-desabilitados)

---

## Exemplo Básico

Uso mais simples possível do componente:

```typescript
import { Component, signal } from '@angular/core';
import { MultiSelectComponent, MultiSelectItem } from '@site-gazeta/multi-select';

@Component({
  selector: 'app-basic-example',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <div class="container">
      <h2>Selecione os Itens</h2>
      <lib-multi-select
        [items]="items()"
        [selectedItems]="selectedItems()"
        (selectedItemsChange)="onSelectionChange($event)"
      />
      
      <div class="selection-info">
        <p>Items selecionados: {{ selectedItems().length }}</p>
      </div>
    </div>
  `
})
export class BasicExampleComponent {
  items = signal<MultiSelectItem[]>([
    { id: 1, label: 'Item 1' },
    { id: 2, label: 'Item 2' },
    { id: 3, label: 'Item 3' },
    { id: 4, label: 'Item 4' },
    { id: 5, label: 'Item 5' }
  ]);

  selectedItems = signal<MultiSelectItem[]>([]);

  onSelectionChange(items: MultiSelectItem[]) {
    this.selectedItems.set(items);
    console.log('Seleção alterada:', items);
  }
}
```

---

## Com Categorias

Exemplo real usando categorias de notícias:

```typescript
import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { MultiSelectComponent, MultiSelectItem, MultiSelectConfig } from '@site-gazeta/multi-select';
import { CategoryService } from '../services/category.service';
import { Category } from '@site-gazeta/models';

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <div class="form-group">
      <label for="categories">Categorias da Notícia *</label>
      <lib-multi-select
        [items]="categoryItems()"
        [selectedItems]="selectedCategoryItems()"
        [config]="categoryConfig()"
        (selectedItemsChange)="onCategoryChange($event)"
      />
      <small class="form-text">
        Selecione pelo menos uma categoria para a notícia
      </small>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    
    .form-text {
      display: block;
      margin-top: 0.5rem;
      color: var(--text-muted);
      font-size: 0.875rem;
    }
  `]
})
export class CategorySelectorComponent implements OnInit {
  private categoryService = inject(CategoryService);

  // Dados
  allCategories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);

  // Configuração
  categoryConfig = signal<Partial<MultiSelectConfig>>({
    placeholder: 'Nenhuma categoria selecionada',
    searchPlaceholder: 'Buscar categoria...',
    emptyMessage: 'Nenhuma categoria disponível',
    noResultsMessage: 'Nenhuma categoria encontrada',
    addButtonLabel: 'Adicionar Categoria',
    addMoreButtonLabel: 'Adicionar mais categorias',
    showSearch: true,
    maxHeight: '300px'
  });

  // Computed
  categoryItems = computed(() => 
    this.allCategories().map(cat => ({
      id: cat.id,
      label: cat.name,
      description: cat.description,
      disabled: !cat.active,
      ...cat
    }))
  );

  selectedCategoryItems = computed(() =>
    this.selectedCategories().map(cat => ({
      id: cat.id,
      label: cat.name,
      description: cat.description,
      ...cat
    }))
  );

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getActive().subscribe({
      next: (categories) => this.allCategories.set(categories),
      error: (err) => console.error('Erro ao carregar categorias:', err)
    });
  }

  onCategoryChange(items: MultiSelectItem[]) {
    const categories = items as Category[];
    this.selectedCategories.set(categories);
  }
}
```

---

## Com Tags

Exemplo usando tags para artigos:

```typescript
import { Component, signal } from '@angular/core';
import { MultiSelectComponent, MultiSelectItem, MultiSelectConfig } from '@site-gazeta/multi-select';

interface Tag {
  id: number;
  name: string;
  color: string;
  count: number;
}

@Component({
  selector: 'app-tag-selector',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <div class="tag-selector">
      <h3>Tags do Artigo</h3>
      <lib-multi-select
        [items]="tagItems()"
        [selectedItems]="selectedTagItems()"
        [config]="tagConfig()"
        (selectedItemsChange)="onTagChange($event)"
      />
      
      <div class="tag-preview">
        <h4>Preview das Tags:</h4>
        <div class="tags">
          @for (tag of selectedTags(); track tag.id) {
            <span class="tag" [style.background-color]="tag.color">
              {{ tag.name }}
            </span>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tag-selector {
      padding: 1rem;
    }
    
    .tag-preview {
      margin-top: 1.5rem;
      padding: 1rem;
      background: var(--light);
      border-radius: var(--radius);
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    
    .tag {
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
    }
  `]
})
export class TagSelectorComponent {
  allTags = signal<Tag[]>([
    { id: 1, name: 'Angular', color: '#dd0031', count: 152 },
    { id: 2, name: 'TypeScript', color: '#3178c6', count: 98 },
    { id: 3, name: 'JavaScript', color: '#f7df1e', count: 203 },
    { id: 4, name: 'RxJS', color: '#b7178c', count: 67 },
    { id: 5, name: 'CSS', color: '#264de4', count: 134 }
  ]);

  selectedTags = signal<Tag[]>([]);

  tagConfig = signal<Partial<MultiSelectConfig>>({
    placeholder: 'Nenhuma tag selecionada',
    searchPlaceholder: 'Buscar tags...',
    addButtonLabel: 'Adicionar Tag',
    addMoreButtonLabel: 'Adicionar mais tags',
    maxHeight: '200px'
  });

  tagItems = computed(() =>
    this.allTags().map(tag => ({
      id: tag.id,
      label: tag.name,
      description: `${tag.count} artigos`,
      ...tag
    }))
  );

  selectedTagItems = computed(() =>
    this.selectedTags().map(tag => ({
      id: tag.id,
      label: tag.name,
      ...tag
    }))
  );

  onTagChange(items: MultiSelectItem[]) {
    this.selectedTags.set(items as Tag[]);
  }
}
```

---

## Com Autores

Exemplo para selecionar múltiplos autores:

```typescript
import { Component, signal, computed } from '@angular/core';
import { MultiSelectComponent, MultiSelectItem } from '@site-gazeta/multi-select';

interface Author {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

@Component({
  selector: 'app-author-selector',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <lib-multi-select
      [items]="authorItems()"
      [selectedItems]="selectedAuthorItems()"
      [config]="authorConfig()"
      (selectedItemsChange)="onAuthorChange($event)"
    />
  `
})
export class AuthorSelectorComponent {
  allAuthors = signal<Author[]>([
    { 
      id: 1, 
      name: 'João Silva', 
      email: 'joao@example.com',
      role: 'Editor Chefe'
    },
    { 
      id: 2, 
      name: 'Maria Santos', 
      email: 'maria@example.com',
      role: 'Jornalista'
    },
    { 
      id: 3, 
      name: 'Pedro Oliveira', 
      email: 'pedro@example.com',
      role: 'Colunista'
    }
  ]);

  selectedAuthors = signal<Author[]>([]);

  authorConfig = signal<Partial<MultiSelectConfig>>({
    placeholder: 'Nenhum autor selecionado',
    searchPlaceholder: 'Buscar autor por nome ou email...',
    addButtonLabel: 'Adicionar Autor',
    addMoreButtonLabel: 'Adicionar mais autores'
  });

  authorItems = computed(() =>
    this.allAuthors().map(author => ({
      id: author.id,
      label: author.name,
      description: `${author.role} • ${author.email}`,
      ...author
    }))
  );

  selectedAuthorItems = computed(() =>
    this.selectedAuthors().map(author => ({
      id: author.id,
      label: author.name,
      ...author
    }))
  );

  onAuthorChange(items: MultiSelectItem[]) {
    this.selectedAuthors.set(items as Author[]);
  }
}
```

---

## Com Reactive Forms

Integração completa com formulários reativos:

```typescript
import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent, MultiSelectItem } from '@site-gazeta/multi-select';

@Component({
  selector: 'app-reactive-form-example',
  standalone: true,
  imports: [ReactiveFormsModule, MultiSelectComponent],
  template: `
    <form [formGroup]="newsForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>Título *</label>
        <input 
          type="text" 
          formControlName="title"
          class="form-control">
        @if (newsForm.get('title')?.invalid && newsForm.get('title')?.touched) {
          <small class="error">Título é obrigatório</small>
        }
      </div>

      <div class="form-group">
        <label>Categorias *</label>
        <lib-multi-select
          [items]="categories()"
          formControlName="categories"
          [config]="categoryConfig()"
        />
        @if (newsForm.get('categories')?.invalid && newsForm.get('categories')?.touched) {
          <small class="error">
            Selecione pelo menos uma categoria
          </small>
        }
      </div>

      <button 
        type="submit" 
        [disabled]="newsForm.invalid">
        Publicar Notícia
      </button>
    </form>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .error {
      color: var(--danger);
      font-size: 0.75rem;
      display: block;
      margin-top: 0.25rem;
    }
  `]
})
export class ReactiveFormExampleComponent implements OnInit {
  newsForm!: FormGroup;

  categories = signal<MultiSelectItem[]>([
    { id: 1, label: 'Tecnologia', description: 'Notícias de tech' },
    { id: 2, label: 'Esportes', description: 'Cobertura esportiva' },
    { id: 3, label: 'Política', description: 'Assuntos políticos' }
  ]);

  categoryConfig = signal({
    placeholder: 'Selecione as categorias',
    addButtonLabel: 'Adicionar Categoria'
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      categories: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit() {
    if (this.newsForm.valid) {
      console.log('Form válido:', this.newsForm.value);
      const selectedCategories = this.newsForm.value.categories as MultiSelectItem[];
      console.log('Categorias selecionadas:', selectedCategories);
    }
  }
}
```

---

## Com Template Forms

Usando com Template-driven forms:

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent, MultiSelectItem } from '@site-gazeta/multi-select';

@Component({
  selector: 'app-template-form-example',
  standalone: true,
  imports: [FormsModule, MultiSelectComponent],
  template: `
    <form #newsForm="ngForm" (ngSubmit)="onSubmit(newsForm)">
      <div class="form-group">
        <label>Tags</label>
        <lib-multi-select
          [items]="tags()"
          [(ngModel)]="selectedTags"
          name="tags"
          [config]="tagConfig()"
          required
        />
      </div>

      <button type="submit" [disabled]="newsForm.invalid">
        Salvar
      </button>
    </form>
  `
})
export class TemplateFormExampleComponent {
  tags = signal<MultiSelectItem[]>([
    { id: 1, label: 'Breaking News' },
    { id: 2, label: 'Urgente' },
    { id: 3, label: 'Destaque' }
  ]);

  selectedTags: MultiSelectItem[] = [];

  tagConfig = signal({
    placeholder: 'Selecione as tags',
    addButtonLabel: 'Adicionar Tag'
  });

  onSubmit(form: any) {
    console.log('Form submitted:', form.value);
    console.log('Selected tags:', this.selectedTags);
  }
}
```

---

## Com Validação

Validação customizada:

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MultiSelectComponent, MultiSelectItem } from '@site-gazeta/multi-select';

@Component({
  selector: 'app-validation-example',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <form [formGroup]="form">
      <lib-multi-select
        [items]="items()"
        formControlName="selectedItems"
      />
      
      @if (form.get('selectedItems')?.errors && form.get('selectedItems')?.touched) {
        <div class="errors">
          @if (form.get('selectedItems')?.errors?.['required']) {
            <small>Selecione pelo menos um item</small>
          }
          @if (form.get('selectedItems')?.errors?.['minItems']) {
            <small>Selecione pelo menos 2 itens</small>
          }
          @if (form.get('selectedItems')?.errors?.['maxItems']) {
            <small>Selecione no máximo 5 itens</small>
          }
        </div>
      }
    </form>
  `
})
export class ValidationExampleComponent {
  form: FormGroup;

  items = signal<MultiSelectItem[]>([
    { id: 1, label: 'Item 1' },
    { id: 2, label: 'Item 2' },
    { id: 3, label: 'Item 3' },
    { id: 4, label: 'Item 4' },
    { id: 5, label: 'Item 5' },
    { id: 6, label: 'Item 6' }
  ]);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedItems: [[], [
        this.minItemsValidator(2),
        this.maxItemsValidator(5)
      ]]
    });
  }

  minItemsValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as MultiSelectItem[];
      return value && value.length >= min
        ? null
        : { minItems: { required: min, actual: value?.length || 0 } };
    };
  }

  maxItemsValidator(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as MultiSelectItem[];
      return value && value.length <= max
        ? null
        : { maxItems: { max, actual: value.length } };
    };
  }
}
```

---

## Com Dados Assíncronos

Carregando dados de uma API:

```typescript
import { Component, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MultiSelectComponent, MultiSelectItem } from '@site-gazeta/multi-select';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-async-data-example',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <div class="async-container">
      @if (loading()) {
        <div class="loading">Carregando categorias...</div>
      }
      
      <lib-multi-select
        [items]="items()"
        [selectedItems]="selectedItems()"
        [config]="config()"
        (selectedItemsChange)="onSelectionChange($event)"
      />
      
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
    </div>
  `
})
export class AsyncDataExampleComponent implements OnInit {
  private http = inject(HttpClient);

  items = signal<MultiSelectItem[]>([]);
  selectedItems = signal<MultiSelectItem[]>([]);
  loading = signal(false);
  error = signal<string>('');

  config = signal({
    placeholder: 'Carregando...',
    disabled: true
  });

  ngOnInit() {
    this.loadItems();
  }

  private loadItems() {
    this.loading.set(true);
    this.error.set('');

    this.http.get<any[]>('/api/categories')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          const items = data.map(item => ({
            id: item.id,
            label: item.name,
            description: item.description
          }));
          this.items.set(items);
          
          // Habilitar após carregar
          this.config.set({
            placeholder: 'Selecione as categorias',
            disabled: false
          });
        },
        error: (err) => {
          this.error.set('Erro ao carregar categorias');
          console.error(err);
        }
      });
  }

  onSelectionChange(items: MultiSelectItem[]) {
    this.selectedItems.set(items);
  }
}
```

---

## Com Items Desabilitados

Items que não podem ser selecionados:

```typescript
import { Component, signal } from '@angular/core';
import { MultiSelectComponent, MultiSelectItem } from '@site-gazeta/multi-select';

@Component({
  selector: 'app-disabled-items-example',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <div class="example">
      <h3>Categorias (algumas indisponíveis)</h3>
      <lib-multi-select
        [items]="categories()"
        [selectedItems]="selectedCategories()"
        (selectedItemsChange)="onSelectionChange($event)"
      />
      <small class="info">
        * Categorias em manutenção não podem ser selecionadas
      </small>
    </div>
  `
})
export class DisabledItemsExampleComponent {
  categories = signal<MultiSelectItem[]>([
    { 
      id: 1, 
      label: 'Tecnologia', 
      description: 'Notícias de tech' 
    },
    { 
      id: 2, 
      label: 'Esportes (Em Manutenção)', 
      description: 'Temporariamente indisponível',
      disabled: true 
    },
    { 
      id: 3, 
      label: 'Política', 
      description: 'Assuntos políticos' 
    },
    { 
      id: 4, 
      label: 'Economia (Em Manutenção)', 
      description: 'Categoria em revisão',
      disabled: true 
    },
    { 
      id: 5, 
      label: 'Cultura', 
      description: 'Eventos culturais' 
    }
  ]);

  selectedCategories = signal<MultiSelectItem[]>([]);

  onSelectionChange(items: MultiSelectItem[]) {
    this.selectedCategories.set(items);
  }
}
```

---

## 🎓 Dicas e Boas Práticas

### 1. Use Computed para Transformações

```typescript
// ✅ BOM - computed cacheia automaticamente
categoryItems = computed(() => 
  this.categories().map(cat => this.toCategoryItem(cat))
);

// ❌ RUIM - recalcula a cada change detection
get categoryItems() {
  return this.categories().map(cat => this.toCategoryItem(cat));
}
```

### 2. Mantenha Dados Originais

```typescript
// ✅ BOM - mantém tipo original com spread
{ id: cat.id, label: cat.name, ...cat }

// ❌ RUIM - perde informações
{ id: cat.id, label: cat.name }
```

### 3. Separe Lógica de Conversão

```typescript
// ✅ BOM - funções reutilizáveis
private toMultiSelectItem(item: any): MultiSelectItem { }
private fromMultiSelectItem(item: MultiSelectItem): any { }
```

### 4. Use Type Guards

```typescript
function isCategory(item: MultiSelectItem): item is Category {
  return 'slug' in item && 'active' in item;
}
```

---

## 📚 Recursos Adicionais

- [README Principal](./README.md)
- [Guia de Migração](../../apps/painel-gazeta/src/app/pages/menu/category-multi-select/MIGRATION_GUIDE.md)
- [Documentação da API](#)

