import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly SESSION_KEY = 'analytics_session_id';
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutos

  /**
   * Obtém ou cria um ID de sessão único
   */
  getSessionId(): string {
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
    const now = Date.now();
    return (now - timestamp) < this.SESSION_DURATION;
  }

  /**
   * Cria nova sessão
   */
  private createNewSession(): string {
    const sessionId = this.generateSessionId();
    this.storeSession(sessionId);
    return sessionId;
  }

  /**
   * Armazena sessão no localStorage
   */
  private storeSession(sessionId: string): void {
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
    this.storeSession(sessionId);
  }

  /**
   * Gera ID único de sessão
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `session-${timestamp}-${random}`;
  }

  /**
   * Limpa sessão (útil para logout ou testes)
   */
  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}

