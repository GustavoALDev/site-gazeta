import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/auth.interceptor';
import { registerLocaleData, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// Registrar os dados de localização para pt-br
registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'America/Sao_Paulo' } },
  ],
};