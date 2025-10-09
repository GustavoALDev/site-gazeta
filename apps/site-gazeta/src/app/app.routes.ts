import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewsContentComponent } from './pages/news-content/news-content.component';
export const appRoutes: Route[] = [
    {path: '', component: HomeComponent},
    {path: 'noticia', component: NewsContentComponent},
];
