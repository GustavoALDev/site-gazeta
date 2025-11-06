# Guia Rápido: Configuração de Upload de Imagens no CKEditor5

## 🎯 O que foi implementado?

Agora o CKEditor5 no seu projeto faz upload automático de imagens para a API ao invés de salvá-las como base64!

## 🚀 Como usar?

### 1. No template HTML

```html
<lib-text-editor 
  formControlName="content"
  [apiUrl]="apiUrl"
  [postId]="newsId || 0">
</lib-text-editor>
```

### 2. No componente TypeScript

```typescript
import { environment } from '../../core/env/env';

export class NewsComponent {
  apiUrl = environment.apiUrl;
  newsId: number | null = null; // ID da notícia (quando editando)
  
  // resto do código...
}
```

## 📸 Como funciona?

1. **Você adiciona uma imagem** (cola, arrasta, ou faz upload)
2. **O editor intercepta** a imagem automaticamente
3. **Envia para a API** via `/media/upload`
4. **Recebe a URL** da imagem processada
5. **Substitui no conteúdo** a URL ao invés de base64

## ✅ Exemplo Prático

### Criando uma nova notícia:
```html
<lib-text-editor 
  formControlName="content"
  [apiUrl]="apiUrl"
  [postId]="0">
</lib-text-editor>
```

### Editando uma notícia existente:
```html
<lib-text-editor 
  formControlName="content"
  [apiUrl]="apiUrl"
  [postId]="newsId || 0">
</lib-text-editor>
```

## 🔧 Configurações

| Parâmetro | Obrigatório? | Padrão | Descrição |
|-----------|--------------|--------|-----------|
| `formControlName` | ✅ Sim | - | Nome do control do formulário |
| `apiUrl` | ❌ Não | `http://localhost:3000/api` | URL da API |
| `postId` | ❌ Não | `0` | ID da postagem |

## 🎨 O que acontece com as imagens?

### Antes (❌ Problema):
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." />
```
- Conteúdo enorme no banco de dados
- Lento para carregar
- Difícil de gerenciar

### Agora (✅ Solução):
```html
<img src="http://localhost:3000/uploads/media/media_1234567890_image.jpg" />
```
- URL limpa e curta
- Imagem otimizada em vários tamanhos
- Fácil de gerenciar

## 📦 Resposta da API

O endpoint `/media/upload` retorna:

```json
{
  "id": 1,
  "newsId": 123,
  "imgSize": {
    "original": "http://localhost:3000/uploads/media/media_1234567890_image.jpg",
    "medium": "http://localhost:3000/uploads/media/media_1234567890_image_medium.jpg",
    "small": "http://localhost:3000/uploads/media/media_1234567890_image_small.jpg",
    "superSmall": "http://localhost:3000/uploads/media/media_1234567890_image_supersmall.jpg"
  }
}
```

O editor usa automaticamente a URL `original`.

## 🐛 Problemas Comuns

### Imagens ainda aparecem como base64?
✅ **Solução**: Verifique se o `apiUrl` está correto e se o backend está rodando.

### Erro 401 (Não autorizado)?
✅ **Solução**: Adicione autenticação ao adaptador (veja UPLOAD_IMAGES.md).

### Erro CORS?
✅ **Solução**: Configure o backend para aceitar requisições do frontend:
```typescript
// No backend NestJS (main.ts)
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,
});
```

## 📚 Documentação Completa

- [UPLOAD_IMAGES.md](./UPLOAD_IMAGES.md) - Documentação detalhada
- [README.md](./README.md) - Documentação do componente

## 🎉 Pronto!

Agora você pode adicionar imagens no editor e elas serão automaticamente enviadas para a API! 

Não precisa fazer nada além de configurar o `apiUrl` e `postId`.

