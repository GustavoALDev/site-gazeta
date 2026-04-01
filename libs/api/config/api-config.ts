import { InjectionToken } from '@angular/core';

export interface LibraryConfig {
  apiUrl: string;
}

export const LIBRARY_CONFIG = new InjectionToken<LibraryConfig>('LIBRARY_CONFIG');

export function provideLibraryConfig(config: LibraryConfig) {
  return { provide: LIBRARY_CONFIG, useValue: config };
}
