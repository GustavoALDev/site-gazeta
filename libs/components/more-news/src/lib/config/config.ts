import { InjectionToken } from '@angular/core';

  export interface MoreNewsConfig {
  apiUrl: string;
}

export const MORE_NEWS_CONFIG = new InjectionToken<MoreNewsConfig>('MORE_NEWS_CONFIG');

export function provideMoreNewsConfig(config: MoreNewsConfig) {
  return { provide: MORE_NEWS_CONFIG, useValue: config };
}
