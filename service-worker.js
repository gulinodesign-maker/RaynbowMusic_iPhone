const CACHE_NAME = 'music-rainbow-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.webmanifest',
  // Assicurati che tutti gli asset utilizzati siano qui!
  './icons/icon-192.png',
  './icons/icon-512.png',
  
  // Aggiungi qui i tuoi file audio (es. C4.mp3, D4.mp3, ecc.)
  // Esempio:
  // './audio/C4.mp3', 
  // './audio/D4.mp3',
  
  // Font esterni se utilizzati
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700&display=swap'
];

self.addEventListener('install', event => {
  // Esegui l'installazione del service worker e il caching iniziale
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Aggiunge tutte le risorse alla cache
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - restituisce la risorsa dalla cache
        if (response) {
          return response;
        }
        // Nessun match nella cache - effettua la richiesta di rete
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Elimina vecchie cache non più in whitelist
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});