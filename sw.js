// Tryb offline planu Madery — na wyspie zasięgu brakuje w górach i tunelach
const CACHE = "madera-2026-v1";
const SHELL = [
  "index.html", "praktyczne.html", "gdzie-zjesc.html", "print.html",
  "assets/premium.css", "assets/app.js",
  "days/2026-08-19.html", "days/2026-08-20.html", "days/2026-08-21.html", "days/2026-08-22.html",
  "days/2026-08-23.html", "days/2026-08-24.html", "days/2026-08-25.html", "days/2026-08-26.html",
  "days/2026-08-27.html", "days/2026-08-28.html", "days/2026-08-29.html", "days/2026-08-30.html"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // pogoda i mapy zawsze z sieci — offline po prostu ich nie będzie
  if (url.hostname.includes("open-meteo") || url.hostname.includes("tile.openstreetmap") || url.hostname.includes("cdnjs")) return;
  // strony i zasoby: najpierw sieć (świeże treści), z odwrotem do kopii offline
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.status === 200 && url.origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match("index.html")))
  );
});
