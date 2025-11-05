# 🔍 Guia de Debug - Upload de Imagens CKEditor5

## Console Logs Implementados

Os seguintes logs foram adicionados para debug:

### 1️⃣ Inicialização do Componente
```
🎬 [TextEditor] Inicializando componente...
⚙️ [TextEditor] Configurações: { apiUrl: "...", postId: ... }
✅ [TextEditor] Configuração do editor criada
📝 [TextEditor] Plugin de upload adicionado aos extraPlugins
✅ [TextEditor] Componente inicializado com sucesso!
```

### 2️⃣ Registro do Plugin
```
🔌 [CKEditor Plugin] Criando plugin de upload com configurações: { apiUrl: "...", postId: ... }
🔧 [CKEditor Plugin] Registrando adaptador de upload no FileRepository
✅ [CKEditor Plugin] Plugin de upload registrado com sucesso!
```

### 3️⃣ Processo de Upload
```
📸 [CKEditor Plugin] Criando novo adaptador para upload
🖼️ [CKEditor Upload] Iniciando upload de imagem...
📤 [CKEditor Upload] Arquivo detectado: { name: "...", size: "...", type: "..." }
📦 [CKEditor Upload] FormData preparado: { postId: ..., emphasis: "false", apiUrl: "..." }
🚀 [CKEditor Upload] Requisição aberta, enviando...
📡 [CKEditor Upload] Enviando requisição para: http://...
📊 [CKEditor Upload] Progresso: 50%
📊 [CKEditor Upload] Progresso: 100%
✅ [CKEditor Upload] Requisição concluída! Status: 201
📥 [CKEditor Upload] Resposta recebida: { ... }
🎉 [CKEditor Upload] URL da imagem obtida: http://...
✨ [CKEditor Upload] Upload concluído com sucesso!
```

## 🔎 Checklist de Debug

Abra o **DevTools (F12)** e siga este checklist:

### Passo 1: Verificar Inicialização
Ao carregar a página, você deve ver:
- [ ] `🎬 [TextEditor] Inicializando componente...`
- [ ] `🔌 [CKEditor Plugin] Criando plugin de upload...`
- [ ] `✅ [CKEditor Plugin] Plugin de upload registrado com sucesso!`

**❌ Se NÃO aparecer:** O componente não está sendo inicializado corretamente. Verifique se o `[apiUrl]` e `[postId]` estão sendo passados.

---

### Passo 2: Adicionar Imagem no Editor
Cole ou arraste uma imagem. Você deve ver:
- [ ] `📸 [CKEditor Plugin] Criando novo adaptador para upload`
- [ ] `🖼️ [CKEditor Upload] Iniciando upload de imagem...`

**❌ Se NÃO aparecer:** O plugin não foi registrado corretamente. Possível causa:
- O CKEditor5 não tem o plugin `FileRepository`
- A build do CKEditor não suporta upload

---

### Passo 3: Verificar Envio
Se o upload iniciou, você deve ver:
- [ ] `📤 [CKEditor Upload] Arquivo detectado`
- [ ] `📦 [CKEditor Upload] FormData preparado`
- [ ] `📡 [CKEditor Upload] Enviando requisição para:`

**❌ Se NÃO aparecer:** O adaptador não está sendo chamado.

---

### Passo 4: Verificar Resposta
Se a requisição foi enviada, você deve ver:
- [ ] `📊 [CKEditor Upload] Progresso: 100%`
- [ ] `✅ [CKEditor Upload] Requisição concluída! Status: 201`
- [ ] `📥 [CKEditor Upload] Resposta recebida`

**❌ Se aparecer erro de rede:** Backend não está rodando ou CORS não está configurado.

---

### Passo 5: Verificar URL Substituída
Se tudo funcionou, você deve ver:
- [ ] `🎉 [CKEditor Upload] URL da imagem obtida`
- [ ] `✨ [CKEditor Upload] Upload concluído com sucesso!`

**✅ Se aparecer:** A imagem foi substituída por URL!

---

## 🚨 Erros Comuns

### Erro 1: Plugin não registrado
```
❌ [CKEditor Plugin] Erro ao registrar plugin: ...
```
**Causa:** O CKEditor build não tem o plugin FileRepository  
**Solução:** Verifique se a build do CKEditor inclui suporte a upload

### Erro 2: Erro de rede
```
❌ [CKEditor Upload] Erro de rede!
❌ [CKEditor Upload] Verifique se o backend está rodando e se o CORS está configurado
```
**Causa:** Backend não está acessível  
**Soluções:**
1. Verifique se o backend está rodando em `http://localhost:3000`
2. Configure CORS no backend
3. Verifique se o `apiUrl` está correto

### Erro 3: Resposta inválida
```
❌ [CKEditor Upload] Resposta inválida
❌ [CKEditor Upload] Estrutura esperada: { imgSize: { original: "url" } }
```
**Causa:** A API retornou estrutura diferente  
**Solução:** Verifique a resposta da API no log `📥 [CKEditor Upload] Resposta recebida`

### Erro 4: Nenhum log aparece
**Causa:** O componente não está sendo carregado  
**Soluções:**
1. Verifique se o componente está no template
2. Verifique se os imports estão corretos
3. Limpe o cache e recompile: `nx reset && nx serve painel-gazeta`

---

## 🔬 Testes Adicionais

### Teste 1: Verificar se o plugin está carregado
No console do DevTools, digite:
```javascript
// Aguarde o editor carregar, depois:
document.querySelector('ckeditor').editor.plugins.has('FileRepository')
```
**Deve retornar:** `true`

### Teste 2: Verificar configuração do editor
```javascript
document.querySelector('ckeditor').editor.config
```
**Deve conter:** `extraPlugins` array

### Teste 3: Testar requisição manualmente
```javascript
const formData = new FormData();
formData.append('file', /* seu arquivo */);
formData.append('postId', '0');
formData.append('emphasis', 'false');

fetch('http://localhost:3000/api/media/upload', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log('Resposta:', data));
```

---

## 📋 O que Reportar

Se ainda não funcionar, copie e me envie:

1. **Todos os logs do console** que começam com `[TextEditor]`, `[CKEditor Plugin]` ou `[CKEditor Upload]`
2. **Aba Network** do DevTools: há alguma requisição para `/media/upload`?
3. **Erro específico** se houver
4. **Build do CKEditor** que está usando (Classic, Inline, etc.)

---

## 🎯 Fluxo Esperado (Sucesso)

```
1. 🎬 [TextEditor] Inicializando componente...
2. ⚙️ [TextEditor] Configurações: { apiUrl: "http://localhost:3000/api", postId: 0 }
3. 🔌 [CKEditor Plugin] Criando plugin de upload...
4. ✅ [CKEditor Plugin] Plugin de upload registrado com sucesso!
   
   [Usuário cola imagem]
   
5. 📸 [CKEditor Plugin] Criando novo adaptador para upload
6. 🖼️ [CKEditor Upload] Iniciando upload de imagem...
7. 📤 [CKEditor Upload] Arquivo detectado: { name: "image.png", size: "250 KB", type: "image/png" }
8. 📦 [CKEditor Upload] FormData preparado
9. 📡 [CKEditor Upload] Enviando requisição para: http://localhost:3000/api/media/upload
10. 📊 [CKEditor Upload] Progresso: 100%
11. ✅ [CKEditor Upload] Requisição concluída! Status: 201
12. 📥 [CKEditor Upload] Resposta recebida: { id: 1, imgSize: { original: "..." } }
13. 🎉 [CKEditor Upload] URL da imagem obtida: http://localhost:3000/uploads/...
14. ✨ [CKEditor Upload] Upload concluído com sucesso!
```

---

## 💡 Dica Rápida

Se você ver a imagem em base64, mas **NENHUM LOG** aparece no console:
- O plugin não está sendo registrado
- Verifique se está usando o componente correto: `<lib-text-editor>`
- Recompile o projeto: `nx reset && nx build text-editor && nx serve painel-gazeta`

