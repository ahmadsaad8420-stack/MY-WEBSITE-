/* Saad Sheikh portfolio service worker. Versioned cache prevents stale deployments. */
'use strict';
const CACHE = 'saad-portfolio-pro-v18';
const CORE = [
  './', './404.html',
  'index.html', 'about.html', 'contact.html', 'privacy-policy.html', 'terms.html', 'thanks.html',
  'css/style.css',
  'css/icons.css?v=icons-v18',
  'css/pages.css',
  'js/boot.js',
  'js/projects.js',
  'js/script.js',
  'js/pages.js',
  'favicon.svg', 'manifest.json', 'robots.txt', 'sitemap.xml',
  'assets/fonts/inter-400.woff2', 'assets/fonts/inter-500.woff2',
  'assets/fonts/inter-600.woff2', 'assets/fonts/inter-700.woff2',
  'assets/fonts/inter-800.woff2', 'assets/images/hero-cutout-480.png',
  'assets/images/hero-cutout-720.png', 'assets/images/hero-cutout.png',
  'assets/images/about-480.webp',
  'assets/images/about-720.webp', 'assets/images/og-image.jpg',
  'assets/icons/facebook-messenger.svg',
  'assets/images/projects/live-calculator.png',
  'assets/images/projects/live-portfolio.png',
  'assets/images/projects/weather-live-preview.png',
  'assets/images/projects/qr-studio.svg',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
const cacheResponse = async (request, response) => {
  if (response && response.status === 200 && response.type === 'basic') {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
};
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/.well-known/')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => cacheResponse(request, response)).catch(async () => {
      const cleanPath = url.pathname.replace(/\/$/, '');
      const htmlPath = cleanPath && !cleanPath.endsWith('.html') ? `${cleanPath}.html` : cleanPath;
      const cached = await caches.match(request) || (htmlPath ? await caches.match(new URL(htmlPath, self.location.origin).href) : null);
      return cached || await caches.match('./') || Response.error();
    }));
    return;
  }
  if (url.pathname.includes('/assets/') && !url.pathname.includes('/assets/cv/')) {
    event.respondWith(caches.match(request).then(async cached => {
      const update = fetch(request).then(response => cacheResponse(request, response)).catch(() => cached || Response.error());
      if (cached) { event.waitUntil(update); return cached; }
      return update;
    }));
    return;
  }
  event.respondWith(fetch(request).then(response => cacheResponse(request, response)).catch(async () => await caches.match(request) || Response.error()));
});
