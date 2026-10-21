const SHELL_CACHE = 'app-shell-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then(c => c.addAll(['./', './index.html']).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k !== SHELL_CACHE).map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// 只对 HTML 文档请求做 network-first 兜底，音频完全不拦
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.mode !== 'navigate' && req.destination !== 'document') return;

  event.respondWith((async () => {
    try {
      return await fetch(req);
    } catch {
      const cached = await caches.match(req, { ignoreSearch: true })
        || await caches.match('./', { ignoreSearch: true })
        || await caches.match('./index.html', { ignoreSearch: true });
      return cached || new Response('Offline', { status: 503 });
    }
  })());
});
