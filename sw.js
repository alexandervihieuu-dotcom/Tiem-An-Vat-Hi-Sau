const CACHE_NAME = 'menu-app-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css', // Thay bằng tên file CSS của bạn
  '/script.js', // Thay bằng tên file JS của bạn (nếu có)
  '/manifest.json'
];

// Cài đặt Service Worker và lưu các file vào cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Kích hoạt và phục vụ tài nguyên khi offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});