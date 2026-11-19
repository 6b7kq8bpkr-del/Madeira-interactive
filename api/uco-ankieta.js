// Ankieta par (Valle de Uco 2027): odpowiedzi w prywatnym Vercel Blob, jeden plik JSON.
// GET ?kod=…  -> wszystkie odpowiedzi; POST {kod, para, wybory} -> zapis odpowiedzi jednej pary; POST {kod, para, usun: true} -> wycofanie.
const { put, get } = require('@vercel/blob');
const PLIK = 'uco/ankieta.json', ORIGINS = ['https://6b7kq8bpkr-del.github.io'];
const txt = (v, n) => typeof v === 'string' && v.trim().length > 0 && v.trim().length <= n;

async function wczytaj() {
  const r = await get(PLIK, { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) return { pary: {} };
  try { return JSON.parse(await new Response(r.stream).text()); } catch (e) { return { pary: {} }; }
}

module.exports = async (req, res) => {
  const o = req.headers.origin;
  if (ORIGINS.includes(o)) { res.setHeader('Access-Control-Allow-Origin', o); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const b = req.method === 'POST' ? (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}) : {};
  const kod = req.method === 'POST' ? b.kod : req.query.kod;
  if (!process.env.UCO_KOD || kod !== process.env.UCO_KOD) return res.status(403).json({ blad: 'Zły kod grupy.' });
  const d = await wczytaj();
  if (req.method === 'GET') return res.status(200).json(d);
  if (req.method !== 'POST') return res.status(405).json({ blad: 'Tylko GET i POST.' });
  // {kod, para, usun: true} wycofuje odpowiedzi jednej pary
  if (b.usun === true && txt(b.para, 40)) { delete d.pary[b.para.trim()]; await put(PLIK, JSON.stringify(d), { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' }); return res.status(200).json(d); }
  // walidacja na granicy zaufania: krótka nazwa pary, najwyżej 12 odpowiedzi tekstowych, najwyżej 8 par
  const w = b.wybory && typeof b.wybory === 'object' && !Array.isArray(b.wybory) ? Object.entries(b.wybory) : null;
  if (!txt(b.para, 40) || !w || !w.length || w.length > 12 || !w.every(([k, v]) => txt(k, 20) && txt(v, 80))) return res.status(400).json({ blad: 'Podajcie, kto odpowiada, i zaznaczcie przynajmniej jedną odpowiedź.' });
  const para = b.para.trim();
  if (!d.pary[para] && Object.keys(d.pary).length >= 8) return res.status(400).json({ blad: 'Za dużo par – napiszcie do organizatora.' });
  d.pary[para] = { kiedy: new Date().toISOString(), wybory: Object.fromEntries(w.map(([k, v]) => [k, v.trim()])) };
  // shortcut: odczyt–zmiana–zapis bez blokady; dwie pary w tej samej sekundzie mogą się nadpisać – przy 4 parach wystarczy, przy większym ruchu przejść na Redis
  await put(PLIK, JSON.stringify(d), { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' });
  return res.status(200).json(d);
};
