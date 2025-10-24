/**
 * Service Worker for RentHub PWA
 * Implements caching strategies for offline support and performance
 */

const CACHE_VERSION = 'renthub-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Files to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/offline.html', // Fallback offline page
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 100;
const MAX_API_CACHE_SIZE = 30;

// Cache expiration times (in seconds)
const API_CACHE_EXPIRATION = 5 * 60; // 5 minutes
const IMAGE_CACHE_EXPIRATION = 24 * 60 * 60; // 24 hours

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old version caches
              return cacheName.startsWith('renthub-') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== IMAGE_CACHE && cacheName !== API_CACHE;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim(); // Take control of all pages
      })
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other origins
  if (!url.origin.includes(self.location.origin) && !url.origin.includes('fonts.googleapis.com') && !url.origin.includes('fonts.gstatic.com')) {
    return;
  }

  // Route to appropriate caching strategy
  if (isImageRequest(request)) {
    event.respondWith(cacheFirstWithExpiration(request, IMAGE_CACHE, IMAGE_CACHE_EXPIRATION, MAX_IMAGE_CACHE_SIZE));
  } else if (isApiRequest(request)) {
    event.respondWith(networkFirstWithTimeout(request, API_CACHE, API_CACHE_EXPIRATION, MAX_API_CACHE_SIZE));
  } else if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else {
    event.respondWith(networkFirstWithTimeout(request, DYNAMIC_CACHE, null, MAX_DYNAMIC_CACHE_SIZE));
  }
});

/**
 * Cache First Strategy (with expiration)
 * Good for: Images, fonts, static assets
 */
async function cacheFirstWithExpiration(request, cacheName, expirationTime, maxSize) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      // Check if cache is expired
      const cachedTime = await getCachedTime(request, cacheName);
      if (cachedTime && (Date.now() - cachedTime) / 1000 < expirationTime) {
        return cached;
      }
    }

    // Fetch from network
    const response = await fetch(request);
    
    if (response.ok) {
      // Clone response and cache it
      const clonedResponse = response.clone();
      cache.put(request, clonedResponse);
      await setCachedTime(request, cacheName, Date.now());
      await limitCacheSize(cacheName, maxSize);
    }

    return response;
  } catch (error) {
    // Return cached version even if expired
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Return offline fallback for images
    if (isImageRequest(request)) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#f0f0f0" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Image Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }

    throw error;
  }
}

/**
 * Network First Strategy (with timeout and cache fallback)
 * Good for: API calls, dynamic content
 */
async function networkFirstWithTimeout(request, cacheName, expirationTime, maxSize, timeout = 3000) {
  try {
    const cache = await caches.open(cacheName);
    
    // Race between fetch with timeout and cached response
    const networkPromise = fetch(request).then((response) => {
      if (response.ok) {
        const clonedResponse = response.clone();
        cache.put(request, clonedResponse);
        if (expirationTime) {
          setCachedTime(request, cacheName, Date.now());
        }
        limitCacheSize(cacheName, maxSize);
      }
      return response;
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), timeout);
    });

    return await Promise.race([networkPromise, timeoutPromise]);
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('[SW] Network failed, serving from cache:', request.url);
      return cached;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }

    throw error;
  }
}

/**
 * Cache First Strategy (no expiration)
 * Good for: Static assets that rarely change
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  
  if (response.ok) {
    cache.put(request, response.clone());
  }

  return response;
}

/**
 * Helper: Check if request is for an image
 */
function isImageRequest(request) {
  return request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(new URL(request.url).pathname);
}

/**
 * Helper: Check if request is an API call
 */
function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || url.pathname.includes('/api/');
}

/**
 * Helper: Check if request is for a static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(js|css|woff|woff2|ttf|eot)$/i.test(url.pathname) || 
         url.origin.includes('fonts.googleapis.com') || 
         url.origin.includes('fonts.gstatic.com');
}

/**
 * Helper: Limit cache size by removing oldest entries
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxSize) {
    // Delete oldest entries (FIFO)
    const toDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
  }
}

/**
 * Helper: Get cached time for a request
 */
async function getCachedTime(request, cacheName) {
  const timeCache = await caches.open(`${cacheName}-times`);
  const timeResponse = await timeCache.match(request.url);
  
  if (timeResponse) {
    const time = await timeResponse.text();
    return parseInt(time, 10);
  }
  
  return null;
}

/**
 * Helper: Set cached time for a request
 */
async function setCachedTime(request, cacheName, time) {
  const timeCache = await caches.open(`${cacheName}-times`);
  await timeCache.put(request.url, new Response(time.toString()));
}

/**
 * Background sync for failed requests
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-failed-requests') {
    event.waitUntil(syncFailedRequests());
  }
});

/**
 * Sync failed requests when back online
 */
async function syncFailedRequests() {
  // Implement logic to retry failed API requests
  console.log('[SW] Syncing failed requests...');
  // This would typically work with IndexedDB to store failed requests
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'RentHub Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();

  // Open app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          const url = event.notification.data?.url || '/';
          return clients.openWindow(url);
        }
      })
  );
});

/**
 * Message handler for communication with main app
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
