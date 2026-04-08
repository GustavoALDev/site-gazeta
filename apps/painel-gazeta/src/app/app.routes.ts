import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/auth/auth.guard';

export const appRoutes: Route[] = [
  {path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)},
  {path: '', component: HomeComponent, canActivate: [authGuard], children:[
    {path:'', loadComponent: () => import('./pages/metrics/metrics.component').then(m => m.MetricsComponent)},
    {path:'category', loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent)},
    {path:'news', loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent)},
    {path:'news/:id', loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent)},
    {path:'newsList', loadComponent: () => import('./pages/news/news-list/news-list.component').then(m => m.NewsListComponent)},
    {path:'menu', loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent)},
    {path:'videos', loadComponent: () => import('./pages/videos/videos.component').then(m => m.VideosComponent)},
    {path:'videos/:id', loadComponent: () => import('./pages/videos/videos.component').then(m => m.VideosComponent)},
    {path:'videosList', loadComponent: () => import('./pages/videos/video-list/video-list.component').then(m => m.VideoListComponent)},
    {path:'users', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)},
    {path:'config', loadComponent: () => import('./pages/config/config.component').then(m => m.ConfigComponent)},
    {path:'ads', loadComponent: () => import('./pages/ads/ads.component').then(m => m.AdsComponent)},
    {path:'ads/:id', loadComponent: () => import('./pages/ads/ads.component').then(m => m.AdsComponent)},
    {path:'adsList', loadComponent: () => import('./pages/ads/ads-list/ads-list.component').then(m => m.AdsListComponent)},
  ]}
];
