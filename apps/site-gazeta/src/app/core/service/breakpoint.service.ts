import { Injectable, signal, OnDestroy, afterNextRender } from '@angular/core';

export enum Breakpoint {
  MOBILE = 1128,
  TABLET = 768,
  DESKTOP = 1440,
}

@Injectable({
  providedIn: 'root'
})
export class BreakpointService implements OnDestroy {
  private resizeListener?: () => void;
  
  // Signals para diferentes breakpoints
  isMobile = signal<boolean | null>(null);
  isTablet = signal<boolean | null>(null);
  isDesktop = signal<boolean | null>(null);
  currentWidth = signal<number | null>(null);

  constructor() {
    // Detecta o breakpoint apenas no cliente após a renderização
    afterNextRender(() => {
      this.initializeBreakpointDetection();
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initializeBreakpointDetection(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Verifica o tamanho inicial
    this.checkBreakpoints();

    // Adiciona listener para mudanças de tamanho
    this.resizeListener = () => this.checkBreakpoints();
    window.addEventListener('resize', this.resizeListener);
  }

  private checkBreakpoints(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const width = window.innerWidth;
    this.currentWidth.set(width);
    this.isMobile.set(width <= Breakpoint.MOBILE);
    this.isTablet.set(width > Breakpoint.TABLET && width <= Breakpoint.MOBILE);
    this.isDesktop.set(width > Breakpoint.MOBILE);
  }

  /**
   * Verifica se a largura atual está abaixo de um breakpoint específico
   */
  isBelow(breakpoint: Breakpoint): boolean {
    const width = this.currentWidth();
    return width !== null ? width <= breakpoint : false;
  }

  /**
   * Verifica se a largura atual está acima de um breakpoint específico
   */
  isAbove(breakpoint: Breakpoint): boolean {
    const width = this.currentWidth();
    return width !== null ? width > breakpoint : false;
  }

  /**
   * Verifica se a largura atual está entre dois breakpoints
   */
  isBetween(min: Breakpoint, max: Breakpoint): boolean {
    const width = this.currentWidth();
    return width !== null ? width > min && width <= max : false;
  }

  /**
   * Limpa os listeners de evento
   */
  private cleanup(): void {
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}

