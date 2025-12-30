import { InjectionToken } from '@angular/core';

  export interface HomeComponentsConfig {
  apiUrl: string;
}

export const HOMECOMPONENTS_CONFIG = new InjectionToken<HomeComponentsConfig>('HOMECOMPONENTS_CONFIG');

export function provideHomeComponentsConfig(config: HomeComponentsConfig) {
  return { provide: HOMECOMPONENTS_CONFIG, useValue: config };
}
