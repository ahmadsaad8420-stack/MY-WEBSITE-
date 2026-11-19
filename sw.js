/* Kill-switch service worker: removes the old caching worker and all its caches from visitors' browsers.
   Keep this file deployed for a few weeks, then it can be deleted. */
'use strict';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
  })());
});
