import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NewsManagerService } from '../service/news-manager.service';

/**
 * Interceptor que adiciona automaticamente IDs excluídos nos endpoints de notícias
 * 
 * Funciona de forma inteligente:
 * - Detecta endpoints de notícias que suportam o parâmetro 'exclude'
 * - Injeta automaticamente os IDs de notícias já exibidas
 * - Evita duplicatas na mesma página
 * - Funciona apenas no browser (não afeta SSR)
 */
export const excludeNewsInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // Apenas processa no browser
  if (!isBrowser) {
    return next(req);
  }

  const newsManagerService = inject(NewsManagerService);
  const url = req.url;

  // Lista de endpoints que suportam o parâmetro 'exclude'
  // NOTA: latest-news e most-viewed NÃO estão incluídos pois devem mostrar sempre
  // as mais recentes/mais vistas, mesmo que já tenham sido exibidas em outras seções
  const newsEndpointsWithExclude = [
    '/news/featured',
    '/news/category/',
    '/news'
  ];

  // Verifica se é um endpoint de notícias que suporta exclusão
  const isNewsEndpoint = newsEndpointsWithExclude.some(endpoint => url.includes(endpoint));

  if (isNewsEndpoint && newsManagerService.excludedIds.length > 0) {
    // Pega os IDs excluídos
    const excludeIds = newsManagerService.excludedIds.join(',');

    // Adiciona o parâmetro 'exclude' na requisição
    let params = req.params || new HttpParams();
    
    // Não sobrescreve se já existe um parâmetro exclude (permite override manual)
    if (!params.has('exclude')) {
      params = params.set('exclude', excludeIds);
    }

    // Clona a requisição com os novos parâmetros
    const modifiedReq = req.clone({ params });

    console.log(`🔍 Exclude Interceptor: Adicionando ${newsManagerService.excludedIds.length} IDs excluídos para ${url}`);

    return next(modifiedReq);
  }

  // Se não é um endpoint de notícias, passa sem modificar
  return next(req);
};

