const VERSION = '0e4b7e54bee93255';
const SHELL = 'closet-shell-' + VERSION;
const RUNTIME = 'closet-runtime-' + VERSION;
const FILES = ["./","assets/index-BbjRd4dV.css","assets/index-CX6bDs1-.js","assets/ort.wasm.min-CwiIJ_a1.mjs","assets/ort.wasm.min-DbSP1Vwu.js","assets/removal-worker-DP2OzTcB.js","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","index.html","licenses/IMG-LY-AGPL-3.0.md","licenses/NOTICE.txt","licenses/ONNX-Runtime-MIT.txt","manifest.webmanifest"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(FILES.map(file => new URL(file, self.registration.scope).href))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('closet-') && key !== SHELL && key !== RUNTIME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(RUNTIME).then(cache => cache.put(event.request, copy)));
      }
      return response;
    } catch (error) {
      if (event.request.mode === 'navigate') return (await caches.match(new URL('index.html', self.registration.scope).href)) || Response.error();
      return Response.error();
    }
  })());
});
