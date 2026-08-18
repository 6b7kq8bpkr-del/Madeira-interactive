// Tryb offline planu Madery — na wyspie zasięgu brakuje w górach i tunelach
const CACHE = "madera-2026-v18";
const OBRAZY = "madera-obrazy-v2";
const OBRAZY_MAX = 80;
const SHELL = [
  "index.html", "praktyczne.html", "gdzie-zjesc.html",
  "mapa.html", "print.html",
  "assets/premium.css", "assets/app.js", "assets/Madera-2026.kml", "manifest.json", "icon.svg",
  "assets/qr-pr12-adultos.png", "assets/qr-pr12-criancas.png",
  "assets/qr-pr11-adultos.png", "assets/qr-pr11-criancas.png",
  "assets/dokumenty-podrozy-3891149.pdf",
  "assets/icon-192.png", "assets/icon-512.png",
  "days/2026-08-19.html", "days/2026-08-20.html", "days/2026-08-21.html", "days/2026-08-22.html",
  "days/2026-08-23.html", "days/2026-08-24.html", "days/2026-08-25.html", "days/2026-08-26.html",
  "days/2026-08-27.html", "days/2026-08-28.html", "days/2026-08-29.html", "days/2026-08-30.html"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  // Bez clients.claim(): nowy worker obejmuje dopiero kolejne wejście na stronę.
  // Przejmowanie kontroli w trakcie ładowania potrafiło przerwać pobieranie zdjęcia.
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== OBRAZY).map((k) => caches.delete(k)))));
});

// Zdjęcia z Wikimedia i Unsplash nigdy się nie zmieniają pod danym adresem,
// więc raz obejrzane zostają w telefonie i działają bez zasięgu.
const zdjecieZewnetrzne = (url) => url.hostname === "upload.wikimedia.org" || url.hostname === "images.unsplash.com";

async function przytnijCache(nazwa, limit) {
  const c = await caches.open(nazwa);
  const klucze = await c.keys();
  for (let i = 0; i < klucze.length - limit; i++) await c.delete(klucze[i]);
}

// Wikimedia i Unsplash wysyłają Access-Control-Allow-Origin: *, więc zdjęcie
// da się pobrać z CORS i sprawdzić status. Odpowiedź typu opaque ma status 0
// i nie odróżnia sukcesu od błędu — zapisana w pamięci utrwaliłaby awarię,
// a na wyspie ze słabym zasięgiem błędów nie brakuje.
async function pobierzZdjecie(req) {
  try {
    const res = await fetch(req.url, { mode: "cors", credentials: "omit" });
    if (res.ok) {
      const kopia = res.clone();
      caches.open(OBRAZY).then((c) => c.put(req, kopia)).then(() => przytnijCache(OBRAZY, OBRAZY_MAX)).catch(() => {});
    }
    return res;
  } catch (err) {
    return fetch(req); // pokazujemy zdjęcie, ale go nie zapisujemy
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // pogoda i mapy zawsze z sieci — offline po prostu ich nie będzie
  if (url.hostname.includes("open-meteo") || url.hostname.includes("tile.openstreetmap") || url.hostname.includes("cdnjs")) return;
  if (zdjecieZewnetrzne(url)) {
    e.respondWith(caches.match(req).then((hit) => hit || pobierzZdjecie(req)));
    return;
  }
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
