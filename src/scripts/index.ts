import { track } from './statistics';

document.querySelectorAll('.init').forEach(el => {
  el.classList.remove('init');
});

import('./header').then(({ stickyHeader, drawer }) => {
  const header = document.querySelector('.header') as HTMLElement;
  stickyHeader(header);
  drawer(header);
});

/*
   The website originally contained a database at version 1. It had
   2 object stores: `words` and `caches`
          key
   words: hash  word        def
   cache: store lastUpdated
 */
indexedDB.deleteDatabase('kotwys-github-io')
  .addEventListener('success', () => track({
    id: 'deleteded-old-indexeddb'
  }));

if ('serviceWorker' in navigator)
  navigator.serviceWorker.getRegistration('/sw.js')
    .then(async (registration) => {
      if (registration) {
        await registration.unregister();
        track({
          id: 'removed-service-worker',
        });
      }
    });
