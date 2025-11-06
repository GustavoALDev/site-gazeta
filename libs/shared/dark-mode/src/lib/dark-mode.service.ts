import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  // Temporariamente forçado para modo claro
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    // Sempre garante modo claro
    this.applyDarkMode(false);
  }

  toggleDarkMode(): void {
    // Desabilitado temporariamente - sempre mantém modo claro
    // const newValue = !this.isDarkModeSubject.value;
    // this.isDarkModeSubject.next(newValue);
    // this.applyDarkMode(newValue);
    // this.saveDarkModePreference(newValue);
    
    // Força sempre modo claro
    this.isDarkModeSubject.next(false);
    this.applyDarkMode(false);
  }

  private getInitialDarkMode(): boolean {
    // Sempre retorna false (modo claro)
    return false;
  }

  private applyDarkMode(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      // Sempre remove a classe dark-mode para garantir modo claro
      document.body.classList.remove('dark-mode');
    }
  }

  private saveDarkModePreference(isDark: boolean): void {
    // Desabilitado temporariamente
    // if (typeof localStorage !== 'undefined') {
    //   localStorage.setItem('darkMode', JSON.stringify(isDark));
    // }
  }
}
