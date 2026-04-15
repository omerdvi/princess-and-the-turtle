// Service Worker — מאפשר לספר לעבוד אופליין אחרי טעינה ראשונה
const CACHE_NAME = 'princess-turtle-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './images/00_cover.jpg',
  './images/01_page_1.jpg',
  './images/02_page_2.jpg',
  './images/03_page_3.jpg',
  './images/04_page_4.jpg',
  './images/05_page_5.jpg',
  './images/06_page_6.jpg',
  './images/07_page_7.jpg',
  './images/08_page_8.jpg',
  './images/09_page_9.jpg',
  './images/10_page_10.jpg',
  './images/11_page_11.jpg',
  './images/12_page_12.jpg',
  './audio/cover.mp3',
  './audio/page_01.mp3',
  './audio/page_02.mp3',
  './audio/page_03.mp3',
  './audio/page_04.mp3',
  './audio/page_05.mp3',
  './audio/page_06.mp3',
  './audio/page_07.mp3',
  './audio/page_08.mp3',
  './audio/page_09.mp3',
  './audio/page_10.mp3',
  './audio/page_11.mp3',
  './audio/page_12.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => cached);
    })
  );
});
