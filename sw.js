// Small offline cache. Bump CACHE (and ?v=N in every HTML file) when you change core files.
const CACHE = "saad-portfolio-v16";
// Must load for the service worker to install.
const CORE = ["./", "index.html", "css/style.css?v=8", "css/icons.css?v=7", "js/boot.js?v=7", "js/projects.js?v=7", "js/script.js?v=9", "favicon.svg", "assets/fonts/inter-400.woff", "assets/images/profile.webp", "assets/images/loader-photo.webp"];
// Nice to have offline; a failure here never blocks installation.
const EXTRA = ["about.html", "contact.html", "privacy-policy.html", "terms.html", "css/pages.css?v=7", "assets/fonts/inter-700.woff", "assets/fonts/inter-800.woff"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(CORE);
    await Promise.allSettled(EXTRA.map(u => c.add(u)));
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Only complete, successful, same-origin responses are cached (never 206 partials or redirects).
const store = (req, res) => {
  if (res && res.status === 200 && res.type === "basic") {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy)).catch(() => { /* cache full or unavailable */ });
  }
  return res;
};

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  // Only same-origin GETs (never the contact form POST or the GitHub API).
  if (req.method !== "GET" || url.origin !== location.origin) return;
  // Never cache security.txt or anything outside the site itself.
  if (url.pathname.startsWith("/.well-known/")) return;
  // Images, fonts, icons: serve the cached copy instantly, then refresh it in the background
  // (stale-while-revalidate) so a replaced image reaches visitors on their next visit.
  // The CV is excluded so a replaced PDF is never served stale.
  if (url.pathname.includes("/assets/") && !url.pathname.includes("/assets/cv/")) {
    e.respondWith(caches.match(req).then(hit => {
      const fresh = fetch(req).then(res => store(req, res)).catch(() => hit || Response.error());
      if (hit) { e.waitUntil(fresh); return hit; }
      return fresh;
    }));
    return;
  }
  // Pages, CSS, JS: network first so visitors always get the latest; cached copy only when offline.
  e.respondWith(fetch(req).then(res => store(req, res)).catch(() => caches.match(req).then(r => r || (req.mode === "navigate" ? caches.match("index.html") : Response.error()))));
});
