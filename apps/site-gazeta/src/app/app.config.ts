import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideVideosConfig } from '@site-gazeta/video-player';
import { environment } from './core/env/env';
import { provideCarouselConfig } from 'libs/components/carousel/src/lib/config/config';
import { provideHomeComponentsConfig } from 'libs/components/home-components/src/lib/config/config';
import { provideRelatedNewsConfig } from 'libs/components/related-news/src/lib/related-news/config/config';
import { provideVideoComponentsConfig } from 'libs/components/video-components/src/lib/config/config';
import { newsIdsInterceptor } from './core/interceptor/news-ids.interceptor';
import { excludeNewsInterceptor } from './core/interceptor/exclude-news.interceptor';
import { provideMoreNewsConfig } from 'libs/components/more-news/src/lib/config/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    provideHttpClient(
      withInterceptors([
        excludeNewsInterceptor,  // 1º: Adiciona IDs excluídos nas requisições
        newsIdsInterceptor       // 2º: Captura IDs das respostas
      ]),
      withFetch()
    ),
    provideVideosConfig({
      apiUrl: environment.apiUrl
    }),
    provideCarouselConfig({
      apiUrl: environment.apiUrl
    }),
    provideHomeComponentsConfig({
      apiUrl: environment.apiUrl
    }),
    provideRelatedNewsConfig({
      apiUrl: environment.apiUrl
    }),
    provideVideoComponentsConfig({
      apiUrl: environment.apiUrl
    }),
    provideMoreNewsConfig({
      apiUrl: environment.apiUrl
    }),
  ],
};
