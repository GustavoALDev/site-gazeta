# ⚙️ Configuração de Portas e URLs

## 📡 URLs do Sistema

### **Desenvolvimento (Local)**

| Aplicação | URL | Porta | Descrição |
|-----------|-----|-------|-----------|
| **Backend API** | `http://localhost:3002/api` | 3002 | API REST (notícias, categorias, etc) |
| **Backend Analytics** | `http://localhost:3002/api/analytics` | 3002 | API de Métricas (tracking, KPIs) |
| **Site Gazeta** | `http://localhost:4200` | 4200 | Site público |
| **Painel Admin** | `http://localhost:4201` | 4201 | Painel administrativo |
| **Swagger Docs** | `http://localhost:3002/api` | 3002 | Documentação da API |

### **Produção**

| Aplicação | URL | Descrição |
|-----------|-----|-----------|
| **Backend API** | `https://gazetadopara.com/api` | API REST |
| **Backend Analytics** | `https://gazetadopara.com/api/analytics` | API de Métricas |
| **Site Gazeta** | `https://gazetadopara.com` | Site público |
| **Painel Admin** | `https://painel.gazetadopara.com` | Painel administrativo |

---

## 🔧 Configuração Automática por Ambiente

O sistema detecta automaticamente o ambiente (dev/prod) através dos arquivos:

### **Site Gazeta**

```typescript
// apps/site-gazeta/src/app/core/env/env.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3002/api'
};

// apps/site-gazeta/src/app/core/env/environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://gazetadopara.com/api'
};
```

### **Painel Admin**

```typescript
// apps/painel-gazeta/src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3002/api'
};

// apps/painel-gazeta/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://gazetadopara.com/api'
};
```

### **Analytics Service (Automático)**

O `AnalyticsService` adiciona `/analytics` ao `apiUrl` que já contém o prefixo `/api`:

```typescript
// apps/site-gazeta/src/app/core/service/analytics.service.ts
private analyticsUrl = `${environment.apiUrl}/analytics`;

// Desenvolvimento: http://localhost:3002/api/analytics
// Produção: https://gazetadopara.com/api/analytics
```

---

## 🚀 Como Iniciar

### **1. Backend (Porta 3002)**

```bash
cd apps/backend-gazeta
npm run start:dev
```

Acessar:
- API: http://localhost:3002/api
- Analytics: http://localhost:3002/analytics
- Swagger: http://localhost:3002/api

### **2. Site Gazeta (Porta 4200)**

```bash
nx serve site-gazeta
```

Acessar: http://localhost:4200

### **3. Painel Admin (Porta 4201)**

```bash
nx serve painel-gazeta
```

Acessar: http://localhost:4201

---

## 🔍 Verificar Endpoints

### **Testar Backend API**

```bash
# Health check
curl http://localhost:3002/api

# Listar notícias
curl http://localhost:3002/api/news

# Categorias
curl http://localhost:3002/api/categories
```

### **Testar Analytics**

```bash
# Registrar view (público - sem auth)
curl -X POST http://localhost:3002/api/analytics/track-view \
  -H "Content-Type: application/json" \
  -d '{
    "newsId": 1,
    "path": "/news/teste",
    "sessionId": "session-test-123"
  }'

# KPIs (requer autenticação)
curl -X GET "http://localhost:3002/analytics/kpis?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🌐 CORS - Configuração

O backend está configurado para aceitar requisições de:

### **Desenvolvimento**
- `http://localhost:4200` (site-gazeta)
- `http://localhost:4201` (painel-gazeta)

### **Produção**
- `https://gazetadopara.com`
- `https://painel.gazetadopara.com`

**Arquivo:** `apps/backend-gazeta/src/config/cors.config.ts`

```typescript
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:4201',
  'https://gazetadopara.com',
  'https://painel.gazetadopara.com',
];
```

---

## 📝 Alterar Portas (Se Necessário)

### **Mudar Porta do Backend**

1. Edite `apps/backend-gazeta/src/main.ts`:

```typescript
await app.listen(3002); // Altere aqui
```

2. Atualize os environments do frontend:

```typescript
// site-gazeta/core/env/env.ts
apiUrl: 'http://localhost:NOVA_PORTA/api'

// painel-gazeta/environments/environment.ts
apiUrl: 'http://localhost:NOVA_PORTA'
```

### **Mudar Porta do Site**

Em `angular.json` ou ao executar:

```bash
nx serve site-gazeta --port 8080
```

Atualize o CORS no backend para incluir a nova porta.

---

## 🔐 Endpoints Públicos vs Protegidos

### **Públicos (sem autenticação)**
```
POST /analytics/track-view
GET  /api/news (listagem pública)
GET  /api/news/:slug
GET  /api/categories
```

### **Protegidos (requer JWT)**
```
GET  /analytics/kpis
GET  /analytics/access-series
GET  /analytics/top-news
GET  /analytics/activities
POST /api/news (criar)
PUT  /api/news/:id (editar)
DELETE /api/news/:id (deletar)
```

---

## 📊 Fluxo de Comunicação

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│             │     │             │     │              │
│  Site       │────▶│  Backend    │────▶│  Database    │
│  :4200      │     │  :3002/api  │     │  MySQL       │
│             │     │             │     │              │
└─────────────┘     └─────────────┘     └──────────────┘
       │                    │
       │                    │
       │            ┌───────▼────────┐
       │            │                │
       └───────────▶│  /analytics    │
                    │  (tracking)    │
                    │                │
                    └────────────────┘

┌─────────────┐     ┌─────────────┐
│             │     │             │
│  Painel     │────▶│  Backend    │
│  :4201      │     │  :3002/api  │
│             │     │  (JWT Auth) │
└─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  /analytics  │
                    │  (métricas)  │
                    └──────────────┘
```

---

## 🐛 Troubleshooting

### **Erro: "Cannot GET /analytics"**

❌ **Problema:** Backend não está rodando na porta 3002

✅ **Solução:**
```bash
cd apps/backend-gazeta
npm run start:dev
# Verifique: Server running on http://localhost:3002
```

### **Erro: "CORS blocked"**

❌ **Problema:** Frontend tentando acessar de origem não permitida

✅ **Solução:** Adicionar origem em `cors.config.ts`:
```typescript
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:SUA_PORTA', // Adicione aqui
];
```

### **Erro: "Failed to track view"**

❌ **Problema:** URL de analytics incorreta

✅ **Solução:** Verificar em `analytics.service.ts`:
```typescript
console.log('Analytics URL:', this.analyticsUrl);
// Deve ser: http://localhost:3002/analytics
```

### **Analytics não aparecem no painel**

❌ **Problema:** Sem dados ou período incorreto

✅ **Solução:**
1. Acesse algumas notícias no site
2. Aguarde 1-2 minutos
3. No painel, selecione período dos últimos 7 dias
4. Verifique no banco:
```sql
SELECT COUNT(*) FROM page_views;
```

---

## ✅ Checklist de Configuração

- [x] Backend rodando na porta **3002**
- [x] Analytics acessível em `/analytics`
- [x] Site usando ambiente correto (dev/prod)
- [x] Painel usando ambiente correto (dev/prod)
- [x] CORS configurado para todas origens
- [x] Endpoints públicos funcionando
- [x] Endpoints protegidos com JWT
- [x] Database migrations aplicadas
- [x] Analytics module registrado

---

## 🎯 Próximos Passos

1. ✅ Teste todos os endpoints
2. ✅ Verifique logs do console
3. ✅ Acesse Swagger: http://localhost:3002/api
4. ✅ Navegue no site e gere dados
5. ✅ Veja métricas no painel

---

**Desenvolvido com ❤️ para Gazeta do Pará**

URLs Oficiais:
- Site: https://gazetadopara.com
- API: https://gazetadopara.com/api

