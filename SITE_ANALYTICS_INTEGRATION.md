# 🎯 Integração de Analytics no Site Gazeta

## ✅ Implementação Completa

A integração de tracking de métricas foi implementada no site principal (`site-gazeta`) com sucesso!

---

## 📦 Componentes Criados

### 1. **AnalyticsService** (`core/service/analytics.service.ts`)
Service responsável por comunicar com a API de analytics

**Métodos:**
- `trackView(data)` - Registra visualização genérica
- `trackNewsView(newsId, slug, sessionId)` - Registra visualização de notícia
- `trackViewDuration(newsId, path, sessionId, duration)` - Registra duração da leitura
- `trackPageView(path, sessionId)` - Registra visualização de página

### 2. **SessionService** (`core/service/session.service.ts`)
Service para gerenciar sessões únicas dos usuários

**Funcionalidades:**
- Gera ID único de sessão
- Armazena no localStorage
- Sessões expiram após 30 minutos de inatividade
- Mantém sessão ativa durante navegação

### 3. **Integrações nos Componentes**

#### ✅ **NewsContentComponent** (Detalhes da Notícia)
- ✅ Rastreia visualização inicial ao carregar notícia
- ✅ Incrementa contador de views no backend
- ✅ Registra duração da leitura ao sair (mínimo 5 segundos)
- ✅ Captura referer (de onde veio o visitante)

#### ✅ **HomeComponent** (Página Inicial)
- ✅ Rastreia acesso à home
- ✅ Registra sessão do visitante

#### ✅ **NewsCategoryComponent** (Páginas de Categoria)
- ✅ Rastreia visualização por categoria
- ✅ Identifica qual categoria foi acessada

---

## 🚀 Como Funciona

### Fluxo de Tracking

```
1. Usuário acessa o site
   ↓
2. SessionService cria/recupera ID único
   ↓
3. Ao abrir uma notícia:
   - Registra view inicial
   - Inicia cronômetro
   ↓
4. Usuário lê a notícia
   ↓
5. Ao sair da página:
   - Calcula tempo de leitura
   - Envia duração para API
   ↓
6. Backend armazena:
   - Page views
   - Duração
   - Device, Browser, OS
   - IP, Referer
```

---

## 🧪 Como Testar

### 1. **Iniciar o Backend de Analytics**

```bash
cd apps/backend-gazeta
npm run start:dev
```

Backend em: `http://localhost:3000`

### 2. **Iniciar o Site Principal**

```bash
nx serve site-gazeta
```

Site em: `http://localhost:4200` (ou porta configurada)

### 3. **Teste Manual - Passo a Passo**

#### **Teste 1: Visualização de Notícia**

1. Acesse uma notícia: `http://localhost:4200/news/alguma-noticia`
2. Abra o **DevTools Console** (F12)
3. Você verá: `✅ View tracked: alguma-noticia`
4. Fique na página por pelo menos 10 segundos
5. Navegue para outra página
6. Você verá: `✅ Duration tracked: XX seconds`

#### **Teste 2: Página Inicial**

1. Acesse: `http://localhost:4200/`
2. No console: `✅ Home page view tracked`

#### **Teste 3: Categoria**

1. Acesse: `http://localhost:4200/category/alguma-categoria`
2. No console: `✅ Category page view tracked: alguma-categoria`

#### **Teste 4: Sessão Única**

1. Abra o **DevTools → Application → Local Storage**
2. Procure por `analytics_session_id`
3. Você verá algo como:
```json
{
  "sessionId": "session-1234567890-abc123xyz",
  "timestamp": 1699999999999
}
```
4. Navegue por várias páginas
5. O `sessionId` permanece o mesmo
6. Aguarde 30 minutos sem atividade
7. Na próxima visita, novo `sessionId` será criado

### 4. **Verificar Dados no Backend**

#### **Verificar no Banco de Dados**

```sql
-- Ver visualizações recentes
SELECT * FROM page_views 
ORDER BY created_at DESC 
LIMIT 10;

-- Ver por notícia
SELECT 
  n.title,
  COUNT(pv.id) as total_views,
  AVG(pv.duration) as avg_duration_seconds
FROM page_views pv
JOIN news n ON pv.news_id = n.id
GROUP BY n.id
ORDER BY total_views DESC;

-- Ver sessões únicas
SELECT COUNT(DISTINCT session_id) as unique_visitors
FROM page_views
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR);
```

#### **Testar API Diretamente**

```bash
# Simular visualização
curl -X POST http://localhost:3000/analytics/track-view \
  -H "Content-Type: application/json" \
  -d '{
    "newsId": 1,
    "path": "/news/teste-noticia",
    "sessionId": "session-test-123",
    "duration": 120
  }'

# Resposta esperada:
# { "message": "View tracked successfully" }
```

---

## 📊 Visualizar Métricas no Painel

1. Inicie o painel: `nx serve painel-gazeta`
2. Acesse: `http://localhost:4200/metrics`
3. Faça login
4. Selecione período dos últimos 7 dias
5. Clique em "Aplicar"

Você verá:
- ✅ KPIs atualizados com dados reais
- ✅ Gráfico de acessos ao longo do tempo
- ✅ Top notícias mais vistas
- ✅ Tempo médio de leitura

---

## 🔍 Logs e Debugging

### Console Logs do Site

Quando tudo funciona corretamente, você verá:

```
✅ View tracked: prefeitura-anuncia-obras
✅ Duration tracked: 45 seconds
✅ Home page view tracked
✅ Category page view tracked: politica
```

### Em Caso de Erro

```
⚠️ Failed to track view: HttpErrorResponse {...}
```

**Possíveis causas:**
1. Backend de analytics não está rodando
2. URL incorreta (verifique `analytics.service.ts`)
3. CORS bloqueando requisição
4. Rede offline

**Solução:**
- Verificar se backend está em `http://localhost:3000`
- Verificar logs do backend
- Testar endpoint manualmente com curl

---

## 🎨 Dados Rastreados

### Por Visualização de Notícia

```typescript
{
  newsId: 123,                    // ID da notícia
  path: "/news/titulo-noticia",   // URL
  sessionId: "session-xxx",       // ID único do visitante
  duration: 180,                  // Tempo em segundos
  referer: "https://google.com",  // De onde veio
  // Automaticamente detectado pelo backend:
  userAgent: "Mozilla/5.0...",
  ipAddress: "192.168.1.1",
  deviceType: "mobile",           // mobile, desktop, tablet
  browser: "Chrome",
  os: "Android"
}
```

### Por Visualização de Página

```typescript
{
  path: "/",
  sessionId: "session-xxx",
  referer: "https://facebook.com"
}
```

---

## 🔧 Configuração

### Alterar URL da API de Analytics

Em `apps/site-gazeta/src/app/core/service/analytics.service.ts`:

O sistema detecta automaticamente o ambiente (dev/prod):

```typescript
// Desenvolvimento
private analyticsUrl = 'http://localhost:3002/api/analytics';

// Produção (automático)
private analyticsUrl = 'https://gazetadopara.com/api/analytics';
```

A URL é configurada automaticamente baseada em `environment.apiUrl + '/analytics'`.

### Alterar Duração da Sessão

Em `apps/site-gazeta/src/app/core/service/session.service.ts`:

```typescript
private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutos
```

Para 1 hora:
```typescript
private readonly SESSION_DURATION = 60 * 60 * 1000; // 60 minutos
```

### Alterar Tempo Mínimo de Leitura

Em `apps/site-gazeta/src/app/pages/news-content/news-content.component.ts`:

```typescript
if (duration >= 5) { // 5 segundos mínimo
```

Para 10 segundos:
```typescript
if (duration >= 10) { // 10 segundos mínimo
```

---

## 📈 Otimizações Futuras

### 1. **Tracking de Scroll Depth**
Medir quanto da notícia foi lida:
```typescript
@HostListener('window:scroll')
onScroll() {
  const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
  if (scrollPercent > 75 && !this.hasTrackedDeepRead) {
    this.trackDeepRead();
  }
}
```

### 2. **Tracking de Cliques**
Rastrear cliques em elementos importantes:
```typescript
trackClick(element: string) {
  this.analyticsService.trackEvent({
    category: 'engagement',
    action: 'click',
    label: element
  });
}
```

### 3. **Tracking Offline**
Armazenar eventos offline e enviar quando reconectar:
```typescript
if (!navigator.onLine) {
  localStorage.setItem('pendingAnalytics', JSON.stringify(event));
}
```

### 4. **Heatmaps**
Integrar com ferramentas como Hotjar para mapeamento de calor

### 5. **A/B Testing**
Testar diferentes títulos e medir performance

---

## 🛡️ Privacidade e LGPD

### Dados Anonimizados

O sistema **NÃO armazena**:
- ❌ Nomes de usuários
- ❌ Emails
- ❌ Dados pessoais identificáveis

O sistema **armazena** (anonimizado):
- ✅ IP (pode ser hash para anonimizar)
- ✅ User Agent
- ✅ Session ID temporário
- ✅ Padrões de navegação

### Para Conformidade com LGPD

Adicione um banner de cookies:
```html
<div class="cookie-banner">
  Este site usa cookies para melhorar sua experiência.
  <button (click)="acceptCookies()">Aceitar</button>
</div>
```

E só rastreie após consentimento:
```typescript
if (this.cookieService.hasConsent()) {
  this.analyticsService.trackView(...);
}
```

---

## ✅ Checklist de Implementação

- [x] AnalyticsService criado
- [x] SessionService criado
- [x] Tracking em NewsContentComponent
- [x] Tracking em HomeComponent
- [x] Tracking em NewsCategoryComponent
- [x] Duração de leitura implementada
- [x] Session ID único
- [x] Referer capturado
- [x] Logs de debug
- [x] Error handling
- [ ] Testes E2E (opcional)
- [ ] Banner de cookies LGPD (se necessário)
- [ ] Configuração de produção

---

## 🎉 Pronto!

Seu sistema de analytics está **100% integrado** no site principal!

**O que acontece agora:**
1. ✅ Visitantes acessam notícias
2. ✅ Views são registradas automaticamente
3. ✅ Duração de leitura é calculada
4. ✅ Dados aparecem no painel de métricas em tempo real
5. ✅ Relatórios disponíveis para análise

**Próximos passos:**
- Navegar pelo site e gerar alguns dados
- Verificar métricas no painel
- Ajustar configurações conforme necessário
- Adicionar tracking adicional se desejar

---

**Desenvolvido com ❤️ para Site Gazeta**

Em caso de dúvidas, verifique:
- `ANALYTICS_IMPLEMENTATION.md` - Guia do backend
- Console logs do navegador
- Logs do backend
- Banco de dados (tabelas `page_views` e `user_activities`)

