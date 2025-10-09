# News Cluster Component

Componente Angular 20 para exibir seções de notícias agrupadas por categoria, seguindo o padrão visual de portais de notícias brasileiros.

## ✨ Características

- **Angular 20**: Usa Signals e Control Flow (`@for`, `@if`)
- **Gerenciamento interno**: O componente gerencia categorias, cores e filtragem
- **Layout em grid**: Duas colunas responsivas (desktop) / coluna única (mobile)
- **Auto-organização**: Recebe todas as notícias e organiza por categoria automaticamente

## Visual

O componente replica o visual da imagem de referência, com:
- **Título da seção** com linha decorativa colorida por categoria
- **3 cards de notícias** por seção, empilhados verticalmente
- **Layout horizontal dos cards** (imagem à esquerda + conteúdo à direita)
- **Grid de 2 colunas** (desktop) que se transforma em coluna única (mobile)
- **Cores temáticas** diferentes para cada categoria

## Como usar

### Uso Simples (Recomendado)

```typescript
<!-- O componente gerencia tudo internamente -->
<lib-news-cluster [news]="allNews"></lib-news-cluster>
```

É só isso! O componente:
- Filtra as notícias por categoria automaticamente
- Aplica as cores corretas para cada categoria
- Cria o layout de grid com 2 colunas
- Mostra dados mockados se não houver notícias

### Exemplo Completo

```typescript
import { Component } from '@angular/core';
import { News } from '@site-gazeta/models';
import { NewsClusterComponent } from '@site-gazeta/home-components';

@Component({
  selector: 'app-home',
  imports: [NewsClusterComponent],
  template: `
    <lib-news-cluster [news]="mockNewsItems"></lib-news-cluster>
  `
})
export class HomeComponent {
  mockNewsItems: News[] = [
    // Array com todas as notícias
    // O componente filtra e organiza por categoria
  ];
}
```

## Input

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `news` | `News[]` | `[]` | Array de notícias (todas as categorias) |

**Nota**: O componente gerencia internamente quais categorias exibir e suas cores.

## Configuração Interna de Categorias

O componente possui um mapeamento interno de categorias e cores:

| Categoria | Cor | IDs | Nome Exibido |
|-----------|-----|-----|--------------|
| Comportamento | `#6B46C1` (Roxo) | `[1]` | "Comportamento" |
| Saúde | `#00BCD4` (Azul Ciano) | `[2]` | "Saúde e bem-estar" |
| Política | `#FF5722` (Vermelho) | `[3]` | "Política" |
| Esportes | `#4CAF50` (Verde) | `[4]` | "Esportes" |
| Entretenimento | `#FF9800` (Laranja) | `[5]` | "Entretenimento" |
| Tecnologia | `#2196F3` (Azul) | `[6]` | "Tecnologia" |

**Atualmente exibe**: As 2 primeiras categorias (Comportamento e Saúde) conforme a imagem de referência.

## Lógica Interna

### 1. Filtragem Automática
```typescript
// O componente filtra notícias por categoryId
const categoryNews = allNews.filter(news => 
  news.categoryId.some(catId => config.ids.includes(catId))
).slice(0, 3); // Máximo 3 notícias por seção
```

### 2. Signals e Computed (Angular 20)
```typescript
news = input<News[]>([]); // Signal input

categorySections = computed<CategorySection[]>(() => {
  // Recalcula automaticamente quando news() muda
  const allNews = this.news();
  // ... lógica de filtragem
});
```

### 3. Control Flow no Template
```html
@for (section of categorySections(); track section.categoryName) {
  <!-- Renderiza cada seção -->
  @for (newsItem of section.news; track newsItem.id) {
    <!-- Renderiza cada card -->
  @}
}
```

## Mapeamento do Modelo News

O componente mapeia automaticamente:
- `news.subtitle` → sobretítulo (overline)
- `news.title` → título principal
- `news.author` → metadados
- `news.mediaNews[0].url` → imagem do card
- `news.categoryId[]` → usado para filtragem

## Estrutura do Layout

```
.news-cluster-container (componente raiz)
  └── .news-cluster-grid (grid 2 colunas)
       ├── .news-cluster (seção categoria 1)
       │    ├── .news-cluster__header
       │    └── .news-cluster__cards
       │         ├── .news-card (notícia 1)
       │         ├── .news-card (notícia 2)
       │         └── .news-card (notícia 3)
       └── .news-cluster (seção categoria 2)
            └── ...
```

## Responsividade

| Breakpoint | Layout | Grid | Cards |
|------------|--------|------|-------|
| **Desktop** (> 1128px) | 2 colunas | `1fr 1fr`, gap 40px | Horizontal, img 240x180px |
| **Tablet** (≤ 1128px) | 1 coluna | `1fr`, gap 60px | Horizontal, img 240x180px |
| **Mobile** (≤ 768px) | 1 coluna | `1fr`, gap 50px | Vertical, img full-width 200px |
| **Small Mobile** (≤ 480px) | 1 coluna | `1fr`, gap 50px | Vertical, img 180px, fontes reduzidas |

## Recursos Visuais

✅ **Angular 20 Signals** - Reatividade automática  
✅ **Control Flow moderno** - `@for`, `@if`  
✅ **Gerenciamento interno** - Categorias e cores  
✅ **Grid responsivo** - 2 colunas → 1 coluna  
✅ **Animação hover** - Desliza para direita  
✅ **Zoom suave** na imagem ao passar o mouse  
✅ **Truncamento de texto** em 3 linhas  
✅ **Bordas arredondadas** nas imagens (8px)  
✅ **Linha decorativa** colorida por categoria  

## Próximos Passos

- [ ] Adicionar navegação (click nos cards → página da notícia)
- [ ] Implementar lazy loading de imagens
- [ ] Adicionar skeleton loading
- [ ] Permitir configuração de quais categorias exibir
- [ ] Adicionar ordenação por data/relevância
- [ ] Integrar com service do backend

## Tecnologias

- **Angular 20** - Signals, Control Flow
- **TypeScript** - Type-safe
- **SCSS** - Estilos com nesting e media queries
- **BEM** - Metodologia CSS

