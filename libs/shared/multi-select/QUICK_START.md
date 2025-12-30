# 🚀 Quick Start - Multi-Select Component

Comece a usar o componente Multi-Select em **3 minutos**!

## ⚡ Instalação Rápida

### 1. Importar o Componente

```typescript
import { MultiSelectComponent } from '@site-gazeta/multi-select';

@Component({
  standalone: true,
  imports: [MultiSelectComponent], // Adicione aqui
  // ...
})
```

### 2. Preparar os Dados

```typescript
import { signal } from '@angular/core';

export class MeuComponente {
  // Seus itens (qualquer tipo com id e label!)
  items = signal([
    { id: 1, label: 'Opção 1' },
    { id: 2, label: 'Opção 2' },
    { id: 3, label: 'Opção 3' }
  ]);

  // Seleção
  selectedItems = signal([]);

  // Handler
  onSelectionChange(items: any[]) {
    this.selectedItems.set(items);
  }
}
```

### 3. Adicionar ao Template

```html
<multi-select
  [items]="items()"
  [selectedItems]="selectedItems()"
  (selectedItemsChange)="onSelectionChange($event)"
/>
```

## ✅ Pronto!

Seu multi-select já está funcionando! 🎉

---

## 🎯 Uso com Seus Tipos (Category, Tag, etc.)

O componente é **verdadeiramente genérico**! Use seus tipos direto:

```typescript
import { Category } from '@site-gazeta/models';

// Suas categorias originais
allCategories = signal<Category[]>([...]);
selectedCategories = signal<Category[]>([]);

// Apenas adicione 'label' mapeando do seu campo
categoriesForSelect = computed(() =>
  this.allCategories().map(cat => ({
    ...cat,           // Mantém TUDO
    label: cat.name   // Adiciona 'label'
  }))
);

// Template
<multi-select
  [items]="categoriesForSelect()"
  [selectedItems]="selectedForSelect()"
  (selectedItemsChange)="handleChange($event)"
/>

// Handler - recebe Category[] de volta!
handleChange(items: any[]) {
  const categories = items as Category[];
  this.selectedCategories.set(categories);
}
```

**📖 Guia completo:** [GENERIC_USAGE.md](./GENERIC_USAGE.md)

---

## 📝 Exemplos Comuns

### Com Descrição nos Items

```typescript
items = signal<MultiSelectItem[]>([
  { 
    id: 1, 
    label: 'Angular', 
    description: 'Framework web moderno' 
  },
  { 
    id: 2, 
    label: 'React', 
    description: 'Biblioteca para UI' 
  }
]);
```

### Com Configuração Customizada

```typescript
config = signal<Partial<MultiSelectConfig>>({
  placeholder: 'Selecione...',
  searchPlaceholder: 'Buscar...',
  addButtonLabel: 'Adicionar',
  maxHeight: '300px'
});
```

```html
<lib-multi-select
  [items]="items()"
  [selectedItems]="selectedItems()"
  [config]="config()"
  (selectedItemsChange)="onSelectionChange($event)"
/>
```

### Com Reactive Forms

```typescript
import { FormBuilder } from '@angular/forms';

form = this.fb.group({
  items: [[]]  // Array vazio inicial
});
```

```html
<form [formGroup]="form">
  <lib-multi-select
    [items]="items()"
    formControlName="items"
  />
</form>
```

### Convertendo Dados Existentes

Se você tem um tipo customizado, converta para `MultiSelectItem`:

```typescript
// Seu tipo atual
interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

// Converter
categoriesToItems(categories: Category[]): MultiSelectItem[] {
  return categories.map(cat => ({
    id: cat.id,
    label: cat.name,
    description: cat.description,
    disabled: !cat.active,
    ...cat // Mantém todas as propriedades
  }));
}

// Usar
categoryItems = computed(() => 
  this.categoriesToItems(this.categories())
);
```

---

## 🎨 Customizar Cores

```scss
lib-multi-select {
  --accent-blue: #1976d2;
  --accent-red: #d32f2f;
  --border: #e0e0e0;
}
```

---

## 🔧 Configurações Mais Usadas

```typescript
config = {
  placeholder: 'Texto quando vazio',
  searchPlaceholder: 'Texto do campo de busca',
  emptyMessage: 'Quando não há items',
  noResultsMessage: 'Quando busca não encontra nada',
  addButtonLabel: 'Texto do botão (sem seleção)',
  addMoreButtonLabel: 'Texto do botão (com seleção)',
  showSearch: true,        // Mostrar busca?
  maxHeight: '250px',      // Altura máxima do dropdown
  disabled: false          // Desabilitar componente?
}
```

---

## 🎯 Casos de Uso Reais

### 1️⃣ Categorias de Notícias

```typescript
categories = signal([
  { id: 1, label: 'Tecnologia', description: 'Notícias tech' },
  { id: 2, label: 'Esportes', description: 'Cobertura esportiva' }
]);
```

### 2️⃣ Tags de Artigos

```typescript
tags = signal([
  { id: 1, label: 'Angular' },
  { id: 2, label: 'TypeScript' },
  { id: 3, label: 'RxJS' }
]);
```

### 3️⃣ Seleção de Autores

```typescript
authors = signal([
  { id: 1, label: 'João Silva', description: 'Editor Chefe' },
  { id: 2, label: 'Maria Santos', description: 'Jornalista' }
]);
```

### 4️⃣ Produtos/SKUs

```typescript
products = signal([
  { id: 1, label: 'Produto A', description: 'SKU: 12345' },
  { id: 2, label: 'Produto B', description: 'SKU: 67890' }
]);
```

---

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `Escape` | Fecha o dropdown |
| `Enter` | Seleciona item focado |
| `Space` | Seleciona item focado |
| `Tab` | Navega entre elementos |

---

## 🐛 Problemas Comuns

### Dropdown não abre?
✅ Verifique se `items` não está vazio  
✅ Confirme que `disabled` não está `true`

### Items não aparecem?
✅ Todos os items têm `id` único?  
✅ Todos os items têm `label`?

### Erro de tipo no TypeScript?
✅ Items implementam `MultiSelectItem`?  
✅ Importou o tipo correto?

---

## 📚 Próximos Passos

- 📖 [README Completo](./README.md) - Documentação detalhada
- 💡 [Exemplos de Uso](./USAGE_EXAMPLES.md) - 10+ exemplos práticos
- 🔄 [Guia de Migração](../../../apps/painel-gazeta/src/app/pages/menu/category-multi-select/MIGRATION_GUIDE.md) - Para migrar do CategoryMultiSelect
- 📝 [Changelog](./CHANGELOG.md) - Histórico de mudanças

---

## 💬 Precisa de Ajuda?

1. **Documentação**: Leia o [README.md](./README.md) completo
2. **Exemplos**: Veja [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)
3. **Issues**: Reporte problemas no GitHub
4. **Equipe**: Entre em contato com o time de desenvolvimento

---

## ⭐ Checklist de Implementação

- [ ] Importei o componente
- [ ] Criei os items no formato `MultiSelectItem[]`
- [ ] Adicionei no template
- [ ] Implementei o handler de mudança
- [ ] Testei seleção/deseleção
- [ ] Testei busca
- [ ] Testei focus/blur
- [ ] Testei em mobile
- [ ] Revisei acessibilidade
- [ ] Adicionei validação (se necessário)

---

**Desenvolvido com ❤️ para o Site Gazeta**

🎉 **Divirta-se usando o Multi-Select!**

