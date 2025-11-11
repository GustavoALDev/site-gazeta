import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MenuComponent } from '@site-gazeta/menu';
import { Menu } from '@site-gazeta/models';
import { ApiService } from '../../core/service/api.service';
import { NewsSearchComponent } from '../news-search/news-search.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    MenuComponent,
    NewsSearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit{
  private apiService = inject(ApiService);
  menuItems = signal<Menu[]>([]);
  searchActive = signal<boolean>(false);
  searchQuery = signal<string>('');

  ngOnInit(): void {
    this.getMenu();
    
  }
  getMenu(){
    this.apiService.getMenu().subscribe((menu) => {
      this.menuItems.set(menu as Menu[]);
    });
  }

  

  
    
}
