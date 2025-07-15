import { Component, inject } from '@angular/core';

import { MenuItem } from '@site-gazeta/models';
import { SidebarComponent } from '@site-gazeta/sidebar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent {
  authService = inject(AuthService);
  menuItems: MenuItem[] = [
    { name: 'Metricas', router: '' },
    { name: 'Menu', router: 'menu'},
    { name: 'Categorias', router: 'category'},
    { name: 'Notícias', router: 'news', children:[
      { name: 'Criar Notícia', router: 'news' },
      { name:'Lista de Notícias', router: 'newsList'}
    ]},
    // { name: 'Videos', router: 'videos'},
    { name: 'Anúncios', router: 'ads'},
    // { name: 'Usuários', router: 'users'},
    // { name: 'Configurações', router: 'config' },
  ]
  logout(){
    console.log('logout');
    this.authService.logout();
  }
}
