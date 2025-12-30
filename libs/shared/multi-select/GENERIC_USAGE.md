# 🎯 Uso Genérico do Multi-Select Component

O componente Multi-Select é **verdadeiramente genérico** e aceita **qualquer tipo de array**, desde que os objetos tenham pelo menos as propriedades `id` e `label`.

## 🔑 Requisitos Mínimos

Seus objetos precisam ter **apenas** estas propriedades:

```typescript
{
  id: string | number;  // Identificador único
  label: string;        // Texto a ser exibido
}
```

**Todas as outras propriedades são preservadas!** O componente não modifica nem transforma seus dados.

---

## ✅ Uso Direto com Seus Tipos

### Exemplo 1: Category[] (sem conversão!)

```typescript
import { Component, signal } from '@angular/core';
import { MultiSelectComponent } from '@site-gazeta/multi-select';

interface Category {
  id: number;
  name: string;        // será usado como 'label'
  description: string;
  slug: string;
  active: boolean;
  createdAt: Date;
  // ... outras propriedades
}

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <multi-select
      [items]="getCategoriesForSelect()"
      [selectedItems]="getSelectedForSelect()"
      (selectedItemsChange)="onCategoriesChange($event)"
    />
  `
})
export class NewsFormComponent {
  // Suas categorias originais
  allCategories = signal<Category[]>([
    { 
      id: 1, 
      name: 'Tecnologia', 
      description: 'Notícias tech',
      slug: 'tecnologia',
      active: true,
      createdAt: new Date()
    },
    // ...
  ]);

  selectedCategories = signal<Category[]>([]);

  // Método simples que mapeia 'name' para 'label'
  getCategoriesForSelect() {
    return this.allCategories().map(cat => ({
      ...cat,           // Mantém TODAS as propriedades
      label: cat.name   // Adiciona 'label' que o componente precisa
    }));
  }

  getSelectedForSelect() {
    return this.selectedCategories().map(cat => ({
      ...cat,
      label: cat.name
    }));
  }

  // Recebe de volta o tipo Category completo!
  onCategoriesChange(items: any[]) {
    // Items são seus objetos Category originais
    const categories = items as Category[];
    this.selectedCategories.set(categories);
  }
}
```

### Exemplo 2: Tag[] (direto!)

```typescript
interface Tag {
  id: string;
  label: string;  // Já tem 'label'!
  color: string;
  count: number;
}

@Component({
  template: `
    <multi-select
      [items]="tags()"
      [selectedItems]="selectedTags()"
      (selectedItemsChange)="selectedTags.set($event)"
    />
  `
})
export class TagsComponent {
  // Tags já têm id e label, use direto!
  tags = signal<Tag[]>([
    { id: '1', label: 'Angular', color: '#dd0031', count: 150 },
    { id: '2', label: 'TypeScript', color: '#3178c6', count: 98 }
  ]);

  selectedTags = signal<Tag[]>([]);
}
```

### Exemplo 3: Author[] (com mapeamento)

```typescript
interface Author {
  id: number;
  fullName: string;  // Campo diferente de 'label'
  email: string;
  role: string;
  avatar?: string;
}

@Component({
  template: `
    <multi-select
      [items]="authorsForSelect()"
      [selectedItems]="selectedAuthorsForSelect()"
      (selectedItemsChange)="handleAuthorsChange($event)"
    />
  `
})
export class AuthorsComponent {
  authors = signal<Author[]>([
    { 
      id: 1, 
      fullName: 'João Silva',
      email: 'joao@email.com',
      role: 'Editor',
      avatar: 'avatar.jpg'
    }
  ]);

  selectedAuthors = signal<Author[]>([]);

  // Computed para conversão automática
  authorsForSelect = computed(() =>
    this.authors().map(author => ({
      ...author,
      label: author.fullName,
      description: `${author.role} • ${author.email}`
    }))
  );

  selectedAuthorsForSelect = computed(() =>
    this.selectedAuthors().map(author => ({
      ...author,
      label: author.fullName
    }))
  );

  handleAuthorsChange(items: any[]) {
    this.selectedAuthors.set(items as Author[]);
  }
}
```

---

## 🎨 Propriedades Opcionais

Além de `id` e `label`, o componente reconhece estas propriedades opcionais:

### `description?: string`
Texto secundário exibido abaixo do label

```typescript
{
  id: 1,
  label: 'Tecnologia',
  description: 'Notícias sobre tech'  // ← Exibido no dropdown
}
```

### `disabled?: boolean`
Desabilita a seleção do item

```typescript
{
  id: 2,
  label: 'Em Manutenção',
  disabled: true  // ← Não pode ser selecionado
}
```

---

## 🔄 Padrões de Uso Comum

### Padrão 1: Helper Computed (Recomendado)

```typescript
export class MeuComponente {
  // Seus dados originais
  myData = signal<MyType[]>([]);
  selectedData = signal<MyType[]>([]);

  // Computed para conversão (só recalcula quando necessário)
  myDataForSelect = computed(() =>
    this.myData().map(item => ({
      ...item,
      label: item.nameField,  // Mapeia seu campo para 'label'
      description: item.descField  // Opcional
    }))
  );

  selectedForSelect = computed(() =>
    this.selectedData().map(item => ({
      ...item,
      label: item.nameField
    }))
  );

  handleChange(items: any[]) {
    this.selectedData.set(items as MyType[]);
  }
}
```

### Padrão 2: Helper Functions

```typescript
export class MeuComponente {
  myData = signal<MyType[]>([]);
  selectedData = signal<MyType[]>([]);

  toSelectFormat(items: MyType[]) {
    return items.map(item => ({
      ...item,
      label: item.nameField
    }));
  }

  handleChange(items: any[]) {
    this.selectedData.set(items as MyType[]);
  }
}

// Template
<multi-select
  [items]="toSelectFormat(myData())"
  [selectedItems]="toSelectFormat(selectedData())"
  (selectedItemsChange)="handleChange($event)"
/>
```

### Padrão 3: Tipos Que Já Têm 'label'

```typescript
// Se seu tipo já tem 'label', use direto!
interface MyType {
  id: number;
  label: string;  // ✅ Pronto para usar
  otherField: string;
}

// Template - direto!
<multi-select
  [items]="myData()"
  [selectedItems]="selectedData()"
  (selectedItemsChange)="selectedData.set($event)"
/>
```

---

## 💡 Dicas e Boas Práticas

### ✅ Use Computed para Performance

```typescript
// ✅ BOM - Cached, recalcula só quando necessário
categoriesForSelect = computed(() =>
  this.categories().map(c => ({ ...c, label: c.name }))
);

// ❌ RUIM - Recalcula a cada change detection
getCategoriesForSelect() {
  return this.categories().map(c => ({ ...c, label: c.name }));
}
```

### ✅ Mantenha Todas as Propriedades

```typescript
// ✅ BOM - Mantém tudo
{ ...category, label: category.name }

// ❌ RUIM - Perde dados
{ id: category.id, label: category.name }
```

### ✅ Type Cast no Handler

```typescript
// ✅ BOM - Type-safe
handleChange(items: any[]) {
  const typedItems = items as Category[];
  this.selectedCategories.set(typedItems);
}

// Ou mais curto
handleChange(items: any[]) {
  this.selectedCategories.set(items as Category[]);
}
```

### ✅ Conditional Mapping

```typescript
// ✅ BOM - Adiciona description só se existir
categoriesForSelect = computed(() =>
  this.categories().map(c => ({
    ...c,
    label: c.name,
    ...(c.description && { description: c.description })
  }))
);
```

---

## 🔍 Type Safety (Opcional)

Se quiser garantir type safety, crie uma interface estendendo `MultiSelectItem`:

```typescript
import { MultiSelectItem } from '@site-gazeta/multi-select';

// Seu tipo estende MultiSelectItem
interface CategoryForSelect extends Category, MultiSelectItem {
  label: string;  // Sobrescreve/adiciona
}

// Helper com tipagem
toSelectFormat(categories: Category[]): CategoryForSelect[] {
  return categories.map(c => ({
    ...c,
    label: c.name
  }));
}
```

Ou use o tipo helper `MultiSelectCompatible`:

```typescript
import { MultiSelectCompatible } from '@site-gazeta/multi-select';

// Garante que tem id e label
type CategoryForSelect = MultiSelectCompatible<Category>;

toSelectFormat(categories: Category[]): CategoryForSelect[] {
  return categories.map(c => ({
    ...c,
    label: c.name
  }));
}
```

---

## 📋 Checklist de Integração

- [ ] Meus objetos têm `id` (string ou number)?
- [ ] Mapeei algum campo para `label` (string)?
- [ ] (Opcional) Mapeei algum campo para `description`?
- [ ] (Opcional) Tenho campo `disabled` se necessário?
- [ ] Usei computed ou function para mapear?
- [ ] Adicionei type cast no handler de mudança?
- [ ] Testei seleção e deseleção?
- [ ] Verificar que todas as propriedades estão preservadas?

---

## 🎯 Resumo

O Multi-Select é **verdadeiramente genérico**:

1. ✅ **Aceita qualquer tipo** de array
2. ✅ **Requisito mínimo**: objetos com `id` e `label`
3. ✅ **Preserva todas** as propriedades originais
4. ✅ **Não transforma** seus dados
5. ✅ **Type-safe** com type casting

**Você não precisa converter seus tipos!** Apenas adicione a propriedade `label` mapeando do seu campo de nome.

---

## 📚 Exemplos Práticos Completos

### Exemplo Completo: News Form com Categories

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { MultiSelectComponent, MultiSelectConfig } from '@site-gazeta/multi-select';
import { CategoryService } from './services/category.service';
import { Category } from './models/category.model';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <div class="form-group">
      <label>Categorias *</label>
      <multi-select
        [items]="categoriesForSelect()"
        [selectedItems]="selectedForSelect()"
        [config]="config()"
        (selectedItemsChange)="handleCategoriesChange($event)"
      />
    </div>
  `
})
export class NewsFormComponent {
  private categoryService = inject(CategoryService);

  // Dados originais (tipo Category)
  allCategories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);

  // Configuração
  config = signal<Partial<MultiSelectConfig>>({
    placeholder: 'Selecione as categorias',
    searchPlaceholder: 'Buscar categoria...',
    addButtonLabel: 'Adicionar Categoria'
  });

  // Computed para adicionar 'label' (performance otimizada)
  categoriesForSelect = computed(() =>
    this.allCategories().map(cat => ({
      ...cat,                    // Mantém TODAS as propriedades de Category
      label: cat.name,           // Adiciona 'label'
      description: cat.description,
      disabled: !cat.active      // Desabilita categorias inativas
    }))
  );

  selectedForSelect = computed(() =>
    this.selectedCategories().map(cat => ({
      ...cat,
      label: cat.name
    }))
  );

  constructor() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getActive().subscribe({
      next: (categories) => this.allCategories.set(categories)
    });
  }

  // Recebe de volta objetos Category completos!
  handleCategoriesChange(items: any[]) {
    const categories = items as Category[];
    this.selectedCategories.set(categories);
    
    // Acessa propriedades originais de Category
    console.log('Slugs:', categories.map(c => c.slug));
    console.log('Active:', categories.map(c => c.active));
  }
}
```

**🎉 Pronto! Seus objetos `Category` originais são preservados e você pode acessar todas as propriedades normalmente!**

---

Desenvolvido com ❤️ para o Site Gazeta

