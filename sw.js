// Get rid of the Workbox service worker, because there is no actual
// need in it.

const CACHE_NAME = 'workbox-precache-v2-https://kotwys.github.io/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.delete(CACHE_NAME)
  );
});

self.addEventListener('activate', async (event) => {
  await self.registration.unregister();
  for (const client of await self.clients.matchAll()) {
    if (client.url && 'navigate' in client)
      client.navigate(client.url);
  }
});