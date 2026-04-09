# Guia de Deploy Angular SSR no Vercel (Monorepo Nx)

Este documento explica como realizar o deploy da aplicação `site-gazeta` no Vercel garantindo que o Server-Side Rendering (SSR) funcione corretamente.

## Configurações Aplicadas
Foram criados os seguintes arquivos para suportar o SSR:
1.  `vercel.json`: Define as rotas para arquivos estáticos e direciona o restante para a função SSR.
2.  `api/index.mjs`: Atua como ponte (serverless function) para carregar o bundle de servidor gerado pelo Angular.
3.  `apps/site-gazeta/src/server.ts`: Ajustado para localizar o diretório de arquivos estáticos corretamente no ambiente Vercel.

## Passo a Passo para o Deploy

### 1. No Painel do Vercel
Ao importar o repositório no Vercel, utilize as seguintes configurações:

*   **Framework Preset**: `Other` (NÃO selecione Angular — o preset Angular conflita com o setup manual de serverless function)
*   **Root Directory**: `.` (A raiz do seu monorepo)
*   **Build Command**: `npx nx build site-gazeta --configuration=production`
*   **Output Directory**: Deixe **vazio** (ou coloque `.`) — não aponte para `dist/apps/site-gazeta/browser`, pois isso faria o Vercel servir os estáticos diretamente, ignorando o SSR.
*   **Install Command**: `npm install` (ou deixe o padrão)

> **⚠️ IMPORTANTE:** O Output Directory deve ficar vazio porque o `vercel.json` já controla os rewrites (estáticos → `/browser`, demais → `/api`). Se você definir um Output Directory, o Vercel sobrescreve essa lógica.

### 2. Variáveis de Ambiente
Certifique-se de adicionar todas as variáveis de ambiente necessárias no painel do Vercel (**Settings > Environment Variables**), como:
*   `API_URL`: URL da sua API backend.
*   Quaisquer outras chaves de API usadas no frontend.

### 3. Deploy via CLI (Opcional)
Se preferir usar o terminal:
```bash
# Instale a CLI do Vercel se não tiver
npm install -g vercel

# Inicie o deploy
vercel
```

## Arquitetura do Deploy

```
Requisição do usuário
        │
        ▼
   vercel.json (rewrites)
        │
        ├── /assets, /css, /js, .ico, .png... → /browser/* (CDN estática)
        │
        └── /* (todas as rotas) → /api (Serverless Function)
                                    │
                                    ▼
                            api/index.mjs
                                    │
                                    ▼
                    dist/apps/site-gazeta/server/server.mjs
                            (Angular SSR Engine)
```

## Como validar se o SSR está funcionando?
1. Após o deploy, acesse a URL gerada pelo Vercel.
2. Clique com o botão direito na página e selecione **"Exibir código fonte da página"** (View Page Source).
3. Se você vir o conteúdo HTML da página (ex: títulos das notícias, textos) preenchido no código fonte (e não apenas uma tag `<app-root></app-root>` vazia), o **SSR está funcionando corretamente**.
4. Verifique também os **logs das Functions** no painel do Vercel para ver as mensagens `[SSR] Requisição recebida para: /`.

## Notas sobre Monorepos
Este setup utiliza uma **Serverless Function** personalizada em `/api` para rodar o servidor Express do Angular. Isso é necessário porque o Vercel, por padrão em monorepos, tenta servir o `index.html` estaticamente antes de processar o SSR. O arquivo `vercel.json` e as rotas definidas nele resolvem esse conflito.

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Página mostra apenas `<app-root></app-root>` | Output Directory está apontando para `/browser` | Deixe Output Directory vazio no painel |
| Erro 500 na function | `api/index.mjs` não encontra o `server.mjs` | Verifique se o `includeFiles` no `vercel.json` está correto |
| Framework preset sobrescreve config | Preset `Angular` selecionado | Mude para `Other` |
| Erro de import/ESM | Arquivo usa `.js` com syntax ESM | Garanta que o arquivo é `.mjs` |
