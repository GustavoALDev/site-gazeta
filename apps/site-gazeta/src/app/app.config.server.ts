import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { newsIdsInterceptor } from './core/interceptor/news-ids.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([newsIdsInterceptor])
    ),
    provideServerRendering(withRoutes(serverRoutes))
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
