import { ApiService } from './../../../../../site-gazeta/src/app/core/service/api.service';
import { Component, inject } from '@angular/core';


import { SidebarComponent } from '@site-gazeta/sidebar';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  route = inject(ActivatedRoute);
  menuItems = [
    { name: 'Metricas', routerLink: '' },
    { name: 'Menu', routerLink: 'menu'},
    { name: 'Categorias', routerLink: 'category'},
    { name: 'Notícias', routerLink: 'news', children:[
      { name: 'Criar Notícia', routerLink: 'news' },
      { name:'Lista de Notícias', routerLink: 'newsList'}
    ]},
    { name: 'Vídeos', routerLink: 'videos', children:[
      { name: 'Upload de Vídeo', routerLink: 'videos' },
      { name:'Lista de Vídeos', routerLink: 'videosList'}
    ]},
    { name: 'Anúncios', routerLink: 'ads', children:[
      { name: 'Criar Anúncio', routerLink: 'ads' },
      { name:'Lista de Anúncios', routerLink: 'adsList'}
    ]},
    // { name: 'Usuários', routerLink: 'users'},
    { name: 'Configurações', routerLink: 'config' },
  ]
  logout(){
    this.authService.logout();
  }
}
