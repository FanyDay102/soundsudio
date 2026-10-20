/* =========================================================
   Service Worker - 离线播放核心
   ========================================================= */

const AUDIO_CACHE = 'mp3-audio-v1';
const ASSET_CACHE = 'mp3-html-v1';

/* ---------- 安装 ---------- */
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 立即激活，不等旧 SW 关闭
  event.waitUntil((async () => {
    // 尝试预缓存当前页面（首次可能失败，忽略）
    try {
      const cache = await caches.open(ASSET_CACHE);
      await cache.addAll(['./', './index.html']);
    } catch (e) {
      // 忽略：离线首次安装时可能没有网络
    }
  })());
});

/* ---------- 激活 ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 清理旧版本缓存（防止版本升级后占空间）
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k !== AUDIO_CACHE && k !== ASSET_CACHE)
        .map(k => caches.delete(k))
    );
    // 立即接管所有页面
    await self.clients.claim();
  })());
});

/* ---------- 拦截请求 ---------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // 音频请求：cache-first
  if (isAudioRequest(req)) {
    event.respondWith(handleAudio(req));
    return;
  }

  // 同源 HTML/JS/CSS 等：network-first（有网用最新，没网用缓存）
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    event.respondWith(handleAsset(req));
    return;
  }

  // 跨域（封面图、歌词 API 等）：默认不拦截，走网络
});

/* ---------- 判定音频请求 ---------- */
function isAudioRequest(req) {
  try {
    const url = new URL(req.url);
    const path = url.pathname.toLowerCase();
    if (req.destination === 'audio') return true;
    return /\.(mp3|m4a|wav|flac|ogg|aac|opus)$/.test(path);
  } catch (e) {
    return false;
  }
}

/* ---------- 音频处理：cache-first + Range 支持 ---------- */
async function handleAudio(req) {
  const cache = await caches.open(AUDIO_CACHE);

  // 用 ignoreSearch 保证查询参数不影响匹配
  const cached = await cache.match(req.url, { ignoreSearch: true });

  if (cached) {
    // 处理 Range 请求（音频 seek 必需）
    const rangeHeader = req.headers.get('range');
    if (rangeHeader) {
      try {
        const cachedForBlob = cached.clone();
        const blob = await cachedForBlob.blob();
        const total = blob.size;
        const parts = rangeHeader.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10) || 0;
        const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
        const safeEnd = Math.min(end, total - 1);
        const chunk = blob.slice(start, safeEnd + 1);

        return new Response(chunk, {
          status: 206,
          statusText: 'Partial Content',
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Range': `bytes ${start}-${safeEnd}/${total}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': String(chunk.size)
          }
        });
      } catch (e) {
        // Range 处理失败，退回完整响应
        return cached;
      }
    }
    return cached;
  }

  // 未缓存：走网络
  try {
    const resp = await fetch(req);
    return resp;
  } catch (err) {
    // 离线且未缓存
    return new Response('Offline - not cached', {
      status: 503,
      statusText: 'Not Cached',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

/* ---------- 同源资源：network-first ---------- */
async function handleAsset(req) {
  const cache = await caches.open(ASSET_CACHE);
  try {
    const resp = await fetch(req);
    // 只缓存成功响应
    if (resp && resp.status === 200 && resp.type === 'basic') {
      cache.put(req, resp.clone()).catch(() => {});
    }
    return resp;
  } catch (err) {
    // 网络失败：从缓存找
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    // 兜底：给一个简单的离线提示（HTML 请求失败时）
    if (req.destination === 'document' || (req.headers.get('accept') || '').includes('text/html')) {
      const fallback = await cache.match('./', { ignoreSearch: true }) || await cache.match('./index.html', { ignoreSearch: true });
      if (fallback) return fallback;
    }
    throw err;
  }
}

/* ---------- 消息通道（可选：页面主动通知清理） ---------- */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
