
const CACHE_NAME = 'universal-finance-v3'

self.addEventListener('install', (event) => {
  console.log('✅ Service Worker installing...')
  // Skip waiting to activate immediately
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Take control of all clients immediately
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip requests with query parameters (like our URL state management)
  const url = new URL(event.request.url)
  if (url.search) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses
            if (response && response.status === 200 && response.type === 'basic') {
              // Clone the response before caching
              const responseToCache = response.clone()

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache)
                })
                .catch((error) => {
                  console.log('Cache put failed:', error)
                })
            }

            return response
          })
          .catch((error) => {
            console.log('Network fetch failed:', error)

            // For navigation requests, try to return cached index
            if (event.request.mode === 'navigate') {
              return caches.match('/').then((cachedIndex) => {
                if (cachedIndex) {
                  return cachedIndex
                }
                // If no cached index, return a simple offline page
                return new Response(
                  '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
                  { headers: { 'Content-Type': 'text/html' } }
                )
              })
            }

            // For other requests, just let them fail gracefully
            throw error
          })
      })
  )
})
