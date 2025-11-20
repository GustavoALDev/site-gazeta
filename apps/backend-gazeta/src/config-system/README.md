# Sistema de Configurações

Este módulo gerencia todas as configurações do sistema, incluindo configurações de categorias para seções especiais e links de redes sociais.

## Endpoints

### 1. Configuração de Destaques

Gerencia as categorias exibidas na seção "Destaques" da home.

#### POST `/config/destaques`
Cria a configuração de destaques (somente uma por usuário).

**Request Body:**
```json
{
  "randomMode": false,
  "categoryIds": [1, 2, 3]
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "randomMode": false,
  "categories": [
    {
      "id": 1,
      "name": "Regional",
      "slug": "regional",
      "description": "Notícias regionais",
      "color": "#FF0000",
      "isActive": true
    }
  ],
  "categoryIds": [1, 2, 3],
  "createdAt": "2025-11-19T14:00:00.000Z",
  "updatedAt": "2025-11-19T14:00:00.000Z",
  "createdBy": 1
}
```

#### GET `/config/destaques`
Obtém a configuração atual de destaques.

**Response:** `200 OK`

#### PATCH `/config/destaques`
Atualiza a configuração de destaques.

**Request Body:**
```json
{
  "randomMode": false,
  "categoryIds": [4, 5, 6]
}
```

**Response:** `200 OK`

---

### 2. Configuração de Top Gazeta

Gerencia as categorias exibidas na seção "Top Gazeta" da home.

#### POST `/config/top-gazeta`
Cria a configuração do Top Gazeta (somente uma por usuário).

**Request Body:**
```json
{
  "randomMode": false,
  "categoryIds": [4, 5, 6]
}
```

**Response:** `201 Created`

#### GET `/config/top-gazeta`
Obtém a configuração atual do Top Gazeta.

**Response:** `200 OK`

#### PATCH `/config/top-gazeta`
Atualiza a configuração do Top Gazeta.

**Request Body:**
```json
{
  "randomMode": true,
  "categoryIds": []
}
```

**Response:** `200 OK`

---

### 3. Configuração de Ordenação de Seções

Gerencia a ordem e configuração das seções da home.

#### POST `/config/sections`
Cria uma nova seção.

**Request Body:**
```json
{
  "sectionId": "carousel",
  "name": "Carrossel",
  "title": "Últimas Notícias",
  "order": 1,
  "showTitle": true,
  "icon": "view_carousel"
}
```

**Response:** `201 Created`

#### GET `/config/sections`
Lista todas as seções ordenadas em formato de array.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "sectionId": "carousel",
    "name": "Carrossel",
    "title": "Últimas Notícias",
    "order": 1,
    "showTitle": true,
    "icon": "view_carousel",
    "createdAt": "2025-11-19T14:00:00.000Z",
    "updatedAt": "2025-11-19T14:00:00.000Z",
    "createdBy": 1
  }
]
```

#### GET `/config/sections-map`
Retorna todas as seções em formato de objeto/mapa, onde as chaves são os `sectionId`. Este formato facilita o acesso direto no front-end.

**Response:** `200 OK`
```json
{
  "carousel": {
    "id": 1,
    "sectionId": "carousel",
    "name": "Carrossel",
    "title": "Últimas Notícias",
    "order": 1,
    "showTitle": true,
    "icon": "view_carousel",
    "createdAt": "2025-11-19T14:00:00.000Z",
    "updatedAt": "2025-11-19T14:00:00.000Z",
    "createdBy": 1
  },
  "videos": {
    "id": 2,
    "sectionId": "videos",
    "name": "Vídeos",
    "title": "Vídeos em Alta",
    "order": 2,
    "showTitle": true,
    "icon": "play_circle",
    "createdAt": "2025-11-19T14:00:00.000Z",
    "updatedAt": "2025-11-19T14:00:00.000Z",
    "createdBy": 1
  },
  "destaques": {
    "id": 3,
    "sectionId": "destaques",
    "name": "Destaques",
    "title": "Em Destaque",
    "order": 3,
    "showTitle": true,
    "icon": "star",
    "createdAt": "2025-11-19T14:00:00.000Z",
    "updatedAt": "2025-11-19T14:00:00.000Z",
    "createdBy": 1
  }
}
```

#### GET `/config/sections/:sectionId`
Obtém uma seção específica.

**Response:** `200 OK`

#### PATCH `/config/sections/:sectionId`
Atualiza uma seção específica.

**Request Body:**
```json
{
  "title": "Notícias Recentes",
  "order": 2
}
```

**Response:** `200 OK`

#### PATCH `/config/sections` (Bulk Update)
Atualiza múltiplas seções de uma vez (útil para reordenação).

**Observação:** Este endpoint usa uma técnica de valores temporários para evitar conflitos de unique constraint na coluna `order`. A atualização é feita em duas etapas dentro de uma transação:
1. Todas as orders são setadas para valores temporários negativos
2. Em seguida, são aplicados os valores finais

Isso garante que não haja conflito ao trocar ordens entre seções.

**Request Body:**
```json
{
  "sections": [
    {
      "sectionId": "carousel",
      "name": "Carrossel",
      "title": "Últimas Notícias",
      "order": 1,
      "showTitle": true,
      "icon": "view_carousel"
    },
    {
      "sectionId": "videos",
      "name": "Vídeos",
      "title": "Vídeos em Alta",
      "order": 2,
      "showTitle": true,
      "icon": "play_circle"
    }
  ]
}
```

**Response:** `200 OK`

#### DELETE `/config/sections/:sectionId`
Remove uma seção.

**Response:** `200 OK`
```json
{
  "message": "Seção removida com sucesso"
}
```

---

### 4. Configuração de Redes Sociais

Gerencia os links das redes sociais exibidos no site.

#### POST `/config/social-media`
Cria a configuração de redes sociais (somente uma por usuário).

**Request Body:**
```json
{
  "instagram": "https://instagram.com/gazeta",
  "facebook": "https://facebook.com/gazeta",
  "youtube": "https://youtube.com/c/gazeta",
  "linkedin": "https://linkedin.com/company/gazeta",
  "twitter": "https://twitter.com/gazeta",
  "tiktok": "https://tiktok.com/@gazeta",
  "whatsapp": "+5511999999999"
}
```

**Response:** `201 Created`

#### GET `/config/social-media`
Obtém a configuração atual de redes sociais.

**Response:** `200 OK`
```json
{
  "id": 1,
  "instagram": "https://instagram.com/gazeta",
  "facebook": "https://facebook.com/gazeta",
  "youtube": "https://youtube.com/c/gazeta",
  "linkedin": "https://linkedin.com/company/gazeta",
  "twitter": "https://twitter.com/gazeta",
  "tiktok": "https://tiktok.com/@gazeta",
  "whatsapp": "+5511999999999",
  "createdAt": "2025-11-19T14:00:00.000Z",
  "updatedAt": "2025-11-19T14:00:00.000Z",
  "createdBy": 1
}
```

#### PATCH `/config/social-media`
Atualiza a configuração de redes sociais.

**Request Body:**
```json
{
  "instagram": "https://instagram.com/novogazeta",
  "youtube": null
}
```

**Response:** `200 OK`

---

## Observações

### Modo Aleatório
- Quando `randomMode: true`, o sistema escolhe automaticamente 3 categorias aleatórias
- Quando `randomMode: false`, é obrigatório fornecer exatamente 3 categorias em `categoryIds`

### Autenticação
- Todos os endpoints POST, PATCH e DELETE requerem autenticação JWT
- Use o header `Authorization: Bearer <token>`
- Os endpoints GET são públicos

### Validações
- URLs de redes sociais devem seguir o formato correto (ex: `https://instagram.com/...`)
- WhatsApp deve estar no formato internacional (ex: `+5511999999999`)
- Categorias devem existir e estar ativas
- Ordens de seções não podem ser duplicadas
- Cada usuário pode ter apenas uma configuração de Destaques, Top Gazeta e Redes Sociais

### Formatos de Resposta das Seções

#### Array (`/config/sections`)
- Retorna as seções em formato de array
- Útil quando você precisa iterar sobre todas as seções
- Mantém a ordem de exibição

#### Mapa/Objeto (`/config/sections-map`)
- Retorna as seções em formato de objeto onde as chaves são os `sectionId`
- **Recomendado para uso no front-end** quando você precisa acessar configurações específicas
- Permite acesso direto: `config.carousel`, `config.videos`, etc.
- Evita necessidade de buscar no array

**Exemplo de uso no front-end:**
```typescript
// Formato Array - precisa buscar
const sections: SectionOrderConfig[] = await api.get('/config/sections');
const carouselConfig = sections.find(s => s.sectionId === 'carousel');

// Formato Mapa - acesso direto (RECOMENDADO)
const sectionsMap: SectionOrderConfigMap = await api.get('/config/sections-map');
const carouselConfig = sectionsMap.carousel;
```

### Seções Disponíveis
- `carousel` - Carrossel de notícias
- `videos` - Seção de vídeos
- `destaques` - Notícias em destaque
- `top-gazeta` - Top Gazeta
- `cluster` - Cluster de notícias / Mais lidas

## Schema do Banco de Dados

### destaque_configs
- `id` - ID da configuração
- `random_mode` - Modo aleatório ativo
- `created_by` - ID do usuário criador (UNIQUE)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### destaque_category_relations
- `id` - ID da relação
- `destaque_config_id` - ID da configuração
- `category_id` - ID da categoria
- UNIQUE: `(destaque_config_id, category_id)`

### top_gazeta_configs
- Mesma estrutura de `destaque_configs`

### top_gazeta_category_relations
- Mesma estrutura de `destaque_category_relations`

### section_order_configs
- `id` - ID da configuração
- `section_id` - Identificador da seção (UNIQUE)
- `name` - Nome da seção
- `title` - Título exibido
- `order` - Ordem de exibição (UNIQUE)
- `show_title` - Exibir título
- `icon` - Ícone material icons
- `created_by` - ID do usuário criador
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### social_media_configs
- `id` - ID da configuração
- `instagram` - URL do Instagram
- `facebook` - URL do Facebook
- `youtube` - URL do YouTube
- `linkedin` - URL do LinkedIn
- `twitter` - URL do Twitter/X
- `tiktok` - URL do TikTok
- `whatsapp` - Número do WhatsApp
- `created_by` - ID do usuário criador (UNIQUE)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

