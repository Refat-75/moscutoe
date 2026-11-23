// Service worker: app er file gulo cache kore rakhe, tai ekbar khulle porer bar offline e o kholte pare.
const CACHE = 'moscutoe-v5';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'data.js', 'img/icon-192.png', 'img/icon-512.png', 'img/refat.jpg', 'img/rijonty.jpg', 'img/shaon.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin) || /\.mp4(\?|$)/.test(e.request.url) || e.request.headers.has('range')) return;
  e.respondWith(fetch(e.request).then(r => {              // age internet, na thakle cache
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
});
