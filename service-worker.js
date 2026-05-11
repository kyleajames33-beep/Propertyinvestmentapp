// ============================================
// SERVICE WORKER - Property Investment App
// Version: 1.0.0
// ============================================

const CACHE_VERSION = 'property-investment-v1.0.1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Files to cache immediately on install
const STATIC_FILES = [
  './',
  './index.html',
  './manifest.json',
  './privacy.html',
  './terms.html',
  './css/main.css',
  './css/components.css',
  './css/stages.css',
  './js/utils.js',
  './js/app.js',
  './js/stages/stage1.js',
  './js/stages/stage2.js',
  './js/stages/stage3.js',
  './js/stages/stage4.js',
  './js/stages/stage5.js',
  './js/stages/stage6.js',
  // Icon files (will be cached once generated)
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// ============================================
// INSTALL EVENT - Cache static assets
// ============================================
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing version:', CACHE_VERSION);

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Service Worker] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// ============================================
// ACTIVATE EVENT - Clean up old caches
// ============================================
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating version:', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Delete old versions
              return cacheName.startsWith('property-investment-v') &&
                     cacheName !== STATIC_CACHE &&
                     cacheName !== DYNAMIC_CACHE;
            })
            .map(cacheName => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// ============================================
// FETCH EVENT - Network-first, fallback to cache
// ============================================
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(request)
      .then(response => {
        // Clone the response (can only be consumed once)
        const responseClone = response.clone();

        // Cache successful responses (excluding opaque responses)
        if (response.status === 200 && response.type !== 'opaque') {
          caches.open(DYNAMIC_CACHE)
            .then(cache => {
              cache.put(request, responseClone);
            })
            .catch(error => {
              console.warn('[Service Worker] Cache put failed:', error);
            });
        }

        return response;
      })
      .catch(error => {
        console.log('[Service Worker] Fetch failed, trying cache:', request.url);

        // Network failed, try cache
        return caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              console.log('[Service Worker] Serving from cache:', request.url);
              return cachedResponse;
            }

            // Not in cache either - return offline page or error
            console.error('[Service Worker] No cache match for:', request.url);

            // For navigation requests, return the main page from cache
            if (request.mode === 'navigate') {
              return caches.match('./index.html');
            }

            // For other requests, reject
            return Promise.reject(error);
          });
      })
  );
});

// ============================================
// MESSAGE EVENT - Handle messages from client
// ============================================
self.addEventListener('message', event => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Clear all caches (useful for development/testing)
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

// ============================================
// BACKGROUND SYNC (Future enhancement)
// ============================================
// self.addEventListener('sync', event => {
//   if (event.tag === 'sync-suburbs') {
//     event.waitUntil(syncSuburbData());
//   }
// });

console.log('[Service Worker] Loaded version:', CACHE_VERSION);
