import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '@site-gazeta/dark-mode';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Ads } from '@site-gazeta/models';

@Component({
  selector: 'lib-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode$ = signal<boolean>(false);
  darkModeService = inject(DarkModeService);
  destroy$ = new Subject<void>();
  announcements = input<Ads[]>([]); 
  
  ngOnInit(): void {
    this.darkModeService.isDarkMode$
    .pipe(takeUntil(this.destroy$))
    .subscribe((isDarkMode) => {
      this.isDarkMode$.set(isDarkMode);
    });
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  getButtonStyle(): string {
    const isDark = this.isDarkMode$();
    const baseStyle = 'display: flex; align-items: center; gap: 8px; border: none; border-radius: 25px; padding: 10px 16px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.3s ease;';
    
    if (isDark) {
      return baseStyle + ' background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); color: #2d3436; box-shadow: 0 4px 15px rgba(255, 234, 167, 0.3);';
    } else {
      return baseStyle + ' background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
