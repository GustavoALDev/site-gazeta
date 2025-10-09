# News Highlights Component (TOP GAZETA)

Componente Angular 20 que exibe as notícias mais vistas organizadas por categorias (Jornalismo, Esporte e Entretenimento).

## 📸 Design

Componente desenvolvido seguindo o design do "TOP GAZETA", com:
- Layout em grid de 3 colunas
- Cores específicas por categoria
- Tipografia moderna e hierárquica
- Responsivo (mobile-first)

## 🚀 Uso

```typescript
import { Component, signal } from '@angular/core';
import { NewsHighligthsComponent } from '@site-gazeta/home-components';
import { News } from '@site-gazeta/models';

@Component({
  selector: 'app-home',
  imports: [NewsHighligthsComponent],
  template: `
    <lib-news-highligths [news]="mostViewedNews()" />
  `
})
export class HomeComponent {
  mostViewedNews = signal<News[]>([
    // Array com as notícias mais vistas
  ]);
}
```

## 📥 Input Signals

### `news`
- **Tipo:** `InputSignal<News[]>`
- **Descrição:** Array de notícias ordenadas por visualizações
- **Comportamento:** O componente filtra automaticamente por categoria e exibe as 5 mais vistas de cada

## 🎨 Tipografia

O componente utiliza a fonte **Open Sans** (importada via Google Fonts).

## 🎨 Categorias e Cores

| Categoria | Cor Principal | Cor Hover |
|-----------|--------------|-----------|
| Jornalismo | `#c41e3a` | `#a01830` |
| Esporte | `#00a859` | `#008a48` |
| Entretenimento | `#ff6b35` | `#e5582a` |

## ⚙️ Configuração

### IDs das Categorias

Atualmente configurado com:
```typescript
const jornalismoId = 1;
const esporteId = 2;
const entretenimentoId = 3;
```

**Ajuste conforme seu banco de dados** editando o arquivo `news-highligths.component.ts`.

## 🎯 Features Angular 20

- ✅ **Signals:** Reatividade moderna com `input()` e `computed()`
- ✅ **Control Flow:** Uso de `@for`, `@empty` ao invés de ngFor/ngIf
- ✅ **Standalone Component:** Sem módulos, apenas imports diretos
- ✅ **Performance:** Computed signal para cálculos otimizados

## 📱 Responsividade

- **Desktop (>1024px):** 3 colunas lado a lado
- **Mobile (<1024px):** 1 coluna, empilhadas verticalmente

## 🔗 Estrutura de Dados

O componente espera notícias seguindo a interface `News`:

```typescript
interface News {
  id: number;
  title: string;
  slug: string;
  categoryId: number[];
  views: number;
  // ... outros campos
}
```

## 🎨 Customização

### Alterar Cores

Edite o arquivo `news-highligths.component.scss`:

```scss
[data-category="jornalismo"] {
  .item__number,
  .item__text {
    color: #sua-cor-aqui;
  }
}
```

### Alterar Quantidade de Notícias

No método `filterAndLimitNews`:

```typescript
.slice(0, 5) // Altere 5 para a quantidade desejada
```

## 🔍 Lógica de Filtragem

1. Filtra notícias por `categoryId`
2. Ordena por `views` (descendente)
3. Limita a 5 notícias por categoria
4. Agrupa por categoria com cores específicas

