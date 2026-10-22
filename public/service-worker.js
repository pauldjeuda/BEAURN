const CACHE_NAME = 'beaurn-app-v2'
const APP_ROOT = new URL('./', self.registration.scope)
const APP_IMAGES = [
  'coach-aisha.webp', 'coach-aurelie.webp', 'coach-carla.webp', 'coach-hilarion.webp',
  'community-duo.webp', 'group-meditation.webp', 'mat-bottle.webp', 'pilates-boat.webp',
  'pilates-flow.webp', 'pilates-rest.webp', 'pilates-side.webp', 'pilates-split.webp',
  'studio-corner.webp', 'studio-mats.webp', 'studio-rollers.webp', 'yoga-meditation.webp',
].map((image) => new URL(`images/${image}`, APP_ROOT).href)
const APP_SHELL = [
  APP_ROOT.href,
  new URL('manifest.webmanifest', APP_ROOT).href,
  new URL('icons/icon-192.png', APP_ROOT).href,
  new URL('icons/icon-512.png', APP_ROOT).href,
  new URL('icons/icon-maskable-512.png', APP_ROOT).href,
  new URL('icons/apple-touch-icon.png', APP_ROOT).href,
  new URL('icons/favicon-32.png', APP_ROOT).href,
  ...APP_IMAGES,
]

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    const pageResponse = await fetch(APP_ROOT.href)
    if (!pageResponse.ok) throw new Error(`Impossible de précacher la page Beaurn (${pageResponse.status}).`)
    const pageHtml = await pageResponse.clone().text()
    await cache.put(APP_ROOT.href, pageResponse)

    const appBase = new URL(self.registration.scope)
    const builtAssets = [...pageHtml.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
      .map((match) => new URL(match[1], APP_ROOT))
      .filter((url) => url.origin === appBase.origin && url.pathname.startsWith(new URL('assets/', APP_ROOT).pathname))
      .map((url) => url.href)

    await cache.addAll([...APP_SHELL.filter((url) => url !== APP_ROOT.href), ...builtAssets])
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('beaurn-app-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  const scope = new URL(self.registration.scope)
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(APP_ROOT.href, response.clone())
          return response
        }
        if (response.status === 404) return (await caches.match(APP_ROOT.href)) || response
        return response
      } catch {
        return (await caches.match(APP_ROOT.href)) || Response.error()
      }
    })())
    return
  }

  const runtimeAssets = ['assets/', 'images/', 'icons/']
  const shouldCache = runtimeAssets.some((folder) => url.pathname.startsWith(new URL(folder, APP_ROOT).pathname)) || url.href === new URL('manifest.webmanifest', APP_ROOT).href
  if (!shouldCache) return

  event.respondWith((async () => {
    const cached = await caches.match(request)
    if (cached) return cached
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      await cache.put(request, response.clone())
    }
    return response
  })())
})
