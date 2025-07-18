
const CACHE_NAME = 'universal-finance-v1'
const urlsToCache = [
  '/',
  '/src/App.jsx',
  '/src/App.css',
  '/src/calculators/SIPCalculator.jsx',
  '/src/calculators/EMICalculator.jsx',
  '/src/calculators/FDCalculator.jsx',
  '/src/calculators/TaxCalculator.jsx',
  '/src/calculators/CAGRCalculator.jsx',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
