import type { NavigationError } from '@angular/router';

const VERSION_RELOAD_KEY = 'wiewarm.version-reload-at';
const VERSION_RELOAD_COOLDOWN_MS = 30_000;

/**
 * Checks if the error comes from failed loading of JS-Chunks
 */
function isChunkLoadError(error: any): boolean {
  if (error?.name === 'ChunkLoadError' || error?.type === 'missing') {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();

  return [
    'failed to fetch dynamically imported module',
    'error loading dynamically imported module',
    'importing a module script failed',
    'loading chunk',
    'chunkloaderror',
  ].some((term) => lowerMessage.includes(term));
}

export function reloadOnVersionMismatch(error: NavigationError): void {
  if (!isChunkLoadError(error.error)) {
    return;
  }

  const now = Date.now();
  const lastReloadStr = window.sessionStorage.getItem(VERSION_RELOAD_KEY);
  const lastReloadAt = lastReloadStr ? Number(lastReloadStr) : 0;

  // Protection for reload loops
  if (now - lastReloadAt < VERSION_RELOAD_COOLDOWN_MS) {
    console.error(
      'ChunkLoadError persists after reload. Stopping to prevent loop.',
    );
    return;
  }

  window.sessionStorage.setItem(VERSION_RELOAD_KEY, String(now));

  window.location.assign(error.url);
}
