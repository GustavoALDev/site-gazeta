<<<<<<< HEAD
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
=======
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
>>>>>>> b5f2738636de535f6ccfc333327d5ae48f987cb9

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly SESSION_KEY = 'analytics_session_id';
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutos
  private platformId = inject(PLATFORM_ID);

  /**
   * Verifica se está no browser
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Obtém ou cria um ID de sessão único
   */
  getSessionId(): string {
<<<<<<< HEAD
    if (!this.isBrowser) return '';
=======
    // Se não estiver no browser, retornar sessão temporária
    if (!this.isBrowser()) {
      return this.generateSessionId();
    }

>>>>>>> b5f2738636de535f6ccfc333327d5ae48f987cb9
    const stored = this.getStoredSession();
    
    if (stored && this.isSessionValid(stored.timestamp)) {
      // Atualizar timestamp da sessão ativa
      this.updateSessionTimestamp(stored.sessionId);
      return stored.sessionId;
    }

    // Criar nova sessão
    return this.createNewSession();
  }

  /**
   * Recupera sessão armazenada
   */
  private getStoredSession(): { sessionId: string; timestamp: number } | null {
    if (!this.isBrowser) return null;
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Verifica se sessão ainda é válida
   */
  private isSessionValid(timestamp: number): boolean {
    if (!this.isBrowser) return false;
    const now = Date.now();
    return (now - timestamp) < this.SESSION_DURATION;
  }

  /**
   * Cria nova sessão
   */
  private createNewSession(): string {
    if (!this.isBrowser) return '';
    const sessionId = this.generateSessionId();
    this.storeSession(sessionId);
    return sessionId;
  }

  /**
   * Armazena sessão no localStorage
   */
  private storeSession(sessionId: string): void {
    if (!this.isBrowser) return;
    const data = {
      sessionId,
      timestamp: Date.now()
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
  }

  /**
   * Atualiza timestamp da sessão existente
   */
  private updateSessionTimestamp(sessionId: string): void {
    if (!this.isBrowser) return;
    this.storeSession(sessionId);
  }

  /**
   * Gera ID único de sessão
   */
  private generateSessionId(): string {
    if (!this.isBrowser) return '';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `session-${timestamp}-${random}`;
  }

  /**
   * Limpa sessão (útil para logout ou testes)
   */
  clearSession(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.SESSION_KEY);
  }
}

