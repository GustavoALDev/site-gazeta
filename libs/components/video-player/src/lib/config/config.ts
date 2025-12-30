import { InjectionToken } from '@angular/core';

export interface VideosConfig {
  apiUrl: string;
}

export const VIDEOS_CONFIG = new InjectionToken<VideosConfig>('VIDEOS_CONFIG');

export function provideVideosConfig(config: VideosConfig) {
  return { provide: VIDEOS_CONFIG, useValue: config };
}
