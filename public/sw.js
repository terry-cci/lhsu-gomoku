const version = "v3";
const cacheName = `lhsu-gomoku-${version}`;

const filesToCache = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
