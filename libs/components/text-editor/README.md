# Text Editor Component

Componente Angular baseado no CKEditor5 com suporte a upload automático de imagens.

## Características

- ✅ Editor de texto rico baseado no CKEditor5
- ✅ Upload automático de imagens para API
- ✅ Integração com `ControlValueAccessor` para uso em formulários reativos
- ✅ Configuração flexível de API URL
- ✅ Substituição automática de base64 por URLs públicas

## Instalação

Este componente já está configurado no monorepo. Para usá-lo, importe-o no seu componente:

```typescript
import { TextEditorComponent } from '@site-gazeta/text-editor';
```

## Uso Básico

### Em um Formulário Reativo

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TextEditorComponent } from '@site-gazeta/text-editor';
import { environment } from '../env/env';

@Component({
  selector: 'app-example',
  imports: [TextEditorComponent],
  template: `
    <form [formGroup]="form">
      <lib-text-editor 
        formControlName="content"
        [apiUrl]="apiUrl"
        [postId]="postId || 0">
      </lib-text-editor>
    </form>
  `
})
export class ExampleComponent implements OnInit {
  apiUrl = environment.apiUrl;
  postId: number | null = null;
  
  form = this.fb.group({
    content: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obter ID se estiver editando
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.postId = parseInt(params['id']);
      }
    });
  }
}
```

### Uso Standalone (sem especificar apiUrl)

```typescript
<lib-text-editor formControlName="content"></lib-text-editor>
```

Neste caso, será usado o apiUrl padrão: `http://localhost:3000/api`

## Upload de Imagens

Para detalhes completos sobre como funciona o upload de imagens, veja [UPLOAD_IMAGES.md](./UPLOAD_IMAGES.md).

### Resumo

1. Quando você cola ou faz upload de uma imagem, ela é automaticamente enviada para `/media/upload`
2. A API processa a imagem e retorna URLs
3. O editor substitui a imagem temporária pela URL pública

## API Props

| Propriedade | Tipo              | Padrão                          | Descrição                                      |
|-------------|-------------------|---------------------------------|------------------------------------------------|
| `apiUrl`    | `string`          | `http://localhost:3000/api`     | URL base da API para upload                     |
| `postId`    | `number | string` | `0`                             | ID da postagem para associar uploads de imagens |

## Estrutura do Projeto

```
text-editor/
├── src/
│   ├── lib/
│   │   ├── ckeditor/         # Build customizado do CKEditor5
│   │   ├── text-editor/      # Componente principal
│   │   └── upload-adapter/   # Adaptador de upload de imagens
│   └── index.ts
├── UPLOAD_IMAGES.md          # Documentação detalhada de upload
└── README.md                 # Este arquivo
```

## Running unit tests

Run `nx test text-editor` to execute the unit tests.

## Troubleshooting

### Imagens ainda aparecem como base64

Verifique se:
- O `apiUrl` está correto
- O endpoint `/media/upload` está acessível
- A API está retornando a estrutura de resposta correta

### Erro CORS

Configure o backend para aceitar requisições do frontend.

Para mais detalhes, veja [UPLOAD_IMAGES.md](./UPLOAD_IMAGES.md).
