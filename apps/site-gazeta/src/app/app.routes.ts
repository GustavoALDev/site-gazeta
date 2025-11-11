import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewsContentComponent } from './pages/news-content/news-content.component';
import { NewsCategoryComponent } from './pages/news-category/news-category.component';
import { HomeComponentsComponent } from './pages/home-components/home-components.component';
import { NewsSearchComponent } from './pages/news-search/news-search.component';
export const appRoutes: Route[] = [
    {path: '', component: HomeComponent, children:[
        {path: '', component: HomeComponentsComponent},
        {path: 'category', component: NewsCategoryComponent},
        {path: 'category/:slug', component: NewsCategoryComponent},
        {path: 'search', component: NewsSearchComponent},
        {path: 'search/:query', component: NewsSearchComponent},
        {path: 'news', component: NewsContentComponent},
        {path: 'news/:slug', component: NewsContentComponent},
    ]},
];
