// Prywatny rekord każdej pary; stary wspólny plik pozostaje źródłem do odczytu.
const { put, get, list } = require('@vercel/blob');
const { createHash, timingSafeEqual } = require('node:crypto');
const PLIK = 'uco/ankieta.json', PREFIX = 'uco/ankieta-pary/', ORIGINS = ['https://6b7kq8bpkr-del.github.io'];
const txt = (v, n) => typeof v === 'string' && v.trim().length > 0 && v.trim().length <= n;
const hash = value => createHash('sha256').update(value).digest('hex');
// Ograniczenie prób w instancji funkcji, bez przechowywania adresów IP.
// Nie zastępuje globalnego ograniczenia ruchu w infrastrukturze Vercel.
const attempts = new Map();
function allowed(req) {
  const now = Date.now(), id = hash(String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'));
  for (const [key, entry] of attempts) if (entry.until <= now) attempts.delete(key);
  const entry = attempts.get(id) || { count: 0, until: now + 600000 };
  if (entry.count >= 10) return false;
  if (attempts.size >= 1024 && !attempts.has(id)) return false;
  const supplied = req.headers['x-uco-code'];
  const secret = process.env.UCO_KOD;
  if (typeof supplied === 'string' && secret && timingSafeEqual(Buffer.from(hash(supplied)), Buffer.from(hash(secret)))) return true;
  entry.count++; attempts.set(id, entry); return false;
}

async function read(path) {
  const r = await get(path, { access: 'private', useCache: false });
  if (!r) return null;
  if (r.statusCode !== 200) throw new Error('storage');
  return JSON.parse(await new Response(r.stream).text());
}
async function wczytaj() {
  const legacy = await read(PLIK), pary = Object.assign(Object.create(null), legacy?.pary || {});
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, limit: 100, ...(cursor ? {cursor} : {}) });
    const records = await Promise.all(page.blobs.map(b => read(b.pathname)));
    for (const record of records) {
      if (!record || !txt(record.para, 40)) throw new Error('storage');
      if (record.usun) delete pary[record.para];
      else pary[record.para] = { kiedy: record.kiedy, wybory: record.wybory };
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return {pary};
}

module.exports = async (req, res) => {
  const o = req.headers.origin;
  if (ORIGINS.includes(o)) { res.setHeader('Access-Control-Allow-Origin', o); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'content-type, x-uco-code');
  res.setHeader('Cache-Control', 'no-store');
  if (o && !ORIGINS.includes(o)) return res.status(403).json({blad: 'Otwórz ankietę z aktualnego planu podróży.'});
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ blad: 'Tylko GET i POST.' });
  if (!allowed(req)) return res.status(403).json({ blad: 'Nie udało się zalogować. Sprawdź kod grupy; po wielu próbach odczekaj 10 minut.' });
  let b;
  try { b = req.method === 'POST' ? (typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}) : {}; }
  catch (_) { return res.status(400).json({blad: 'Nieprawidłowe dane. Odśwież formularz.'}); }
  if (!b || typeof b !== 'object' || Array.isArray(b)) return res.status(400).json({blad: 'Nieprawidłowe dane formularza.'});
  const w = b.wybory && typeof b.wybory === 'object' && !Array.isArray(b.wybory) ? Object.entries(b.wybory) : null;
  if (req.method === 'POST' && (!txt(b.para, 40) || (b.usun !== true && (!w || !w.length || w.length > 12 || !w.every(([k, v]) => txt(k, 20) && txt(v, 80)))))) return res.status(400).json({ blad: 'Podajcie, kto odpowiada, i zaznaczcie przynajmniej jedną odpowiedź.' });
  try {
    const d = await wczytaj();
    if (req.method === 'GET') return res.status(200).json(d);
    const para = b.para.trim();
    if (!Object.hasOwn(d.pary, para) && Object.keys(d.pary).length >= 8) return res.status(400).json({blad: 'Za dużo par - napiszcie do organizatora.'});
    const record = {para, kiedy: new Date().toISOString(), ...(b.usun === true ? {usun:true} : {wybory:Object.fromEntries(w.map(([k,v]) => [k,v.trim()]))})};
    await put(PREFIX + hash(para) + '.json', JSON.stringify(record), {access:'private', addRandomSuffix:false, allowOverwrite:true, contentType:'application/json'});
    // Własny zapis w odpowiedzi nie zależy od czasu aktualizacji listy obiektów.
    if (record.usun) delete d.pary[para];
    else d.pary[para] = {kiedy:record.kiedy, wybory:record.wybory};
    return res.status(200).json(d);
  } catch (_) { return res.status(503).json({blad:'Nie udało się odczytać lub zapisać ankiety. Spróbuj ponownie; nie potwierdzono zapisu.'}); }
};
