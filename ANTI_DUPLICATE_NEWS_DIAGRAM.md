# Diagrama do Sistema Anti-Duplicação de Notícias

## 🔄 Fluxo Completo (Sequencial)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PÁGINA HOME CARREGANDO                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│ 1. CAROUSEL COMPONENT│ 
│    (Featured News)   │
└──────────┬───────────┘
           │
           │ GET /news/featured
           ↓
    ┌──────────────────────┐
    │ excludeNewsInterceptor│ ➡️ IDs excluídos: [] (vazio)
    └──────────┬───────────┘
               │ GET /news/featured (sem exclude)
               ↓
        ┌──────────────┐
        │   BACKEND    │
        │ NewsService  │ ➡️ Busca 10 notícias featured
        └──────┬───────┘
               │ Retorna: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
               ↓
    ┌──────────────────────┐
    │  newsIdsInterceptor  │ ➡️ Captura IDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    └──────────┬───────────┘
               │
               ↓
    ┌──────────────────────┐
    │  NewsManagerService  │ ➡️ Armazena EM MEMÓRIA: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    └──────────────────────┘
    
    ⚠️ NÃO persiste em sessionStorage
    ✅ F5 (reload) limpa automaticamente

═══════════════════════════════════════════════════════════════════════════

┌──────────────────────┐
│ 2. LATEST NEWS       │ ⚠️ EXCEÇÃO: NÃO USA FILTRO DE EXCLUSÃO
│    Component         │
└──────────┬───────────┘
           │
           │ GET /news/latest-news
           ↓
    ┌──────────────────────┐
    │ excludeNewsInterceptor│ ➡️ Endpoint NÃO está na lista de exclusão
    └──────────┬───────────┘
               │ GET /news/latest-news (SEM exclude) ⚠️
               ↓
        ┌──────────────┐
        │   BACKEND    │
        │ NewsService  │ ➡️ Busca 5 notícias mais recentes
        │              │ ➡️ SEM FILTRAR (sempre as mais recentes)
        │              │ ➡️ Pode retornar IDs já exibidos
        └──────┬───────┘
               │ Retorna: [1, 2, 3, 4, 5] ⚠️ PODE REPETIR!
               ↓
    ┌──────────────────────┐
    │  newsIdsInterceptor  │ ➡️ Captura IDs: [1, 2, 3, 4, 5]
    └──────────┬───────────┘
               │
               ↓
    ┌──────────────────────┐
    │  NewsManagerService  │ ➡️ IDs já existem (não adiciona duplicatas)
    │                      │ ➡️ Total EM MEMÓRIA: [1-10] (mantém)
    └──────────────────────┘

    📝 NOTA: Latest News sempre mostra as mais recentes,
             mesmo que apareçam no carousel ou outras seções.

═══════════════════════════════════════════════════════════════════════════

┌──────────────────────┐
│ 3. MOST VIEWED       │
│    Component         │
└──────────┬───────────┘
           │
           │ GET /news/most-viewed
           ↓
    ┌──────────────────────┐
    │ excludeNewsInterceptor│ ➡️ IDs excluídos: [1-15]
    └──────────┬───────────┘
               │ GET /news/most-viewed?exclude=1,2,3,...,15
               ↓
        ┌──────────────┐
        │   BACKEND    │
        │ NewsService  │ ➡️ Busca 23 notícias (9*2+5)
        │              │ ➡️ Filtra IDs [1-15]
        │              │ ➡️ Retorna 9 únicas
        └──────┬───────┘
               │ Retorna: [16, 17, 18, 19, 20, 21, 22, 23, 24]
               ↓
    ┌──────────────────────┐
    │  newsIdsInterceptor  │ ➡️ Captura IDs: [16-24]
    └──────────┬───────────┘
               │
               ↓
    ┌──────────────────────┐
    │  NewsManagerService  │ ➡️ Total EM MEMÓRIA: [1-24]
    └──────────────────────┘

═══════════════════════════════════════════════════════════════════════════

┌──────────────────────┐
│ 4. CATEGORY GRID     │
│    (3 categorias)    │
└──────────┬───────────┘
           │
           ├─ GET /news/category/1?exclude=1,2,...,24 ➡️ [25, 26, 27]
           ├─ GET /news/category/2?exclude=1,2,...,27 ➡️ [28, 29, 30]
           └─ GET /news/category/3?exclude=1,2,...,30 ➡️ [31, 32, 33]
           
           Total de IDs no final: [1-33]

═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                    USUÁRIO NAVEGA PARA /category/esportes               │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │  Router (Angular)    │ ➡️ NavigationEnd event
    └──────────┬───────────┘
               │
               ↓
    ┌──────────────────────┐
    │  NewsManagerService  │ ➡️ Detecta mudança de rota
    │  (NavigationStart)   │ ➡️ Chama clearExcludedIds()
    └──────────────────────┘

    IDs excluídos agora: [] (vazio em memória)
    
    ⚠️ F5 (reload) também limpa → Nova instância do serviço
    
    ➡️ Notícias podem repetir na nova página (mas não haverá duplicatas 
       dentro da mesma página da categoria)
```

## 🎨 Componentes e Responsabilidades

```
┌─────────────────────────────────────────────────────────────────────┐
│                            FRONTEND                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  NewsManagerService                                        │   │
│  │  ─────────────────────                                     │   │
│  │  • Armazena IDs excluídos: number[]                        │   │
│  │  • Monitora mudanças de rota                               │   │
│  │  • Limpa IDs ao trocar de página                           │   │
│  │  • Persiste em sessionStorage                              │   │
│  └────────────────────────────────────────────────────────────┘   │
│                    ↓ fornece IDs                  ↑ salva IDs      │
│  ┌─────────────────────────────┐  ┌──────────────────────────┐    │
│  │ excludeNewsInterceptor      │  │ newsIdsInterceptor       │    │
│  │ ────────────────────────    │  │ ──────────────────       │    │
│  │ REQUEST (antes de enviar):  │  │ RESPONSE (após receber): │    │
│  │ • Lê IDs do NewsManager     │  │ • Captura IDs da resposta│    │
│  │ • Adiciona ?exclude=1,2,3   │  │ • Salva no NewsManager   │    │
│  └─────────────────────────────┘  └──────────────────────────┘    │
│                    ↓                          ↑                     │
└────────────────────┼──────────────────────────┼─────────────────────┘
                     │                          │
                     │     HTTP REQUEST         │
                     │   ?exclude=1,2,3         │
                     ↓                          │
┌─────────────────────────────────────────────────────────────────────┐
│                            BACKEND                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  NewsQueryController                                       │   │
│  │  ───────────────────                                       │   │
│  │  GET /news/featured?exclude=1,2,3                          │   │
│  │  GET /news/latest-news?exclude=1,2,3&limit=5               │   │
│  │  GET /news/most-viewed?exclude=1,2,3&limit=9               │   │
│  │  GET /news/category/:id?exclude=1,2,3                      │   │
│  └────────────────────┬───────────────────────────────────────┘   │
│                       │ chama com parâmetros                       │
│                       ↓                                             │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  NewsQueryService                                          │   │
│  │  ────────────────                                          │   │
│  │  • parseExcludeIds(exclude) → [1,2,3]                      │   │
│  │  • Adiciona WHERE id NOT IN [1,2,3]                        │   │
│  │  • Busca (limit * 2 + 5) para compensar                    │   │
│  │  • Retorna exatamente 'limit' únicos                       │   │
│  └────────────────────┬───────────────────────────────────────┘   │
│                       │ consulta DB                                │
│                       ↓                                             │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Prisma / Database                                         │   │
│  │  ─────────────────                                         │   │
│  │  SELECT * FROM news                                        │   │
│  │  WHERE status = 'ACTIVE'                                   │   │
│  │    AND id NOT IN (1,2,3)                                   │   │
│  │  ORDER BY createdAt DESC                                   │   │
│  │  LIMIT 15  -- (5 * 2 + 5)                                  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 Métricas de Performance

```
┌─────────────────────────────────────────────────────────────┐
│  ANTES (Sem Sistema)                                        │
├─────────────────────────────────────────────────────────────┤
│  Carousel:       10 notícias                                │
│  Latest News:     5 notícias  (3 duplicatas ❌)             │
│  Most Viewed:     9 notícias  (5 duplicatas ❌)             │
│  Category Grid:   9 notícias  (7 duplicatas ❌)             │
│  ───────────────────────────────────────────────────────    │
│  Total:          33 notícias                                │
│  Únicas:         18 notícias                                │
│  Duplicatas:     15 notícias (45% duplicatas) 😢            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DEPOIS (Com Sistema)                                       │
├─────────────────────────────────────────────────────────────┤
│  Carousel:       10 notícias  (IDs: 1-10)                   │
│  Latest News:     5 notícias  (IDs: 1-5) ⚠️ PODE REPETIR    │
│  Most Viewed:     9 notícias  (IDs: 11-19) ✅               │
│  Category Grid:   9 notícias  (IDs: 20-28) ✅               │
│  ───────────────────────────────────────────────────────    │
│  Total:          33 notícias                                │
│  Únicas:         28 notícias                                │
│  Duplicatas:      5 notícias (15% - apenas Latest News) ✅  │
│                                                             │
│  📝 Latest News pode repetir intencionalmente para garantir │
│     que sempre mostre as notícias mais recentes             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Ciclo de Vida dos IDs (Em Memória)

```
┌──────────────┐
│  PÁGINA 1    │  IDs: [] (memória vazia)
│  (Home)      │
└──────┬───────┘
       │ Carousel carrega
       ↓
    IDs: [1-10] (em memória)
       │ Most Viewed carrega
       ↓
    IDs: [1-24] (em memória)
       │ Todas as sections carregadas
       ↓
    IDs: [1-33] (em memória)
       │
       │ ⚡ NAVEGAÇÃO ⚡
       │ Router.navigate('/category/esportes')
       ↓
    IDs: []  ← LIMPO AUTOMATICAMENTE (NavigationStart)
       │
┌──────┴───────┐
│  PÁGINA 2    │  IDs: [] (memória limpa)
│  (Categoria) │
└──────┬───────┘
       │ Notícias da categoria carregam
       ↓
    IDs: [1-20]  ← Pode repetir IDs da página anterior
       │
       │ 🔄 F5 (RELOAD) 🔄
       ↓
    IDs: []  ← LIMPO AUTOMATICAMENTE (nova instância)
       │
       │ Página recarrega do zero
       ↓
    IDs: [1-20]  ← Começa novamente sem acúmulo
```

**💡 Importante:** 
- IDs vivem apenas durante a sessão da página
- F5 cria nova instância do serviço = IDs zerados
- Evita acúmulo infinito de IDs excluídos

## 🎯 Casos Especiais

### Caso 1: Poucas Notícias no Sistema
```
Database tem apenas 15 notícias no total

Carousel:     10 notícias (IDs: 1-10)
Latest News:   5 notícias (IDs: 11-15)
Most Viewed:   0 notícias ← Backend não encontrou mais notícias únicas

✅ Sistema funciona corretamente
✅ Não quebra se não houver notícias suficientes
```

### Caso 2: Override Manual
```typescript
// Se desenvolvedor quiser forçar IDs específicos:
this.http.get('/news/latest-news?exclude=100,200,300')

✅ excludeNewsInterceptor NÃO sobrescreve
✅ Usa IDs fornecidos manualmente
```

### Caso 3: Endpoint Não Suportado
```
GET /news/search?query=futebol

✅ excludeNewsInterceptor ignora
✅ Busca funciona normalmente sem filtro
✅ Pode adicionar suporte depois se necessário
```

### Caso 4: Problema do Acúmulo Infinito (RESOLVIDO)
```
❌ PROBLEMA (se persistisse em sessionStorage):

Carregamento 1:  IDs = [1-33]  ✅ 33 notícias exibidas
F5 (reload)
Carregamento 2:  IDs = [1-66]  ⚠️ 33 novas + 33 antigas persistidas
F5 (reload)
Carregamento 3:  IDs = [1-99]  ⚠️ 33 novas + 66 antigas persistidas
F5 (reload)
Carregamento 4:  IDs = [1-132] ❌ Backend não encontra notícias não excluídas
Componentes quebram por falta de conteúdo!

✅ SOLUÇÃO (memória volátil):

Carregamento 1:  IDs = [1-33]  ✅ 33 notícias exibidas
F5 (reload) → Nova instância do serviço
Carregamento 2:  IDs = [1-33]  ✅ 33 notícias exibidas (mesmas ou outras)
F5 (reload) → Nova instância do serviço
Carregamento 3:  IDs = [1-33]  ✅ 33 notícias exibidas
Infinitos reloads funcionam! 🎉
```

### Caso 5: Latest News (Exceção Intencional)
```
Carousel:     [1, 2, 3, 4, 5]
Latest News:  [1, 2, 3, 4, 5] ← Mesmas notícias! ⚠️

✅ Comportamento ESPERADO e CORRETO
✅ Latest News sempre mostra as mais recentes
✅ Usuário espera ver as últimas notícias nesta seção
✅ Prioridade: Recência > Evitar duplicatas
```

---

**💡 Dica:** Este diagrama pode ser impresso ou usado em apresentações!

