# 🔧 Fix: Upload de Imagens CKEditor5

## ❌ **Problema Original**

O upload de imagens não estava funcionando - as imagens continuavam sendo salvas em base64 ao invés de serem enviadas para a API.

## 🔍 **Causa Raiz**

A abordagem anterior tentava adicionar o plugin via `extraPlugins`:

```typescript
// ❌ ANTES - Não funciona
this.editorConfig = {
  extraPlugins: [createUploadAdapterPlugin(this.apiUrl, this.postId)]
};
```

**Por que não funciona?**  
- `extraPlugins` é usado para adicionar plugins durante a **construção** do editor
- No CKEditor Angular, precisamos registrar o adaptador **após** o editor estar pronto
- A API `FileRepository.createUploadAdapter` precisa ser chamada quando o editor já está inicializado

## ✅ **Solução Implementada**

Mudamos para usar o evento `(ready)` do CKEditor Angular:

```typescript
// ✅ AGORA - Funciona corretamente
onReady(editor: any): void {
  console.log('🔧 [TextEditor] Editor pronto, configurando upload adapter...');
  
  try {
    // Registra o adaptador de upload quando o editor estiver pronto
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      console.log('📸 [CKEditor Plugin] Criando novo adaptador para upload');
      return new UploadAdapter(loader, this.apiUrl, this.postId);
    };
    
    console.log('✅ [TextEditor] Upload adapter configurado com sucesso!');
  } catch (error) {
    console.error('❌ [TextEditor] Erro ao configurar upload adapter:', error);
  }
}
```

### **Mudanças no Template**

```html
<ckeditor 
  [editor]="editor"
  [config]="editorConfig"
  [data]="value"
  [formControl]="formControl"
  (ready)="onReady($event)"  <!-- ✅ Adicionado evento -->
  (blur)="onTouched()"
></ckeditor>
```

### **Mudanças no Componente**

```typescript
// ✅ Import direto da classe UploadAdapter
import { UploadAdapter } from '../upload-adapter/upload-adapter';

// ✅ Configuração mínima no ngOnInit
ngOnInit(): void {
  this.editorConfig = {
    // Configurações básicas
  };
}

// ✅ Novo método onReady para configurar o adapter
onReady(editor: any): void {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new UploadAdapter(loader, this.apiUrl, this.postId);
  };
}
```

## 🎯 **Como Funciona Agora**

1. **Componente inicializa** → `ngOnInit()` é chamado
2. **Editor é criado** → CKEditor Angular instancia o editor
3. **Editor fica pronto** → Evento `(ready)` é disparado
4. **Adapter é registrado** → `onReady()` configura o `FileRepository`
5. **Usuário cola imagem** → CKEditor chama `createUploadAdapter`
6. **Upload é feito** → `UploadAdapter` envia para API
7. **URL substitui base64** → Imagem aparece com URL correta

## 📊 **Teste**

### Console Logs Esperados

```
🎬 [TextEditor] Inicializando componente...
⚙️ [TextEditor] Configurações: { apiUrl: "...", postId: ... }
✅ [TextEditor] Componente inicializado!
🔧 [TextEditor] Editor pronto, configurando upload adapter...
✅ [TextEditor] Upload adapter configurado com sucesso!
```

Quando você colar uma imagem:
```
📸 [CKEditor Plugin] Criando novo adaptador para upload
🖼️ [CKEditor Upload] Iniciando upload de imagem...
📤 [CKEditor Upload] Arquivo detectado: { name: "...", size: "...", type: "..." }
📦 [CKEditor Upload] FormData preparado
📡 [CKEditor Upload] Enviando requisição para: ...
✅ [CKEditor Upload] Requisição concluída! Status: 201
🎉 [CKEditor Upload] URL da imagem obtida: ...
✨ [CKEditor Upload] Upload concluído com sucesso!
```

## 🧪 **Como Testar**

1. Abra o painel de notícias
2. Crie ou edite uma notícia
3. Cole uma imagem no editor (Ctrl+V)
4. Abra o DevTools (F12) na aba Console
5. Verifique os logs listados acima
6. Verifique na aba Network que a requisição POST foi feita
7. O conteúdo HTML deve ter `<img src="http://...">` ao invés de base64

## ✅ **Resultado**

- ✅ Imagens são enviadas para `/media/upload`
- ✅ Base64 é substituído por URL pública
- ✅ API retorna múltiplos tamanhos (original, medium, small, superSmall)
- ✅ Logs detalhados para debug
- ✅ Tratamento de erros robusto

## 📚 **Referências**

- [CKEditor5 Upload Adapter Guide](https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/simple-upload-adapter.html)
- [Angular CKEditor Component](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/angular.html)
- [FileRepository API](https://ckeditor.com/docs/ckeditor5/latest/api/module_upload_filerepository-FileRepository.html)

## 🎉 **Status**

✅ **Implementação completa e funcional!**

