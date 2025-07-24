
// FinClamp Service Worker for Performance Optimization and Offline Support
const CACHE_NAME = 'finclamp-v1.0.0'
const STATIC_CACHE = 'finclamp-static-v1.0.0'
const DYNAMIC_CACHE = 'finclamp-dynamic-v1.0.0'
const API_CACHE = 'finclamp-api-v1.0.0'
const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
]

// Calculator routes to cache
const CALCULATOR_ROUTES = [
  '/?calculator=emi',
  '/?calculator=sip',
  '/?calculator=income-tax',
  '/?calculator=fd',
  '/?calculator=ppf',
  '/?calculator=mortgage',
  '/?calculator=personal-loan',
  '/?calculator=rd',
  '/?calculator=cagr',
  '/?calculator=swp',
  '/?calculator=capital-gains',
  '/?calculator=nps',
  '/?calculator=epf',
  '/?calculator=gratuity',
  '/?calculator=budget-planner',
  '/?calculator=savings-goal',
  '/?calculator=stock-average',
  '/?calculator=net-worth',
  '/?calculator=bill-split',
  '/?calculator=tip-calculator',
  '/?calculator=subscription-tracker',
  '/?calculator=daily-interest',
  '/?calculator=monthly-expense',
  '/?calculator=upi-spending',
  '/?calculator=grocery-budget',
  '/?calculator=commute-cost',

  '/?calculator=wfh-savings',
  '/?calculator=habit-cost',
  '/?calculator=freelancer-tax',
  '/?calculator=discount',
  '/?calculator=fuel-cost',
  '/?calculator=compound-interest',
  '/?calculator=simple-interest',
  '/?calculator=inflation'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('✅ Service Worker: Installing...')

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.log('⚠️ Failed to cache some static assets:', err)
        })
      }),

      // Cache calculator routes in production
      !isDevelopment ? caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('🧮 Service Worker: Caching calculator routes')
        return cache.addAll(CALCULATOR_ROUTES).catch(err => {
          console.log('⚠️ Failed to cache some calculator routes:', err)
        })
      }) : Promise.resolve()
    ]).then(() => {
      console.log('✅ Service Worker: Installation complete')
      self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activating...')

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE &&
              cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('✅ Service Worker: Activation complete')
      return self.clients.claim()
    })
  )
})

// Fetch event - implement advanced caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Only handle same-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip development server files
  if (isDevelopment && (
    url.pathname.includes('/@') ||
    url.pathname.includes('/src/') ||
    url.pathname.includes('/node_modules/') ||
    url.pathname.includes('/__vite') ||
    url.pathname.endsWith('.jsx') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx')
  )) {
    return
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (isCalculatorRoute(request)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request, API_CACHE))
  } else if (isImageRequest(request)) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE))
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  }
})

// Caching Strategies

// Cache First - for static assets that rarely change
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      // Update cache in background
      updateCacheInBackground(request, cache)
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('Cache First strategy failed:', error)
    return new Response('Offline - Resource not available', { status: 503 })
  }
}

// Network First - for API requests and dynamic content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)

    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return new Response(
        '<!DOCTYPE html><html><head><title>Offline - FinClamp</title><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;text-align:center;padding:2rem;background:#f8fafc}h1{color:#1e293b;margin-bottom:1rem}p{color:#64748b;margin-bottom:2rem}.btn{background:#3b82f6;color:white;padding:0.75rem 1.5rem;border:none;border-radius:0.5rem;cursor:pointer;text-decoration:none;display:inline-block}.btn:hover{background:#2563eb}</style></head><body><h1>You are offline</h1><p>FinClamp calculators are available offline. Please check your internet connection for the latest features.</p><a href="/" class="btn">Go to Calculators</a></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      )
    }

    return new Response('Offline - No cached version available', { status: 503 })
  }
}

// Stale While Revalidate - for calculator pages
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    return cachedResponse
  })

  return cachedResponse || fetchPromise
}

// Background cache update
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
  } catch (error) {
    console.log('Background cache update failed:', error)
  }
}

// Helper functions to identify request types
function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.match(/\.(css|js|woff2?|ttf|eot|ico|svg|png|jpg|jpeg|webp)$/)
}

function isCalculatorRoute(request) {
  const url = new URL(request.url)
  return url.search.includes('calculator=') || CALCULATOR_ROUTES.includes(url.pathname + url.search)
}

function isAPIRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/api/')
}

function isImageRequest(request) {
  const url = new URL(request.url)
  return url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg)$/)
}

console.log('✅ FinClamp Service Worker loaded successfully')
