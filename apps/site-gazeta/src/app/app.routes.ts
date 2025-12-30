import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HomeComponentsComponent } from './pages/home-components/home-components.component';
import { maintenanceGuard } from './core/guards/maintenance.guard';

export const appRoutes: Route[] = [
  {
    path: 'maintenance',
    loadComponent: () => import('./pages/maintenance/maintenance.component').then(m => m.MaintenanceComponent)
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [maintenanceGuard],
    children: [
      {path: '', component: HomeComponentsComponent},
      {path: 'category', loadComponent: () => import('./pages/news-category/news-category.component').then(m => m.NewsCategoryComponent)},
      {path: 'category/:slug', loadComponent: () => import('./pages/news-category/news-category.component').then(m => m.NewsCategoryComponent)},
      {path: 'search', loadComponent: () => import('./pages/news-search/news-search.component').then(m => m.NewsSearchComponent)},
      {path: 'search/:query', loadComponent: () => import('./pages/news-search/news-search.component').then(m => m.NewsSearchComponent)},
      {path: 'news', loadComponent: () => import('./pages/news-content/news-content.component').then(m => m.NewsContentComponent)},
      {path: 'videos', loadComponent: () => import('./pages/videos/videos.component').then(m => m.VideosComponent)},
      {path: 'news/:slug', loadComponent: () => import('./pages/news-content/news-content.component').then(m => m.NewsContentComponent)},
    ],

  }
];
