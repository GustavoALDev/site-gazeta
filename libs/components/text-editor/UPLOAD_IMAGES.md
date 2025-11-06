# Upload de Imagens no CKEditor5

## Visão Geral

O componente `text-editor` agora suporta upload automático de imagens para a API. Quando você cola ou arrasta uma imagem para o editor, ela será automaticamente enviada para o servidor e substituída por uma URL pública.

## Como Funciona

1. **Upload Automático**: Quando uma imagem é inserida no editor (cola, drag & drop, ou upload), o `UploadAdapter` intercepta a imagem.
2. **Envio para API**: A imagem é enviada via FormData para o endpoint `/media/upload`.
3. **Substituição**: A imagem base64 temporária é substituída pela URL retornada pela API.
4. **Resultado**: O conteúdo HTML final contém apenas URLs de imagens, não base64.

## Uso Básico

### Sem especificar apiUrl (usa padrão)

```typescript
<lib-text-editor formControlName="content"></lib-text-editor>
```

### Especificando apiUrl e postId

```typescript
<lib-text-editor 
  formControlName="content" 
  [apiUrl]="environment.apiUrl"
  [postId]="newsId || 0">
</lib-text-editor>
```

**Importante**: O `postId` é usado para associar a imagem a uma postagem. Use `0` para uploads temporários ou o ID real da postagem quando estiver editando.

## Exemplo Completo

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TextEditorComponent } from '@site-gazeta/text-editor';
import { environment } from '../env/env';

@Component({
  selector: 'app-news',
  imports: [TextEditorComponent],
  template: `
    <form [formGroup]="form">
      <lib-text-editor 
        formControlName="content"
        [apiUrl]="apiUrl"
        [postId]="newsId || 0">
      </lib-text-editor>
    </form>
  `
})
export class NewsComponent implements OnInit {
  apiUrl = environment.apiUrl;
  newsId: number | null = null;
  
  form = this.fb.group({
    content: ['']
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obter ID da notícia se estiver editando
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.newsId = parseInt(params['id']);
      }
    });
  }
}
```

## Estrutura da Resposta da API

O endpoint `/media/upload` deve retornar um objeto no formato:

```json
{
  "id": 1,
  "newsId": 0,
  "emphasis": false,
  "imgSize": {
    "original": "http://localhost:3000/uploads/media/media_1234567890_image.jpg",
    "medium": "http://localhost:3000/uploads/media/media_1234567890_image_medium.jpg",
    "small": "http://localhost:3000/uploads/media/media_1234567890_image_small.jpg",
    "superSmall": "http://localhost:3000/uploads/media/media_1234567890_image_supersmall.jpg"
  },
  "author": null,
  "date": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

O adapter utiliza a URL `imgSize.original` para inserir no conteúdo do editor.

## Parâmetros Enviados no Upload

O adapter envia os seguintes parâmetros:

- `file`: O arquivo de imagem (File)
- `postId`: ID da postagem (obtido do input `@Input() postId`)
- `emphasis`: Se a imagem tem destaque (padrão: 'false')

### Passando o postId Real

Para associar a imagem a uma postagem específica, passe o ID através do input:

```typescript
<lib-text-editor 
  formControlName="content"
  [apiUrl]="apiUrl"
  [postId]="newsId || 0">
</lib-text-editor>
```

O componente agora aceita o `postId` como input, então você não precisa modificar o código do adaptador diretamente.

## Tratamento de Erros

O adapter trata os seguintes cenários de erro:

- **Erro de rede**: Quando não há conexão com o servidor
- **Erro HTTP**: Quando o servidor retorna status 4xx ou 5xx
- **Resposta inválida**: Quando a resposta não contém a estrutura esperada
- **Upload abortado**: Quando o usuário cancela o upload

## Limitações e Considerações

1. **postId Temporário**: Por padrão, as imagens são enviadas com `postId: 0`. Você pode querer implementar lógica para:
   - Enviar o ID real da postagem
   - Limpar imagens órfãs (com postId 0) periodicamente
   
2. **Tamanho de Arquivo**: Certifique-se de que o servidor aceita o tamanho de arquivo desejado.

3. **Tipos de Arquivo**: O endpoint aceita JPG, PNG e WEBP.

4. **Performance**: Imagens grandes podem levar tempo para fazer upload. O adapter mostra o progresso do upload.

## Troubleshooting

### Imagens ainda aparecem como base64

- Verifique se o `apiUrl` está correto
- Verifique se o endpoint `/media/upload` está acessível
- Abra o DevTools e verifique a aba Network para erros

### Erro CORS

Se você receber erros CORS, configure o backend para aceitar requisições do frontend:

```typescript
// No backend NestJS
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,
});
```

### Erro 401 (Não autorizado)

Se o endpoint requer autenticação, você precisará modificar o adapter para incluir o token:

```typescript
// Em upload-adapter.ts, adicione:
const token = localStorage.getItem('token'); // ou de onde você armazena o token
xhr.setRequestHeader('Authorization', `Bearer ${token}`);
```

