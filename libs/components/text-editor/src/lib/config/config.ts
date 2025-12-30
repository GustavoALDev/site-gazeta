import { InjectionToken } from '@angular/core';

  export interface TextEditorConfig {
  apiUrl: string;
}

export const TEXT_EDITOR_CONFIG = new InjectionToken<TextEditorConfig>('TEXT_EDITOR_CONFIG');

export function provideTextEditorConfig(config: TextEditorConfig) {
  return { provide: TEXT_EDITOR_CONFIG, useValue: config };
}
