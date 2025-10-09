import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(this.getInitialDarkMode());
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.applyDarkMode(this.isDarkModeSubject.value);
  }

  toggleDarkMode(): void {
    const newValue = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newValue);
    this.applyDarkMode(newValue);
    this.saveDarkModePreference(newValue);
  }

  private getInitialDarkMode(): boolean {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  private applyDarkMode(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  private saveDarkModePreference(isDark: boolean): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDark));
    }
  }
}
