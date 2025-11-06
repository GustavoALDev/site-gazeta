import { Component, inject } from '@angular/core';


import { SidebarComponent } from '@site-gazeta/sidebar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Menu } from '@site-gazeta/models';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent {
  authService = inject(AuthService);
  menuItems = [
    { name: 'Metricas', routerLink: '' },
    { name: 'Menu', routerLink: 'menu'},
    { name: 'Categorias', routerLink: 'category'},
    { name: 'Notícias', routerLink: 'news', children:[
      { name: 'Criar Notícia', routerLink: 'news' },
      { name:'Lista de Notícias', routerLink: 'newsList'}
    ]},
    { name: 'Videos', routerLink: 'videos'},
    { name: 'Anúncios', routerLink: 'ads'},
    // { name: 'Usuários', routerLink: 'users'},
    // { name: 'Configurações', routerLink: 'config' },
  ]
  logout(){
    console.log('logout');
    this.authService.logout();
  }
}
