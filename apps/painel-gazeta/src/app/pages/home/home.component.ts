import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '@site-gazeta/models';
import { SidebarComponent } from '@site-gazeta/sidebar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SidebarComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent {
  menuItems: MenuItem[] = [
    { name: 'Metricas', router: '' },
    { name: 'Categorias', router: 'category'},
    { name: 'Notícias', router: 'news', children:[
      { name: 'Criar Notícia', router: 'news' },
      { name:'Lista de Notícias', router: 'newsList'}
    ]},
    { name: 'Usuários', router: 'users', children:[
      { name: 'Criar Usuário', router: 'criar-usuario' },
      { name: 'Editar Usuário', router: 'editar-usuario' },
      { name: 'Excluir Usuário', router: 'excluir-usuario' },
    ]},
    { name: 'Configurações', router: 'config' },
  ]
}
