// Registers the service worker (public/sw.js) that keeps the app shell
// available offline. Only in the production build: during development it would
// serve stale files.
export function registerServiceWorker({ isProduction = import.meta.env.PROD, nav = globalThis.navigator, win = globalThis.window } = {}) {
  if (!isProduction || !nav || !('serviceWorker' in nav) || !win) return false;
  win.addEventListener('load', () => {
    nav.serviceWorker.register('/sw.js').catch(error => console.warn('GetFit!: offline support is not available.', error));
  });
  return true;
}
