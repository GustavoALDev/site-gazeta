# Guia de Deploy Angular SSR no Vercel (Monorepo Nx)

Este documento explica como realizar o deploy da aplicação `site-gazeta` no Vercel garantindo que o Server-Side Rendering (SSR) funcione corretamente.

## Configurações Aplicadas
Foram criados os seguintes arquivos para suportar o SSR:
1.  `vercel.json`: Define as rotas para arquivos estáticos e direciona o restante para a função SSR.
2.  `api/index.js`: Atua como ponte para carregar o bundle de servidor gerado pelo Angular.
3.  `apps/site-gazeta/src/server.ts`: Ajustado para localizar o diretório de arquivos estáticos corretamente no ambiente Vercel.

## Passo a Passo para o Deploy

### 1. No Painel do Vercel
Ao importar o repositório no Vercel, utilize as seguintes configurações:

*   **Framework Preset**: `Angular`
*   **Root Directory**: `.` (A raiz do seu monorepo)
*   **Build Command**: `npx nx build site-gazeta --configuration=production`
*   **Output Directory**: `dist/apps/site-gazeta/browser`
*   **Install Command**: `npm install` (ou deixe o padrão)

### 2. Variáveis de Ambiente
Certifique-se de adicionar todas as variáveis de ambiente necessárias no painel do Vercel (**Settings > Environment Variables**), como:
*   `API_URL`: URL da sua API backend.
*   Quaisquer outras chaves de API usadas no frontend.

### 3. Deploy via CLI (Opcional)
Se preferir usar o terminal:
```bash
# Instale a CLI do Vercel se n\u00e3o tiver
npm install -g vercel

# Inicie o deploy
vercel
```

## Como validar se o SSR est\u00e1 funcionando?
1. Ap\u00f3s o deploy, acesse a URL gerada pelo Vercel.
2. Clique com o bot\u00e3o direito na p\u00e1gina e selecione **"Exibir c\u00f3digo fonte da p\u00e1gina"** (View Page Source).
3. Se você vir o conteúdo HTML da página (ex: títulos das notícias, textos) preenchido no código fonte (e não apenas uma tag `<app-root></app-root>` vazia), o **SSR está funcionando corretamente**.

## Notas sobre Monorepos
Este setup utiliza uma **Serverless Function** personalizada em `/api` para rodar o servidor Express do Angular. Isso é necessário porque o Vercel, por padrão em monorepos, tenta servir o `index.html` estaticamente antes de processar o SSR. O arquivo `vercel.json` e as rotas definidas nele resolvem esse conflito.
