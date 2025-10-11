import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewsContentComponent } from './pages/news-content/news-content.component';
import { NewsCategoryComponent } from './pages/news-category/news-category.component';
export const appRoutes: Route[] = [
    {path: '', component: HomeComponent},
    {path: 'news', component: NewsContentComponent},
    {path: 'news/:slug', component: NewsContentComponent},
    {path: 'category', component: NewsCategoryComponent},
    {path: 'category/:slug', component: NewsCategoryComponent},
];
