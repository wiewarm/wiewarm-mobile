import type { ApplicationConfig } from '@angular/core';
import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { reloadOnVersionMismatch } from './shared/util/version-mismatch.util';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Reload stale clients when lazy route chunks from an old deployment are gone.
    provideRouter(routes, withNavigationErrorHandler(reloadOnVersionMismatch)),
    provideHttpClient(),
    provideAnimations(),
  ],
};
