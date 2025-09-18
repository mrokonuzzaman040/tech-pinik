// Service Worker for Tech Pinik PWA
const CACHE_NAME = 'tech-pinik-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/products',
  '/cart',
  '/checkout',
  '/_next/static/css/',
  '/_next/static/js/',
  '/logo.png',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then(function(cache) {
        return fetch(request)
          .then(function(response) {
            // Cache successful GET requests
            if (request.method === 'GET' && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(function() {
            // Return cached version if network fails
            return cache.match(request);
          });
      })
    );
    return;
  }

  // Handle static assets
  if (
    request.destination === 'image' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.startsWith('/_next/')
  ) {
    event.respondWith(
      caches.match(request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(request).then(function(response) {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then(function(cache) {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(function() {
        return caches.match('/');
      })
    );
    return;
  }

  // Default: try network first, fallback to cache
  event.respondWith(
    fetch(request).catch(function() {
      return caches.match(request);
    })
  );
});