import { InjectionToken } from '@angular/core';

  export interface RelatedNewsConfig {
  apiUrl: string;
}

export const RELATED_NEWS_CONFIG = new InjectionToken<RelatedNewsConfig>('RELATED_NEWS_CONFIG');

export function provideRelatedNewsConfig(config: RelatedNewsConfig) {
  return { provide: RELATED_NEWS_CONFIG, useValue: config };
}
