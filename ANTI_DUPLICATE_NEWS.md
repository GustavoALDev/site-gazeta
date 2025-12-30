# Sistema Anti-Duplicação de Notícias

## 📋 Visão Geral

Sistema escalável que evita a exibição de notícias duplicadas na mesma página, mantendo a experiência do usuário limpa e sem repetições desnecessárias.

## 🏗️ Arquitetura

### Fluxo de Funcionamento

```
1. Componente solicita notícias
   ↓
2. excludeNewsInterceptor adiciona IDs excluídos na requisição
   ↓
3. Backend filtra notícias com esses IDs
   ↓
4. Backend retorna notícias únicas (busca mais para compensar exclusões)
   ↓
5. newsIdsInterceptor captura IDs das notícias retornadas
   ↓
6. NewsManagerService armazena IDs no sessionStorage
   ↓
7. Ao mudar de rota, IDs são limpos automaticamente
```

## 🔧 Componentes

### Backend

#### 1. **NewsQueryDto** (`apps/backend-gazeta/src/news/dto/news-query.dto.ts`)
- Adiciona propriedade `exclude?: string`
- Aceita IDs separados por vírgula (ex: "1,2,3,4,5")
- Validação com class-validator

#### 2. **NewsQueryService** (`apps/backend-gazeta/src/news/query/news-query.service.ts`)
**Método auxiliar:**
```typescript
parseExcludeIds(exclude?: string): number[]
```
Converte string de IDs em array de números.

**Métodos modificados:**
- `findFeatured(exclude?: string)` - Notícias em destaque
- `findLatestNews(exclude?: string, limit = 5)` - Últimas notícias
- `findMostViewed(exclude?: string, limit = 9)` - Mais vistas
- `findByCategory(categoryId: number, exclude?: string)` - Por categoria

**Estratégia inteligente:**
- Busca `limit * 2 + 5` itens quando há IDs excluídos
- Filtra os IDs excluídos
- Retorna exatamente `limit` itens
- Garante que sempre terá itens suficientes

#### 3. **NewsQueryController** (`apps/backend-gazeta/src/news/query/news-query.controller.ts`)
- Adiciona parâmetro `@Query('exclude')` em todos os endpoints
- Adiciona parâmetro `@Query('limit')` onde aplicável
- Documentação Swagger atualizada

**Endpoints modificados:**
- `GET /news/featured?exclude=1,2,3`
- `GET /news/latest-news?limit=5` ⚠️ **EXCEÇÃO: NÃO usa exclude**
- `GET /news/most-viewed?exclude=1,2,3&limit=9`
- `GET /news/category/:id?exclude=1,2,3`

> **⚠️ IMPORTANTE:** O endpoint `latest-news` é uma exceção intencional. Ele sempre retorna as notícias mais recentes, mesmo que já tenham sido exibidas em outras seções. Isso garante que o usuário sempre veja as últimas notícias no topo.

### Frontend

#### 1. **NewsManagerService** (`apps/site-gazeta/src/app/core/service/news-manager.service.ts`)

**Responsabilidades:**
- Gerencia lista de IDs excluídos (apenas em memória)
- ⚠️ **NÃO persiste em sessionStorage** (evita acúmulo infinito)
- Monitora mudanças de rota
- Limpa IDs automaticamente ao mudar de página
- Limpa IDs automaticamente ao recarregar (F5)

**Métodos públicos:**
```typescript
excludeIds(newIds: number[]): void        // Adiciona IDs à lista
clearExcludedIds(): void                  // Limpa todos os IDs
isExcluded(id: number): boolean          // Verifica se ID está excluído
getExcludedCount(): number               // Quantidade de IDs excluídos
```

**Comportamento:**
- Ao navegar para nova rota → limpa IDs automaticamente
- Ao recarregar a página (F5) → IDs limpos (não persiste)
- Logs detalhados no console (desenvolvimento)
- Funciona apenas no browser (não afeta SSR)

**Por que não persiste em sessionStorage?**
- ❌ **Problema:** A cada F5, novos IDs se acumulam infinitamente
- ❌ **Resultado:** Após vários reloads, não sobram notícias para exibir
- ✅ **Solução:** Manter apenas em memória → F5 limpa automaticamente

#### 2. **excludeNewsInterceptor** (`apps/site-gazeta/src/app/core/interceptor/exclude-news.interceptor.ts`)

**Responsabilidades:**
- Intercepta requisições de notícias
- Adiciona automaticamente parâmetro `exclude` com IDs
- Funciona apenas no browser

**Endpoints detectados:**
```typescript
'/news/featured'
'/news/most-viewed'
'/news/category/'
// NOTA: '/news/latest-news' NÃO está na lista (é uma exceção)
```

**Comportamento inteligente:**
- Não sobrescreve se `exclude` já estiver presente (permite override)
- Adiciona IDs apenas se houver IDs excluídos
- Logs informativos no console

#### 3. **newsIdsInterceptor** (`apps/site-gazeta/src/app/core/interceptor/news-ids.interceptor.ts`)

**Responsabilidades:**
- Captura respostas de requisições de notícias
- Extrai IDs das notícias retornadas
- Adiciona IDs ao NewsManagerService (apenas em memória)
- Funciona apenas no browser (SSR não afetado)

**Ordem dos Interceptors:**
```typescript
withInterceptors([
  excludeNewsInterceptor,  // 1º: Adiciona IDs excluídos (REQUEST)
  newsIdsInterceptor       // 2º: Captura IDs (RESPONSE)
])
```

## 🎯 Casos de Uso

### Página Home

A home tem múltiplos componentes que podem exibir a mesma notícia:

1. **Carousel** → Featured news
2. **Latest News** → Últimas 5 notícias ⚠️ **EXCEÇÃO: pode repetir**
3. **Most Viewed** → 9 mais vistas
4. **Category Grid** → 3 notícias por categoria
5. **News Highlights** → 5 notícias por categoria destaque

**Solução:**
- Carousel carrega primeiro → IDs salvos
- **Latest News NÃO exclui IDs** → sempre mostra as 5 mais recentes (pode repetir)
- Most Viewed exclui IDs do carousel → notícias diferentes
- Category Grid exclui IDs anteriores → notícias diferentes
- E assim sucessivamente...

> **Por que Latest News é exceção?** As últimas notícias são prioritárias e devem sempre ser exibidas, mesmo que apareçam em destaque ou no carousel. O usuário espera ver as notícias mais recentes nesta seção.

### Mudança de Página

```
Home (IDs: 1,2,3,4,5)
  ↓ Usuário clica em categoria
Categoria (IDs limpos automaticamente)
  ↓ Notícias podem repetir, mas não na mesma página
```

## 📊 Vantagens da Solução

### ✅ Escalabilidade
- Funciona com qualquer quantidade de notícias
- Funciona com qualquer quantidade de componentes
- Não precisa modificar componentes individuais
- Backend controla tudo

### ✅ Performance
- Reduz tráfego de rede (backend filtra)
- Não envia notícias duplicadas
- Cache do browser funciona normalmente
- SSR não é afetado

### ✅ Manutenibilidade
- Lógica centralizada
- Logs detalhados para debug
- Código limpo e documentado
- Fácil de testar

### ✅ Flexibilidade
- Pode desabilitar por endpoint (não passar exclude)
- Pode override manual (passar exclude específico)
- Funciona com paginação futura
- Funciona com filtros complexos

## 🧪 Como Testar

### Teste Manual

1. **Abra a home do site**
   ```
   http://localhost:4200
   ```

2. **Abra o Console do Browser**
   - Você verá logs como:
   ```
   📝 NewsManager: 5 novos IDs adicionados (total: 5)
   🔍 Exclude Interceptor: Adicionando 5 IDs excluídos para /news/latest-news
   📝 NewsManager: 5 novos IDs adicionados (total: 10)
   ```

3. **Verifique as notícias**
   - Nenhuma notícia deve aparecer duas vezes na mesma página
   - Cada seção deve ter notícias únicas

4. **Navegue para outra página**
   ```
   http://localhost:4200/category/esportes
   ```
   - Console deve mostrar:
   ```
   🔄 NewsManager: Mudança de rota detectada (/ → /category/esportes)
   🧹 NewsManager: 10 IDs excluídos limpos
   ```

5. **Volte para home**
   - Notícias podem repetir (IDs foram limpos)

### Teste via DevTools

1. **Abra Network Tab**
2. **Filtre por "news"**
3. **Veja as requisições:**
   ```
   GET /news/featured
   GET /news/latest-news?exclude=1,2,3,4,5
   GET /news/most-viewed?exclude=1,2,3,4,5,6,7,8,9,10
   ```

## 🚀 Melhorias Futuras

### Possíveis Otimizações

1. **Limite de IDs**
   - Limitar quantidade de IDs armazenados (ex: máximo 100)
   - Remover IDs mais antigos (FIFO)

2. **Estratégia por Categoria**
   - Manter IDs separados por categoria
   - Permite mais flexibilidade

3. **Configuração por Componente**
   - Alguns componentes podem querer permitir duplicatas
   - Flag configurável

4. **Analytics**
   - Rastrear quantas notícias foram filtradas
   - Otimizar quantidade de fetch no backend

## 📝 Notas Importantes

1. **Armazenamento em Memória (NÃO persiste)**
   - IDs armazenados apenas em memória
   - F5 (reload) limpa IDs automaticamente
   - Evita acúmulo infinito de IDs excluídos
   - ⚠️ **Não usa sessionStorage nem localStorage**

2. **Por que não persistir?**
   - Cada reload adicionaria novos IDs
   - Após vários reloads, não sobrariam notícias
   - Componentes quebrariam por falta de conteúdo
   - Solução: memória volátil = auto-limpeza

3. **SSR (Server-Side Rendering)**
   - Interceptors só funcionam no browser
   - Não afeta renderização no servidor
   - Performance SSR mantida

4. **Ordem dos Interceptors**
   - Importante manter ordem correta
   - `excludeNewsInterceptor` ANTES de `newsIdsInterceptor`

5. **Logs de Debug**
   - Logs estão ativos
   - Para produção, pode remover ou usar `environment.production`

## 🎓 Conceitos Aplicados

- ✅ **Separation of Concerns** - Backend e Frontend com responsabilidades claras
- ✅ **DRY (Don't Repeat Yourself)** - Interceptors evitam código duplicado
- ✅ **Single Responsibility** - Cada serviço/interceptor tem uma função
- ✅ **Open/Closed Principle** - Extensível sem modificar componentes
- ✅ **Dependency Injection** - Angular DI para serviços
- ✅ **Reactive Programming** - RxJS para eventos de rota

---

**Implementado em:** 02/12/2025
**Versão:** 1.0.0
**Status:** ✅ Produção

