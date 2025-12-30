import { InjectionToken } from '@angular/core';

  export interface CarouselConfig {
  apiUrl: string;
}

export const CAROUSEL_CONFIG = new InjectionToken<CarouselConfig>('CAROUSEL_CONFIG');

export function provideCarouselConfig(config: CarouselConfig) {
  return { provide: CAROUSEL_CONFIG, useValue: config };
}
