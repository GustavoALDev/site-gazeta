import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Serviço para gerenciar IDs de notícias excluídas e evitar duplicatas
 *
 * Funcionalidades:
 * - Armazena IDs de notícias já exibidas na página atual (apenas em memória)
 * - Limpa automaticamente ao navegar para uma nova página
 * - Limpa automaticamente ao recarregar a página (F5)
 * - NÃO persiste em sessionStorage (evita acúmulo infinito)
 * - Integra com interceptors para filtrar notícias automaticamente
 */
@Injectable({
  providedIn: 'root'
})
export class NewsManagerService {
  private plataformID = inject(PLATFORM_ID);
  private router = inject(Router);
  excludedIds: number[] = [];
  private currentRoute = '';

  constructor() {
    if (isPlatformBrowser(this.plataformID)) {
      // Inicia sempre vazio (não carrega do sessionStorage)
      this.excludedIds = [];
      this.currentRoute = this.router.url;


      // Monitora início de navegação para limpar IDs
      this.router.events
        .pipe(filter((event): event is NavigationStart => event instanceof NavigationStart))
        .subscribe((event) => {
          // Limpa IDs no INÍCIO da navegação
          if (this.currentRoute !== event.url) {
            this.clearExcludedIds();
          }
        });

      // Monitora fim de navegação para atualizar rota atual
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          this.currentRoute = event.urlAfterRedirects;
        });
    }
  }

  /**
   * Adiciona IDs à lista de excluídos (apenas em memória)
   */
  excludeIds(newIds: number[]): void {
    const uniqueNewIds = newIds.filter(id => !this.excludedIds.includes(id));

    if (uniqueNewIds.length > 0) {
      this.excludedIds.push(...uniqueNewIds);
      this.excludedIds = [...new Set(this.excludedIds)];
    }
  }

  /**
   * Limpa todos os IDs excluídos
   */
  clearExcludedIds(): void {
    this.excludedIds = [];
  }

  /**
   * Verifica se um ID está na lista de excluídos
   */
  isExcluded(id: number): boolean {
    return this.excludedIds.includes(id);
  }

  /**
   * Obtém a quantidade de IDs excluídos
   */
  getExcludedCount(): number {
    return this.excludedIds.length;
  }
}
