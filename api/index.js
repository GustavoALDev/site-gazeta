/**
 * Vercel Serverless Function Bridge for Angular SSR
 * Este arquivo atua como uma ponte entre as requisições do Vercel e o handler do Angular Express.
 */
export default async function handler(req, res) {
  try {
    // Importa dinamicamente o handler gerado pelo build do Angular
    // O caminho deve coincidir com o outputPath definido no project.json (dist/apps/site-gazeta)
    const { reqHandler } = await import('../dist/apps/site-gazeta/server/server.mjs');
    
    // Executa o handler do Angular
    return reqHandler(req, res);
  } catch (error) {
    console.error('Error in SSR Handler:', error);
    res.status(500).send('Internal Server Error while processing SSR');
  }
}
