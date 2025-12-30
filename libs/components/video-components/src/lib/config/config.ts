import { InjectionToken } from '@angular/core';

  export interface VideoComponentsConfig {
  apiUrl: string;
}

export const VIDEO_COMPONENTS_CONFIG = new InjectionToken<VideoComponentsConfig>('VIDEO_COMPONENTS_CONFIG');

export function provideVideoComponentsConfig(config: VideoComponentsConfig) {
  return { provide: VIDEO_COMPONENTS_CONFIG, useValue: config };
}
