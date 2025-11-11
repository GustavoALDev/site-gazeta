import { Component, effect, HostListener, inject, input, model, OnInit, output, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Menu } from '@site-gazeta/models';
import { SidebarComponent } from '@site-gazeta/sidebar';

@Component({
  selector: 'lib-menu',
  imports: [FormsModule, RouterModule, SidebarComponent, ReactiveFormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  sidebar = viewChild.required(SidebarComponent);
  menuItems = input.required<Menu[]>();
  showSideMenu = signal<boolean>(false);
  showSearchBar = signal<boolean>(false);
  searchTerm = new FormControl<string>('');
  searchActive = output<boolean>();
  searchBarValue = output<string>();
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.showSearchBar()) {
        queueMicrotask(() => {
          const input = document.querySelector('.search-input') as HTMLInputElement;
          input?.focus();
        });
      }
    })
  }
  ngOnInit(): void {
    this.searchTerm.valueChanges.subscribe((value) => {
      this.searchBarValue.emit(value as string);
    });
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        this.closeSearch()
      }
    });
  }
  toggleSearchBar(): void {
    this.showSearchBar.set(!this.showSearchBar());
    this.searchActive.emit(this.showSearchBar());
    if (!this.showSearchBar()) {
      this.searchTerm.reset();
      this.searchBarValue.emit('');
    }
  }

  performSearch(): void {
      if (this.searchTerm.value?.trim()) {
      console.log('Pesquisando por:', this.searchTerm.value);
    }
  }

  closeSearch(): void {
    this.showSearchBar.set(false);
    this.searchTerm.reset();
    this.searchActive.emit(this.showSearchBar());
  }

  handleSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.performSearch();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeSearch();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showSearchBar()) {
      this.closeSearch();
    }
  }

  toggleSidebar(): void {
    this.sidebar().toggleSidebar();
  }
}
