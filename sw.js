const CACHE = "super-men-v4";
const FILES = ["./", "index.html", "books.js", "tasks.js", "femo.js", "app.js", "olymp.js", "manifest.webmanifest",
  "fonts/nunito-600.ttf", "fonts/nunito-700.ttf", "fonts/nunito-800.ttf", "fonts/nunito-900.ttf",
  "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
  "img/femo/a20_3.png", "img/femo/a20_7.jpg", "img/femo/a20_8.png", "img/femo/a20b_4.jpg", "img/femo/d19_7.png", "img/femo/d19_8.png", "img/femo/f22_15.png", "img/femo/f22_5.png", "img/femo/f22_9.png", "img/femo/f23_1.png", "img/femo/f24_3.png", "img/femo/f26_10.png", "img/femo/f26_2.png", "img/femo/f26_6.png", "img/femo/r20_7.png", "img/femo/s21_3.png", "img/femo/s22_1.png", "img/femo/s22_5.png", "img/femo/s23_3.png", "img/femo/s24_10.png", "img/femo/s24_9.png", "img/femo/s26_1.png", "img/femo/w21_5.png", "img/femo/w21b_1.jpg", "img/femo/w24_1.png", "img/femo/w26_6.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
/* Желі бірінші: жаңа нұсқа бірден келеді, интернет жоқ болса — кэштен */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
  }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match("index.html"))));
});
