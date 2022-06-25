import { InjectionToken } from '@angular/core';
import { UiOverlayData } from './ui-overlay.config';

export const UI_OVERLAY_DATA = new InjectionToken<UiOverlayData>(
  'UI_OVERLAY_DATA'
);
