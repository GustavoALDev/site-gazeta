# Menu CRUD

Este módulo implementa um sistema completo de CRUD para gerenciamento de menus no sistema.

## Funcionalidades

- ✅ Criar novos itens de menu
- ✅ Listar todos os menus ativos
- ✅ Obter menu por ID
- ✅ Atualizar menus existentes
- ✅ Excluir menus (soft delete)
- ✅ Reordenar múltiplos menus
- ✅ Validação de tipos e campos obrigatórios
- ✅ Documentação Swagger completa

## Tipos de Menu Suportados

### 1. Internal (internal)
Para links internos da aplicação.
- **Campo obrigatório**: `routerLink`
- **Exemplo**: `/sobre`, `/contato`, `/noticias`

### 2. External (external)
Para links externos.
- **Campo obrigatório**: `externalLink`
- **Exemplo**: `https://exemplo.com`

### 3. Category (category)
Para links de categorias.
- **Campo obrigatório**: `slug`
- **Exemplo**: `tecnologia`, `esportes`, `politica`

## Endpoints da API

### POST `/menu`
Cria um novo item de menu.

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "order": 1,
  "name": "Início",
  "type": "internal",
  "routerLink": "/"
}
```

### GET `/menu`
Lista todos os menus ativos ordenados por ordem.

### GET `/menu/:id`
Obtém um menu específico por ID.

### PATCH `/menu/:id`
Atualiza um menu existente.

**Headers**: `Authorization: Bearer <token>`

**Body** (campos opcionais):
```json
{
  "name": "Novo Nome",
  "order": 2
}
```

### DELETE `/menu/:id`
Exclui um menu (soft delete).

**Headers**: `Authorization: Bearer <token>`

### PATCH `/menu/reorder/batch`
Reordena múltiplos menus de uma vez.

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "menus": [
    { "id": 1, "order": 2 },
    { "id": 2, "order": 1 },
    { "id": 3, "order": 3 }
  ]
}
```

## Validações

### Ordem
- Deve ser um número único
- Não pode haver duas ordens iguais

### Tipo e Campos
- `internal`: Requer `routerLink`
- `external`: Requer `externalLink` (deve ser URL válida)
- `category`: Requer `slug`

### Nome
- Obrigatório
- Entre 1 e 255 caracteres

## Estrutura do Banco de Dados

```sql
CREATE TABLE `menus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(255) NULL,
    `router_link` VARCHAR(500) NULL,
    `external_link` VARCHAR(500) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `menu_order_unique`(`order`),
    INDEX `menu_order_active_idx`(`order`, `is_active`),
    PRIMARY KEY (`id`)
);
```

## Dados de Exemplo

Para popular o banco com dados iniciais, execute:

```bash
npm run db:seed
```

Isso criará os seguintes menus de exemplo:
- Início (internal)
- Notícias (internal)  
- Política (category)
- Esportes (category)
- Tecnologia (category)
- Sobre (internal)
- Contato (internal)

## Interface TypeScript

```typescript
export interface Menu {
    order: number;
    name: string;
    type: string;
    slug?: string;
    routerLink?: string;
    externalLink?: string;
}
```

## Uso no Frontend

### Angular/React
```typescript
// Buscar todos os menus
const menus = await fetch('/api/menu').then(res => res.json());

// Usar os menus para renderizar navegação
menus.forEach(menu => {
  switch(menu.type) {
    case 'internal':
      // Usar router.navigate(menu.routerLink)
      break;
    case 'external': 
      // Usar window.open(menu.externalLink)
      break;
    case 'category':
      // Usar router.navigate(`/categoria/${menu.slug}`)
      break;
  }
});
```

## Segurança

- Operações de escrita (POST, PATCH, DELETE) requerem autenticação JWT
- Operações de leitura (GET) são públicas
- Soft delete preserva dados históricos
- Validação rigorosa de entrada de dados 