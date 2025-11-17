# Módulo de Analytics

Sistema completo de rastreamento e análise de métricas para o site Gazeta.

## 📊 Funcionalidades

### 1. Rastreamento de Visualizações
- Tracking automático de page views
- Detecção de device (mobile/desktop/tablet)
- Identificação de browser e sistema operacional
- Registro de origem (referer)
- Duração da sessão

### 2. Métricas Principais (KPIs)
- **Acessos**: Total de visualizações de páginas
- **Páginas Vistas**: Quantidade de páginas visualizadas
- **Visitantes Únicos**: Sessões únicas
- **Tempo Médio**: Tempo médio na página (minutos)

### 3. Análise Temporal
- Séries temporais de acessos (diário/horário)
- Séries temporais de páginas vistas
- Comparação com período anterior

### 4. Rankings
- Top notícias por visualizações
- Data do último acesso

### 5. Logs de Atividade
- Registro de ações dos usuários
- Login/Logout
- CRUD de notícias, categorias, menus
- Histórico completo com timestamps

## 🚀 Endpoints

### Público

#### POST /analytics/track-view
Registra visualização de página (pode ser chamado do frontend)

**Body:**
```json
{
  "newsId": 123,
  "path": "/news/prefeitura-anuncia-obras",
  "referer": "https://google.com",
  "sessionId": "uuid-da-sessao",
  "duration": 180
}
```

### Protegidos (requer autenticação)

#### GET /analytics/kpis
Retorna KPIs do período

**Query:**
- `startDate`: Data inicial (ISO string)
- `endDate`: Data final (ISO string)

**Response:**
```json
{
  "kpis": [
    {
      "label": "Acessos",
      "value": 25000,
      "deltaPercent": 15
    },
    ...
  ]
}
```

#### GET /analytics/access-series
Série temporal de acessos

**Query:**
- `startDate`: Data inicial
- `endDate`: Data final
- `granularity`: "hour" | "day"

**Response:**
```json
{
  "labels": ["01/01", "02/01", ...],
  "values": [1250, 1380, ...]
}
```

#### GET /analytics/pages-series
Série temporal de páginas vistas (similar ao access-series)

#### GET /analytics/top-news
Top notícias mais vistas

**Response:**
```json
{
  "topNews": [
    {
      "title": "Prefeitura anuncia obras",
      "slug": "prefeitura-anuncia-obras",
      "views": 5420,
      "lastAccess": "2024-01-15T14:30:00Z"
    },
    ...
  ]
}
```

#### GET /analytics/activities
Atividades recentes dos usuários

**Response:**
```json
{
  "activities": [
    {
      "timestamp": "2024-01-15T14:30:00Z",
      "user": "João Silva",
      "action": "criou notícia",
      "detail": "Prefeitura anuncia obras"
    },
    ...
  ]
}
```

## 🔧 Uso no Código

### Registrar Atividade Automaticamente

Use o decorator `@LogActivity` em métodos do controller:

```typescript
import { LogActivity } from '../analytics/decorators/log-activity.decorator';

@Post()
@UseGuards(JwtAuthGuard)
@LogActivity({ 
  action: 'create_news', 
  entityType: 'news',
  description: 'Criou uma nova notícia' 
})
async create(@Body() createNewsDto: CreateNewsDto) {
  return this.newsService.create(createNewsDto);
}
```

### Registrar Atividade Manualmente

```typescript
constructor(private analyticsService: AnalyticsService) {}

async someMethod() {
  await this.analyticsService.logActivity(
    userId,
    'custom_action',
    'entity_type',
    entityId,
    'Description of action',
    ipAddress,
    userAgent
  );
}
```

## 📦 Modelos de Dados

### PageView
```prisma
model PageView {
  id            Int      @id @default(autoincrement())
  newsId        Int?
  path          String   @db.VarChar(500)
  userAgent     String?  @db.Text
  ipAddress     String?  @db.VarChar(45)
  referer       String?  @db.VarChar(500)
  sessionId     String?  @db.VarChar(255)
  duration      Int?     // segundos
  deviceType    String?  @db.VarChar(20)
  browser       String?  @db.VarChar(50)
  os            String?  @db.VarChar(50)
  country       String?  @db.VarChar(100)
  city          String?  @db.VarChar(100)
  createdAt     DateTime @default(now())
  news          News?    @relation(...)
}
```

### UserActivity
```prisma
model UserActivity {
  id          Int      @id @default(autoincrement())
  userId      Int
  action      String   @db.VarChar(100)
  entityType  String?  @db.VarChar(50)
  entityId    Int?
  description String?  @db.Text
  ipAddress   String?  @db.VarChar(45)
  userAgent   String?  @db.Text
  createdAt   DateTime @default(now())
  user        User     @relation(...)
}
```

## 🎯 Integração com Frontend

### Service Angular

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/analytics';

  constructor(private http: HttpClient) {}

  trackView(data: TrackViewDto) {
    return this.http.post(`${this.apiUrl}/track-view`, data);
  }

  getKpis(startDate: string, endDate: string) {
    return this.http.get(`${this.apiUrl}/kpis`, {
      params: { startDate, endDate }
    });
  }

  // ... outros métodos
}
```

### Rastrear Views Automaticamente

```typescript
// No componente de notícia
ngOnInit() {
  this.analyticsService.trackView({
    newsId: this.newsId,
    path: this.router.url,
    sessionId: this.sessionService.getSessionId(),
    referer: document.referrer
  }).subscribe();
}

ngOnDestroy() {
  // Registrar duração
  const duration = Math.floor((Date.now() - this.startTime) / 1000);
  this.analyticsService.trackView({
    newsId: this.newsId,
    path: this.router.url,
    duration
  }).subscribe();
}
```

## 📈 Performance

- Índices otimizados para queries rápidas
- Agregações eficientes com Prisma
- Suporte para grandes volumes de dados
- Queries otimizadas com GROUP BY nativo

## 🔐 Segurança

- Endpoints de métricas protegidos com JWT
- Endpoint de tracking público (necessário para rastreamento anônimo)
- Não armazena informações sensíveis
- IP e User-Agent são opcionais

## 📝 Notas

- Os dados são calculados em tempo real (sem cache)
- Para grande escala, considere implementar cache (Redis)
- Período anterior é calculado automaticamente para comparação
- Suporte para timezone (UTC por padrão)

