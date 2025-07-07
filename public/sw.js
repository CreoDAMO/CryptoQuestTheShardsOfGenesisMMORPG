const CACHE_NAME = 'cryptoquest-v2.0.0';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API calls and external resources
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('http') && !event.request.url.includes(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }

        console.log('Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page or default response
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'ai-decisions') {
    event.waitUntil(syncAIDecisions());
  }
  
  if (event.tag === 'arbitrage-data') {
    event.waitUntil(syncArbitrageData());
  }
});

// Push notifications for AI alerts
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'CryptoQuest AI system alert',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'cryptoquest-alert',
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CryptoQuest AI Alert', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/?view=ai')
    );
  }
});

// Sync functions
async function syncAIDecisions() {
  try {
    // Sync pending AI decisions when back online
    const pendingDecisions = await getStoredDecisions();
    for (const decision of pendingDecisions) {
      await submitDecision(decision);
    }
    await clearStoredDecisions();
    console.log('AI decisions synced successfully');
  } catch (error) {
    console.error('Failed to sync AI decisions:', error);
  }
}

async function syncArbitrageData() {
  try {
    // Sync arbitrage opportunities when back online
    const response = await fetch('/api/arbitrage/sync');
    if (response.ok) {
      console.log('Arbitrage data synced successfully');
    }
  } catch (error) {
    console.error('Failed to sync arbitrage data:', error);
  }
}

// IndexedDB helpers for offline storage
async function getStoredDecisions() {
  // Implementation for getting stored decisions from IndexedDB
  return [];
}

async function submitDecision(decision) {
  // Implementation for submitting decisions to server
  const response = await fetch('/api/ai/decisions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(decision)
  });
  return response.ok;
}

async function clearStoredDecisions() {
  // Implementation for clearing stored decisions from IndexedDB
}