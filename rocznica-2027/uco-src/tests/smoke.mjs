// Testy dymne strony ../../uco: dane, kalendarz .ics i przeglądarka (Chromium przez Playwright).
// Uruchomienie: npm install && npx playwright install chromium && node smoke.mjs
// Zrzuty ekranu przy błędach trafiają do tests/out/.
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../uco');
const OUTDIR = path.join(HERE, 'out');
const fails = [], notes = [];
const fail = (where, what) => fails.push(`${where}: ${what}`);

// ---------- dane bez przeglądarki ----------
function readJSON(f) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { fail(f, 'nie da się wczytać: ' + e.message); return null; }
}
const loty = readJSON('loty.json');
if (loty) {
  if (typeof loty.prog !== 'number') fail('loty.json', 'brak liczbowego „prog”');
  for (const k of ['serie', 'historia', 'sygnaly', 'skrzynka']) if (!Array.isArray(loty[k])) fail('loty.json', `„${k}” nie jest listą`);
  (loty.serie || []).forEach((s, i) => (s.hist || []).forEach(p => {
    if (p.cena != null && !(p.cena > 0)) fail('loty.json', `serie[${i}] (${s.id}) ma cenę ${p.cena}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.data || '')) fail('loty.json', `serie[${i}] (${s.id}) ma datę „${p.data}” zamiast RRRR-MM-DD`);
  }));
}
const promo = readJSON('promocje.json');
if (promo && !Array.isArray(promo.wpisy)) fail('promocje.json', '„wpisy” nie jest listą');
const ics = fs.readFileSync(path.join(ROOT, 'plan.ics'), 'utf8');
{
  const lines = ics.split('\r\n');
  if (ics.replace(/\r\n/g, '').includes('\n')) fail('plan.ics', 'linie muszą kończyć się CRLF');
  lines.forEach((l, i) => { if (Buffer.byteLength(l) > 75) fail('plan.ics', `linia ${i + 1} ma ${Buffer.byteLength(l)} bajtów (max 75)`); });
  const b = (ics.match(/^BEGIN:VEVENT/gm) || []).length, e = (ics.match(/^END:VEVENT/gm) || []).length;
  if (b !== e || b < 13) fail('plan.ics', `VEVENT: ${b} początków, ${e} końców (oczekiwane ≥ 13)`);
}

// ---------- serwer statyczny ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ics': 'text/calendar; charset=utf-8' };
const srv = http.createServer((req, res) => {
  const p = path.normalize(decodeURIComponent(req.url.split(/[?#]/)[0])).replace(/^(\.\.[/\\])+/, '');
  const f = path.join(ROOT, p === '/' ? 'index.html' : p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${srv.address().port}/`;

// ---------- przeglądarka ----------
const browser = await chromium.launch();
async function open(width, scheme, hash = '') {
  const pg = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme });
  const log = { errs: [], bad: [] };
  pg.on('pageerror', e => log.errs.push(e.message));
  pg.on('response', r => { if (r.status() >= 400 && r.url().startsWith(BASE)) log.bad.push(r.status() + ' ' + r.url().slice(BASE.length)); });
  await pg.goto(BASE + 'index.html' + hash, { waitUntil: 'load' });
  await pg.waitForTimeout(1200);
  return { pg, log };
}
async function shot(pg, name) {
  fs.mkdirSync(OUTDIR, { recursive: true });
  await pg.screenshot({ path: path.join(OUTDIR, name + '.png'), fullPage: false }).catch(() => {});
}

// kontrast WCAG liczony z kolorów obliczonych przez przeglądarkę; pomija tekst na zdjęciach i gradientach
const CONTRAST = () => {
  const rgba = c => {
    let m = /rgba?\(([^)]+)\)/.exec(c), k = 1;
    if (!m) { m = /color\(srgb ([^)]+)\)/.exec(c); k = 255; }
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0] * k, p[1] * k, p[2] * k, p.length > 3 ? p[3] : 1];
  };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const mix = (top, under) => [0, 1, 2].map(i => top[i] * top[3] + under[i] * (1 - top[3]));
  const bg = el => {
    const layers = [], r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e), q = e.getBoundingClientRect();
      if (e !== el && e !== document.body && e !== document.documentElement && (cx < q.left || cx > q.right || cy < q.top || cy > q.bottom)) continue; // tekst wystaje poza tło przodka
      if (cs.backgroundImage !== 'none' || e.querySelector(':scope > img, :scope > picture')) return null;
      const c = rgba(cs.backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
    }
    return layers.reverse().reduce((acc, c) => mix(c, acc), [255, 255, 255]);
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg, script, style, [hidden], [aria-hidden="true"], .leaflet-container, .past') || el.disabled) continue;
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    if (!r.width || !r.height || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    const b = bg(el); if (!b) continue;
    let op = 1; for (let e = el; e && e !== document.body; e = e.parentElement) op *= +getComputedStyle(e).opacity;
    const c = rgba(cs.color), fg = mix([c[0], c[1], c[2], c[3] * op], b);
    const L1 = lum(fg), L2 = lum(b), ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(cs.fontSize), large = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700);
    if (ratio < (large ? 3 : 4.5)) out.push(`${ratio.toFixed(2)} ${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} „${el.textContent.trim().slice(0, 30)}”`);
  }
  return [...new Set(out)];
};

const CONFIGS = [[320, 'light'], [375, 'dark'], [768, 'light'], [1024, 'dark'], [1440, 'light'], [1920, 'dark']];
for (const [W, scheme] of CONFIGS) {
  const where = `${W}px ${scheme}`;
  const { pg, log } = await open(W, scheme);
  const H = await pg.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 800) { await pg.evaluate(y => scrollTo(0, y), y); await pg.waitForTimeout(40); }
  await pg.evaluate(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); document.querySelectorAll('details').forEach(d => { d.open = true; }); });
  await pg.waitForTimeout(400);
  const tabs = await pg.$$eval('[data-lt]', b => b.map(x => x.dataset.lt));
  if (!tabs.length) fail(where, 'brak zakładek pulpitu lotów');
  const low = new Set(), checkContrast = W === 1024 || W === 1440;
  for (const t of [...new Set(tabs)]) {
    await pg.click(`[data-lt="${t}"]`); await pg.waitForTimeout(150);
    if (checkContrast) (await pg.evaluate(CONTRAST)).forEach(x => low.add(x));
    const ov = await pg.evaluate(() => { const vw = document.documentElement.clientWidth; return document.documentElement.scrollWidth > vw ? [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); if (!r.width || r.right <= vw + 1 || getComputedStyle(e).position === 'fixed') return false; for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) if (/auto|scroll|hidden|clip/.test(getComputedStyle(p).overflowX)) return false; return true; }).slice(0, 3).map(e => e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]).concat(document.documentElement.scrollWidth + ' px > ' + vw + ' px') : null; });
    if (ov) fail(where, `poziome przewijanie przy zakładce „${t}”: ${ov.join(', ')}`);
  }
  const info = await pg.evaluate(() => {
    const ids = {}; document.querySelectorAll('[id]').forEach(e => { ids[e.id] = (ids[e.id] || 0) + 1; });
    const vis = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
    const small = [...document.querySelectorAll('body *')].filter(e => !e.closest('svg, .leaflet-container, [hidden]') && vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 11)
      .map(e => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} ${getComputedStyle(e).fontSize}`);
    const text = document.body.innerText;
    return {
      dup: Object.keys(ids).filter(k => ids[k] > 1),
      anchors: [...new Set([...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(h => h && !document.getElementById(h)))],
      broken: [...document.images].filter(i => i.complete && i.getAttribute('src') && !i.naturalWidth).map(i => i.getAttribute('src')).slice(0, 5),
      noalt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
      noname: [...document.querySelectorAll('button')].filter(b => !(b.textContent.trim() || b.getAttribute('aria-label') || b.title)).length,
      small: [...new Set(small)].slice(0, 8),
      orphans: (text.match(/(^|[\s(„"])[aiouwzAIOUWZ] /gm) || []).length,
      h1: document.querySelectorAll('h1').length,
    };
  });
  if (log.errs.length) fail(where, 'błędy JS: ' + log.errs.slice(0, 3).join(' | '));
  if (log.bad.length) fail(where, 'brakujące pliki: ' + [...new Set(log.bad)].slice(0, 5).join(', '));
  if (info.dup.length) fail(where, 'powtórzone id: ' + info.dup.join(', '));
  if (info.anchors.length) fail(where, 'linki do nieistniejących kotwic: #' + info.anchors.join(', #'));
  if (info.broken.length) fail(where, 'niewczytane zdjęcia: ' + info.broken.join(', '));
  if (info.noalt) fail(where, `${info.noalt} zdjęć bez alt`);
  if (info.noname) fail(where, `${info.noname} przycisków bez nazwy`);
  if (info.h1 !== 1) fail(where, `${info.h1} nagłówków h1`);
  if (info.small.length) fail(where, 'tekst mniejszy niż 11 px: ' + info.small.join(', '));
  if (info.orphans > 5) fail(where, `${info.orphans} jednoliterowych słów na końcu linii (twarda spacja w build.py / nb() w szablonie)`);
  if (low.size) fail(where, `kontrast poniżej WCAG AA (${low.size}): ` + [...low].slice(0, process.env.VERBOSE ? 999 : 8).join('; '));
  notes.push(`${where}: zakładki ${tabs.length}, sierotki ${info.orphans}`);
  if (fails.some(f => f.startsWith(where))) await shot(pg, `${W}-${scheme}`);
  await pg.close();
}

// linki głębokie: sekcja ma być widoczna (rozwinięta) i przewinięta pod górę ekranu
for (const h of ['decyzje', 'plan', 'd10-11', 'budzet', 'upgrade', 'hotele', 'loty', 'radar', 'kalendarz', 'poradnik', 'zadania', 'kalk', 'rezerwacje', 'wyzwalacze', 'okna']) {
  const { pg, log } = await open(1300, 'light', '#' + h);
  const r = await pg.evaluate(h => { const el = document.getElementById(h); if (!el) return null; const b = el.getBoundingClientRect(); return { shown: !!el.getClientRects().length, top: Math.round(b.top) }; }, h);
  if (!r) fail('#' + h, 'brak elementu');
  else if (!r.shown || r.top < -5 || r.top > 450) fail('#' + h, `po wejściu z linku sekcja ${r.shown ? 'jest na wysokości ' + r.top + ' px' : 'jest ukryta'}`);
  if (log.errs.length) fail('#' + h, 'błędy JS: ' + log.errs[0]);
  await pg.close();
}

// budżet: dwa upgrade'y podnoszą sumę dokładnie o swoje ceny, a odznaczenie przywraca plan bazowy
{
  const { pg, log } = await open(1300, 'light', '#budzet');
  await pg.evaluate(() => { document.querySelectorAll('details').forEach(d => { d.open = true; }); });
  const num = () => pg.evaluate(() => +document.querySelector('#bud .total b').textContent.replace(/\D/g, ''));
  const [base, ups] = [await num(), await pg.evaluate(() => window.UCO.prog.upgrade.opcje.filter(u => u.zl).slice(0, 2).map(u => [u.id, u.zl]))];
  const expected = await pg.evaluate(() => window.UCO.hotels[0].b.razem);
  if (base !== expected) fail('budżet', `plan bazowy pokazuje ${base} zł, dane mówią ${expected} zł`);
  for (const [id] of ups) await pg.check(`[data-up="${id}"]`);
  const up = await num();
  if (up !== base + ups[0][1] + ups[1][1]) fail('budżet', `po zaznaczeniu ${ups.map(u => u[0])} suma ${up} zamiast ${base + ups[0][1] + ups[1][1]}`);
  for (const [id] of ups) await pg.uncheck(`[data-up="${id}"]`);
  if (await num() !== base) fail('budżet', 'odznaczenie upgrade’ów nie przywraca planu bazowego');
  const sufit = await pg.evaluate(() => window.UCO.prog.budzet.sufit);
  if (base > sufit) fail('budżet', `plan bazowy ${base} zł przekracza sufit ${sufit} zł`);
  if (log.errs.length) fail('budżet', 'błędy JS: ' + log.errs[0]);
  notes.push(`budżet: plan bazowy ${base} zł, z dwoma upgrade’ami ${up} zł`);
  await pg.close();
}

// kalkulator: polski zapis liczb i reguła osobnych biletów (≥ min_oszczednosc wobec najlepszego jednego biletu)
async function withLoty(mutate, hash, fn) {
  const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'loty.json'), 'utf8')); mutate(M);
  const pg = await browser.newPage({ viewport: { width: 1300, height: 900 } }); const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.route('**/loty.json', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(M) }));
  await pg.goto(BASE + 'index.html' + hash, { waitUntil: 'load' }); await pg.waitForTimeout(1000);
  await pg.evaluate(() => { document.querySelectorAll('details').forEach(d => { d.open = true; }); });
  await fn(pg); return { pg, errs };
}
{
  const { pg, errs } = await withLoty(M => { M.serie.find(s => s.id === 'calosc').hist = [{ data: '2026-12-01', cena: 5000 }]; }, '#kalk', async pg => {
    const out = () => pg.evaluate(() => document.getElementById('k-out').innerText.replace(/\s+/g, ' '));
    await pg.fill('#k-cena', '4 299,99');
    let t = await out();
    if (!/4\s?300\s?zł/.test(t)) fail('kalkulator', `„4 299,99” nie dało 4 300 zł: ${t.slice(0, 80)}`);
    await pg.fill('#k-cena', '3850'); await pg.check('#k-kr'); await pg.fill('#k-krc', '650');
    t = await out();
    if (!/4\s?500\s?zł/.test(t)) fail('kalkulator', `3 850 + krajowy 650 nie dało 4 500 zł: ${t.slice(0, 80)}`);
    if (!/Nie opłaca się/.test(t) || /Bardzo dobry/.test(t)) fail('kalkulator', 'osobne bilety bez 800 zł oszczędności dostają werdykt „kupować”');
    await pg.fill('#k-cena', '3000'); t = await out();
    if (/Nie opłaca się/.test(t)) fail('kalkulator', 'osobne bilety z oszczędnością ≥ 800 zł dostają werdykt „nie opłaca się”');
  });
  if (errs.length) fail('kalkulator', 'błędy JS: ' + errs[0]);
  await pg.close();
}

// decyzje i terminy: karty, oś czasu z filtrem i odhaczaniem, podsumowanie dla par, plan w pigułce, uwagi w grupach
{
  const { pg, log } = await open(1300, 'light', '#decyzje');
  const r = await pg.evaluate(() => ({
    open: document.querySelectorAll('#dgrid .dc').length, closed: document.querySelectorAll('.dclosed .dc').length, rek: document.querySelectorAll('#dgrid .dop li.rek').length,
    next: document.querySelectorAll('#dnext .dn').length, nextP: document.querySelectorAll('#dnext .dn li').length, kam: document.querySelectorAll('#dnext .dn li a[href="#kalendarz"]').length, today: !!document.querySelector('#os .ostoday'), vis: document.querySelectorAll('#os li.osi:not([hidden])').length, all: document.querySelectorAll('#os li.osi').length,
    tnext: document.querySelector('[data-tnext]').textContent, pig: document.querySelectorAll('.pigt tbody tr').length, pigLinks: [...document.querySelectorAll('.pigt tbody a')].every(a => document.getElementById(a.getAttribute('href').slice(1))),
    ug: document.querySelectorAll('#przygotowania .ug').length, ugN: [...document.querySelectorAll('#przygotowania .ug summary')].reduce((a, s) => a + +(s.textContent.match(/\((\d+)\)/) || [0, 0])[1], 0), uw: window.UCO.prog.uwagi.length,
  }));
  if (r.open < 4 || r.closed < 2 || r.rek < r.open) fail('decyzje', `karty: otwarte ${r.open}, zamknięte ${r.closed}, polecane opcje ${r.rek}`);
  if (r.next !== 2 || r.nextP < 4 || r.kam || !r.today || !/Najbliżej: do \d+\.\d+\.\d{4} – .+/.test(r.tnext)) fail('decyzje', `pasek terminów: grup ${r.next}, pozycji ${r.nextP}, kamieni ${r.kam}, dziś ${r.today}, karta „Teraz”: ${r.tnext}`);
  if (!(r.vis > 3 && r.vis < r.all)) fail('oś czasu', `domyślny filtr pokazuje ${r.vis} z ${r.all}`);
  await pg.click('[data-os="all"]');
  const all = await pg.evaluate(() => document.querySelectorAll('#os li.osi:not([hidden])').length);
  if (all !== r.all) fail('oś czasu', `„Wszystko” pokazuje ${all} z ${r.all}`);
  await pg.click('#os input[data-r="0"]');
  const sync = await pg.evaluate(() => [...document.querySelectorAll('input[data-r="0"]')].map(c => c.checked));
  if (sync.length < 2 || !sync.every(Boolean)) fail('oś czasu', `odhaczenie rezerwacji nie zsynchronizowało się: ${sync}`);
  await pg.click('#dcopy');
  const t = await pg.evaluate(() => document.getElementById('dtxt').value);
  // kwoty z danych: wariant polecany przy trzech parach i lotach w progu (hotels[0].b.razem liczy build.py po aktualnym kursie)
  const R0 = await pg.evaluate(() => ({ razem: window.UCO.hotels[0].b.razem, d: 2 * (window.UCO.prog.budzet.prog - window.UCO.prog.budzet.cel), pi: window.UCO.prog.upgrade.opcje.find(x => x.id === 'pi').zl }));
  const h100 = v => String(Math.round(v / 100) * 100).replace(/(\d)(?=(\d{3})+$)/g, '$1\\s');
  if (!new RegExp('Koszt: ok\\. ' + h100(R0.razem) + ' zł na parę przy 3 parach').test(t) || !new RegExp('celujemy w 4\\s000 – wtedy ok\\. ' + h100(R0.razem - R0.d) + ' zł').test(t) || !new RegExp('Piedra Infinita \\+' + R0.pi + ' zł').test(t) || !/Co potrzebujemy od Was:\n• do 31\.12 – /.test(t) || !/github\.io/.test(t) || t.split('\n').some(l => l.length > 400)) fail('podsumowanie', 'brak kosztu, celu, listy dla par albo linku: ' + t.slice(0, 160));
  // trwająca faza zostaje widoczna na osi w domyślnym zakresie (zegar w środku fazy „Pełny rozkład”)
  await pg.close();
  const p2 = await browser.newPage({ viewport: { width: 390, height: 800 } }); const e2 = []; p2.on('pageerror', e => e2.push(e.message));
  await p2.addInitScript(() => { const RD = Date; const fixed = new RD(2026, 11, 15, 12, 0, 0).getTime(); class FD extends RD { constructor(...a) { super(...(a.length ? a : [fixed])); } static now() { return fixed; } } globalThis.Date = FD; });
  await p2.goto(BASE + 'index.html#decyzje', { waitUntil: 'load' }); await p2.waitForTimeout(800);
  const f = await p2.evaluate(() => { const li = [...document.querySelectorAll('#os li.osi.k-faza')].find(l => /Pełny rozkład/.test(l.textContent)); return li ? { hidden: li.hidden, run: li.classList.contains('run'), past: li.classList.contains('past'), lone: [...document.querySelectorAll('#os li.osm:not([hidden])')].every(h => { let n = h.nextElementSibling; while (n && !n.classList.contains('osm')) { if (!n.hidden && n.classList.contains('osi')) return true; n = n.nextElementSibling; } return false; }), w: document.documentElement.scrollWidth, pigCost: document.querySelector('.pigt tbody td.n').getBoundingClientRect().right } : null; });
  if (!f || f.hidden || !f.run || f.past) fail('oś czasu', `trwająca faza: ${JSON.stringify(f)}`);
  if (f && (!f.lone || f.w > 390 || f.pigCost > 390)) fail('oś czasu / plan w pigułce (390px)', `pusty nagłówek miesiąca ${!f.lone}, szerokość ${f.w}, prawa krawędź kosztu ${Math.round(f.pigCost)}`);
  if (e2.length) fail('oś czasu', 'błędy JS: ' + e2[0]);
  await p2.close();
  if (r.pig !== 8 || !r.pigLinks) fail('plan w pigułce', `wierszy ${r.pig}, linki do dni ${r.pigLinks}`);
  if (r.ug < 5 || r.ugN !== r.uw) fail('warto wiedzieć', `grup ${r.ug}, notatek w grupach ${r.ugN} z ${r.uw}`);
  // wybór na karcie decyzji przestawia budżet i odwrotnie; macierz, postęp i płatności liczą się z budżetu; zadanie „pary” nie dubluje decyzji na osi
  const p4 = await browser.newPage({ viewport: { width: 1300, height: 900 } }); const e4 = []; p4.on('pageerror', e => e4.push(e.message));
  await p4.goto(BASE + 'index.html#decyzje', { waitUntil: 'load' }); await p4.waitForTimeout(1000);
  const q0 = await p4.evaluate(() => ({ mx: document.querySelectorAll('#mx td.n').length, sel: document.querySelector('#mx td.sel button')?.textContent.replace(/\D/g, ''), pay: document.querySelectorAll('#payl li').length, prog: document.getElementById('dprog').innerText.replace(/\s+/g, ' '), tprog: document.querySelector('[data-tprog]').textContent, paryRows: [...document.querySelectorAll('#os li.osi')].filter(l => /Ustalić liczbę par/.test(l.textContent)).length, dupDec: [...document.querySelectorAll('#os li.osi')].filter(l => /Ile par jedzie/.test(l.textContent)).length }));
  if (q0.mx !== 15 || q0.sel !== String(R0.razem) || q0.pay !== 5 || !/Decyzje \d \/ 7/i.test(q0.prog) || !/Decyzje \d\/7 · zadania/.test(q0.tprog) || q0.paryRows !== 0 || q0.dupDec !== 1) fail('decyzje – budżet', JSON.stringify(q0));
  // kurs dolara: jedno źródło – opis wariantu (znaczniki z build.py) zgadza się z tabelą budżetu (calc() na stronie), notka o kursie pokazuje kurs z danych
  const fx = await p4.evaluate(() => { const U = window.UCO, k = U.prog.budzet.kursy, c = window.__calcFor(3, 2 * U.prog.budzet.prog), nf = v => String(v).replace(/(\d)(?=(\d{3})+$)/g, '$1\u00a0'), r10 = v => Math.round(v / 10) * 10; return { build: U.hotels[0].b.razem, calc: c.razem, nocleg: c.nocleg === Math.round(U.hotels[0].model.usd_para * k.USD), note: U.hotels[0].note.includes('ok. ' + nf(r10(c.razem)) + '\u00a0zł') && U.hotels[0].note.includes('Nocleg ok. ' + nf(r10(c.nocleg)) + '\u00a0zł'), dni: U.days.reduce((a, d) => a + d.cost, 0) === c.jedzenie + c.wycieczki_bilety, kursn: document.getElementById('kursn')?.textContent || '', kurs: String(k.USD.toFixed(2)).replace('.', ','), braces: /\{[a-z_]+[:}]/.test(JSON.stringify(U)) }; });
  if (fx.build !== fx.calc || !fx.nocleg || !fx.note || !fx.dni || !fx.kursn.includes(fx.kurs) || !/10\sgr na dolarze/.test(fx.kursn) || fx.braces) fail('budżet – kurs dolara', JSON.stringify(fx));
  await p4.click('input[data-dsel="pary"][value="2"]'); await p4.waitForTimeout(150);
  const q1 = await p4.evaluate(() => ({ np: document.querySelector('#grp [aria-pressed="true"]')?.dataset.np, dsf: document.querySelector('[data-dsf="pary"]').textContent, koszt: document.querySelector('[data-dyn="koszt"]').textContent, sel: document.querySelector('#mx td.sel button')?.dataset.mx, done: document.querySelector('[data-dec-card="pary"]').classList.contains('done') }));
  if (q1.np !== '2' || !/Wybrano: 2\spary/.test(q1.dsf) || q1.sel !== '2|p48' || !q1.done) fail('decyzje – wybór par', JSON.stringify(q1));
  await p4.click('#grp [data-np="4"]'); await p4.waitForTimeout(150);
  const q2 = await p4.evaluate(() => ({ checked: document.querySelector('input[data-dsel="pary"][value="4"]').checked, dsf: document.querySelector('[data-dsf="pary"]').textContent, sel: document.querySelector('#mx td.sel button')?.dataset.mx }));
  if (!q2.checked || !/Wybrano: 4\spary/.test(q2.dsf) || q2.sel !== '4|p48') fail('decyzje – budżet → karta', JSON.stringify(q2));
  await p4.click('#mx button[data-mx="3|p40"]'); await p4.waitForTimeout(150);
  const q3 = await p4.evaluate(() => ({ np: document.querySelector('#grp [aria-pressed="true"]')?.dataset.np, ls: document.querySelector('#lsc [aria-pressed="true"]')?.dataset.ls, sel: document.querySelector('#mx td.sel button')?.textContent.replace(/\D/g, ''), sum: document.querySelector('#payl li.sum b').textContent.replace(/\D/g, ''), txt: (document.getElementById('dcopy').click(), document.getElementById('dtxt').value) }));
  if (q3.np !== '3' || q3.ls !== 'p40' || q3.sel !== String(R0.razem - R0.d) || q3.sum !== String(R0.razem - R0.d) || !/Ustalone: Ile par jedzie → 3\spary/.test(q3.txt)) fail('decyzje – macierz', JSON.stringify(q3));
  await p4.click('[data-dclr="pary"]'); await p4.waitForTimeout(100);
  const q4 = await p4.evaluate(() => ({ done: document.querySelector('[data-dec-card="pary"]').classList.contains('done'), any: [...document.querySelectorAll('input[data-dsel="pary"]')].some(c => c.checked) }));
  if (q4.done || q4.any) fail('decyzje – zmień', JSON.stringify(q4));
  // stare/niespójne dane w pamięci przeglądarki: znacznik „ustalone” sprzed wyboru opcji, nieznana wartość, rozjazd z budżetem, „null”
  await p4.evaluate(() => { localStorage.setItem('uco-dec', JSON.stringify({ pary: true, loty: true })); localStorage.setItem('uco-dsel', JSON.stringify({ hotele: '9', wylot: '5' })); localStorage.setItem('uco-p', '2'); localStorage.setItem('uco-td', 'null'); });
  await p4.reload({ waitUntil: 'load' }); await p4.waitForTimeout(900);
  const q5 = await p4.evaluate(() => ({ pary: document.querySelector('[data-dec-card="pary"]').classList.contains('done'), hot: document.querySelector('[data-dec-card="hotele"]').classList.contains('done'), wyl: document.querySelector('[data-dsf="wylot"]').textContent, loty: document.querySelector('[data-dec-card="loty"]').classList.contains('done'), np: document.querySelector('#grp [aria-pressed="true"]')?.dataset.np, prog: document.getElementById('dprog').innerText.replace(/\s+/g, ' '), os: document.querySelectorAll('#os li.osi').length }));
  if (q5.pary || q5.hot || !/Wybrano: Piątek 5\.11/.test(q5.wyl) || !q5.loty || q5.np !== '2' || !/Decyzje 2 \/ 7/i.test(q5.prog) || q5.os < 20) fail('decyzje – stare dane', JSON.stringify(q5));
  if (e4.length) fail('decyzje – budżet', 'błędy JS: ' + e4[0]);
  await p4.close();
  if (log.errs.length) fail('decyzje', 'błędy JS: ' + log.errs[0]);
}

// ceny-wyzwalacze i okna sprzedaży: progi liczą się z celu, dodatków i kursów; daty otwarcia z liczby dni kalendarza linii
{
  const { pg, log } = await open(1300, 'light', '#wyzwalacze');
  const r = await pg.evaluate(() => {
    const B = window.UCO.prog.budzet, W = window.UCO.prog.loty.wyzwalacze.wiersze, num = s => +s.replace(/[^0-9]/g, '');
    const rows = [...document.querySelectorAll('#wyzwalacze .wyl li')].map(li => ({ c: li.querySelector('.wc').textContent, p: li.querySelector('.wp').textContent }));
    const exp = W.map(x => { const sum = (x.dodatki || []).reduce((a, d) => a + d[1], 0), k = x.wal === 'EUR' ? B.kursy.EUR : 1; return [Math.floor((B.cel - sum) / k / 10) * 10, Math.floor((B.prog - sum) / k / 10) * 10]; });
    const O = window.UCO.prog.loty.okna, okt = [...document.querySelectorAll('#okna .okt tbody tr')].map(tr => [tr.cells[0].querySelector('b').textContent, tr.cells[1].textContent, tr.cells[2].textContent]);
    return { n: rows.length, ok: rows.every((x, i) => num(x.c) === exp[i][0] && num(x.p) === exp[i][1]), first: rows[0], eur: rows.filter(x => /EUR/.test(x.c)).length, kurs: document.querySelector('#wyzwalacze .eyebrow').textContent, okt, okm: document.querySelectorAll('#okna .okm li').length, lines: O.linie.length };
  });
  if (r.n < 6 || !r.ok || !/4\s000\szł/.test(r.first.c) || !/4\s800\szł/.test(r.first.p) || r.eur < 2 || !/4,39/.test(r.kurs)) fail('ceny-wyzwalacze', JSON.stringify({ n: r.n, ok: r.ok, first: r.first, eur: r.eur, kurs: r.kurs }));
  const ib = r.okt.find(x => x[0] === 'Iberia'), ar = r.okt.find(x => /Aerolíneas/.test(x[0]));
  if (r.okt.length !== r.lines || r.okm !== 2 || !ib || ib[1] !== '10.11' || ib[2] !== '18.11' || !ar || ar[1] !== '10.12' || ar[2] !== '18.12') fail('okna sprzedaży', JSON.stringify({ rows: r.okt.length, okm: r.okm, ib, ar }));
  // kalkulator liczy EUR po kursie z danych, także gdy w pamięci został stary zapis waluty
  await pg.evaluate(() => { localStorage.setItem('uco-kalk', JSON.stringify({ c: '585', w: '4.3', z: '1', b: true })); });
  await pg.reload({ waitUntil: 'load' }); await pg.waitForTimeout(900);
  const k = await pg.evaluate(() => ({ wal: document.getElementById('k-wal').value, out: document.getElementById('k-out').innerText.replace(/\s+/g, ' ') }));
  if (k.wal !== 'EUR' || !/2\s?568\s?zł/.test(k.out)) fail('kalkulator – kurs', JSON.stringify(k));
  if (log.errs.length) fail('ceny-wyzwalacze', 'błędy JS: ' + log.errs[0]);
  await pg.close();
}

// skala cen z celem 4 000 zł: pasek, sześć progów, marker najlepszej ceny i werdykt kalkulatora
{
  const { pg, errs } = await withLoty(M => { M.serie.find(s => s.id === 'calosc').hist = [{ data: '2026-12-01', cena: 4600 }]; }, '#skala', async pg => {
    await pg.fill('#k-cena', '3900');
  });
  const r = await pg.evaluate(() => ({ seg: document.querySelectorAll('#skala .sks').length, li: document.querySelectorAll('#skala .skl li').length, mk: !document.getElementById('skm').hidden, left: parseFloat(document.getElementById('skm').style.left), note: document.getElementById('skn').innerText, kalk: document.getElementById('k-out').innerText }));
  if (r.seg !== 6 || r.li !== 6) fail('skala cen', `segmenty ${r.seg}, progi ${r.li} zamiast 6`);
  if (!r.mk || Math.abs(r.left - 41.67) > 0.1) fail('skala cen', `marker 4 600 zł w złym miejscu (${r.left}%)`);
  if (!/600\s?zł do celu/.test(r.note)) fail('skala cen', `opis najlepszej ceny: ${r.note}`);
  if (!/Cel osiągnięty/.test(r.kalk)) fail('skala cen', 'kalkulator nie uznał 3 900 zł za cel');
  if (errs.length) fail('skala cen', 'błędy JS: ' + errs[0]);
  await pg.close();
}

// dane od agentów: historia nie po kolei, brakujące pola i próba wstrzyknięcia HTML nie psują strony
{
  const X = '<img src=x onerror="window.__xss=1">';
  const { pg, errs } = await withLoty(M => {
    M.serie.find(s => s.id === 'calosc').hist = [{ data: '2026-12-20', cena: 4700 }, { data: '2026-12-10', cena: 5200 }];
    M.sygnaly.unshift({ data: '2099-01-01', kierunek: 'spadek', opis: X });
    M.skrzynka = [{ data: X, zrodlo: X, trasa: 'WAW-MDZ', cena: 4500 }];
    M.historia = [{ data: X, zrodlo: X, najtansza: { cena: 4700, opis: X } }];
    if (M.wyprzedaze[0]) M.wyprzedaze[0].szansa = '"><b>x</b>';
    M.zaktualizowano = X;
    M.rss.sprawdzono = '2020-01-01 08:00';
  }, '#loty', async () => {});
  const r = await pg.evaluate(() => ({ xss: window.__xss, teraz: (document.getElementById('teraz') || {}).innerText || '', podium: (document.querySelector('.podium .pp') || {}).textContent || '' }));
  if (r.xss) fail('dane agentów', 'HTML z loty.json wykonał skrypt');
  if (!(await pg.evaluate(() => /nie był odświeżany/.test((document.querySelector('#radar .stale') || {}).textContent || '')))) fail('dane agentów', 'brak ostrzeżenia o nieaktualnym radarze');
  if (/niedostępny/.test(r.teraz) || !r.teraz) fail('dane agentów', 'panel „Co teraz” nie wyrenderował się przy niepełnym sygnale');
  if (r.podium.replace(/\D/g, '') !== '4700') fail('dane agentów', `aktualna cena to ${r.podium} zamiast najnowszej 4 700 zł`);
  if (errs.length) fail('dane agentów', 'błędy JS: ' + errs[0]);
  await pg.close();
}

// karta wyjazdu na górze i skrócona galeria
{
  const { pg, log } = await open(1300, 'light');
  const r = await pg.evaluate(() => ({ koszt: document.querySelector('.tcard [data-dyn="koszt"]')?.textContent || '', zapas: document.querySelector('.tcard [data-dyn="zapas"]')?.textContent || '', teraz: document.querySelector('.tnow')?.innerText || '', noclegi: document.querySelectorAll('.tst li').length, razem: window.UCO.hotels[0].b.razem }));
  if (r.koszt.replace(/\D/g, '') !== String(Math.round(r.razem / 100) * 100)) fail('karta wyjazdu', `koszt „${r.koszt}” nie zgadza się z planem bazowym ${r.razem} zł`);
  if (!/sufit/.test(r.zapas)) fail('karta wyjazdu', 'brak zapasu do sufitu');
  if (r.noclegi !== 3) fail('karta wyjazdu', `${r.noclegi} noclegów zamiast 3`);
  if (r.teraz.length < 30) fail('karta wyjazdu', 'pusta sekcja „Teraz”');
  if (await pg.evaluate(() => { const l = window.__lotyM; const el = document.getElementById('raport'); return l && l.raport && (!el || el.hidden || el.innerText.length < 80); })) fail('raport lotów', 'raport z loty.json nie wyświetlił się w sekcji Loty');
  const g0 = await pg.evaluate(() => [...document.querySelectorAll('.gal figure')].filter(f => f.getClientRects().length).length);
  await pg.click('[data-galall]');
  const g1 = await pg.evaluate(() => [...document.querySelectorAll('.gal figure')].filter(f => f.getClientRects().length).length);
  if (g0 !== 12 || g1 !== await pg.evaluate(() => window.UCO.gallery.length)) fail('galeria', `widoczne ${g0}, po „pokaż wszystkie” ${g1}`);
  if (log.errs.length) fail('karta wyjazdu', 'błędy JS: ' + log.errs[0]);
  await pg.close();
}

// ekran dotykowy: przyciski i rozwijane nagłówki co najmniej 44 px wysokości
{
  const pg = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await pg.goto(BASE + 'index.html', { waitUntil: 'load' }); await pg.waitForTimeout(800);
  await pg.evaluate(() => { document.querySelectorAll('details').forEach(d => { d.open = true; }); });
  const low = await pg.evaluate(() => [...document.querySelectorAll('summary, button:not(.ks)')].filter(e => e.getClientRects().length && e.getBoundingClientRect().height < 43.5).map(e => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} ${Math.round(e.getBoundingClientRect().height)}px`));
  if (low.length) fail('dotyk 390px', `pola niższe niż 44 px (${low.length}): ` + [...new Set(low)].slice(0, 6).join(', '));
  const im = await pg.evaluate(() => { const own = [...document.images].filter(i => /^img\//.test(i.getAttribute('src') || '')); return {
    nodim: own.filter(i => !i.getAttribute('height')).length,
    badset: own.filter(i => i.hasAttribute('srcset') && !/^img\/\S+ 720w, img\/\S+ 1800w$/.test(i.getAttribute('srcset'))).map(i => i.getAttribute('srcset').slice(0, 40)) }; });
  if (im.nodim) fail('dotyk 390px', `${im.nodim} zdjęć bez wymiarów (treść przeskakuje przy ładowaniu)`);
  if (im.badset.length) fail('dotyk 390px', `zepsuty srcset: ${im.badset[0]}`);
  await pg.close();
}

await browser.close(); srv.close();
console.log(notes.join('\n'));
if (fails.length) { console.error(`\n${fails.length} problemów:\n- ` + fails.join('\n- ')); process.exit(1); }
console.log('\nwszystko w porządku');
