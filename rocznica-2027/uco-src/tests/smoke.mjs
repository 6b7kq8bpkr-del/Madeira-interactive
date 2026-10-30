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
for (const h of ['plan', 'budzet', 'upgrade', 'hotele', 'loty', 'radar', 'kalendarz', 'poradnik', 'zadania', 'kalk']) {
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
