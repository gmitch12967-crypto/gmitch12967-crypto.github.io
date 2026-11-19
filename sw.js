const CACHE = "evergreen-tools-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./help.html",
  "./manifest.json",
  "./icon-256.png",
  "./icon-512.png",
  "./tools/csv-cleaner/index.html",
  "./tools/image-shrinker/index.html",
  "./tools/passport-photo/index.html",
  "./tools/csv-global-fixer/index.html",
  "./tools/qr-sign-maker/index.html",
  "./tools/photo-privacy-cleaner/index.html"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
