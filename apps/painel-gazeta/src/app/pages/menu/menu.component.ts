import { Component } from '@angular/core';


@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  activeTab: 'top' | 'lateral' | 'central' = 'top';

  setActiveTab(tab: 'top' | 'lateral' | 'central') {
    this.activeTab = tab;
  }
}
