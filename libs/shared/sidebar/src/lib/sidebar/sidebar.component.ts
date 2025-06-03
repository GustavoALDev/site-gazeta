import { RouterModule } from '@angular/router';
import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '@site-gazeta/models';

@Component({
  selector: 'lib-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  host:{
    class: 'host-sidebar',
  }
})
export class SidebarComponent {
  backdrop = input(true);
  openSidebar = input(() => this.toggleSidebar());
  opened = input(false);
  isOpened = signal<boolean>(false);
  menuItems = input<MenuItem[]>([]);
  expandedMenus = signal<Set<string>>(new Set());

  toggleSidebar() {
    this.isOpened.set(!this.isOpened());
  }

  toggleMenu(menuName: string) {
    const expanded = this.expandedMenus();
    const newExpanded = new Set(expanded);
    
    if (newExpanded.has(menuName)) {
      newExpanded.delete(menuName);
    } else {
      newExpanded.add(menuName);
    }
    
    this.expandedMenus.set(newExpanded);
  }

  isMenuExpanded(menuName: string): boolean {
    return this.expandedMenus().has(menuName);
  }

  hasChildren(menu: MenuItem): boolean {
    return menu.children ? menu.children.length > 0 : false;
  }
}
