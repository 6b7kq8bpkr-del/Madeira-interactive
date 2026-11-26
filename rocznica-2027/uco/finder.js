(function (root) {
  'use strict';
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ł/g, 'l');
  const fresh = (s, now = Date.now(), hours = 24) => {
    const t = Date.parse(s), age = now - t;
    return Number.isFinite(t) && age >= 0 && age <= hours * 36e5;
  };
  const safeURL = s => {
    try { const u = new URL(s); return ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password ? u.href : ''; }
    catch (_) { return ''; }
  };
  function filterLeads(leads, query, category, mode, saved, hidden, now = Date.now()) {
    const words = norm(query).split(/\s+/).filter(Boolean);
    return (Array.isArray(leads) ? leads : []).filter(x => x && safeURL(x.url)).filter(x => {
      if (category && x.kategoria !== category) return false;
      if (mode === 'deals' && (x.rodzaj !== 'oferta' || x.odwrotny)) return false;
      if (mode === 'news' && x.rodzaj !== 'informacja') return false;
      if (mode === 'saved' && !saved.includes(x.id)) return false;
      if (mode === 'hidden' ? !hidden.includes(x.id) : hidden.includes(x.id)) return false;
      if (mode === 'fresh' && !fresh(x.data + 'T00:00:00Z', now, 7 * 24)) return false;
      const haystack = norm([x.tytul, x.opis, x.zrodlo, x.kategoria].join(' '));
      return words.every(word => haystack.includes(word));
    });
  }

  function currentPlan(plan, rules) {
    return (Array.isArray(plan) ? plan : []).filter(q => {
      const legs = q?.odcinki;
      return q?.scenariusz === 'stopover' && q.sposobWyceny !== 'osobne' && q.dorosli === 2 && legs?.length === 3 &&
        legs[0].z === 'WAW' && legs[0].do === 'MDZ' && [rules.wylot, rules.wylotAlternatywny].includes(legs[0].data) &&
        legs[1].z === 'MDZ' && legs[1].do === 'BUE' && legs[1].data === rules.buenosOd &&
        legs[2].z === 'BUE' && legs[2].do === 'WAW' && legs[2].data === rules.buenosDo;
    });
  }

  function mount(host, program) {
    if (!host) return;
    const rules = program.loty.monitoring.reguly;
    const labels = {stopover:'Cała trasa z Warszawy na jednym bilecie'};
    const money = n => Number(n).toLocaleString('pl-PL', {maximumFractionDigits: 0});
    const nb = s => String(s || '').replace(/\b([aiouwzAIOUWZ])\s+/g, '$1\u00a0');
    const date = s => {
      if (typeof s !== 'string' || !s) return 'brak odczytu';
      const d = new Date(s && s.length === 10 ? s + 'T12:00:00Z' : s);
      return Number.isNaN(+d) ? 'brak odczytu' : new Intl.DateTimeFormat('pl-PL', {dateStyle: 'short', ...(s.length > 10 ? {timeStyle:'short'} : {}), timeZone:'Europe/Warsaw'}).format(d);
    };
    const el = (tag, value, cls) => { const node = document.createElement(tag); if (value != null) node.textContent = nb(value); if (cls) node.className = cls; return node; };
    const link = (label, url) => { const a = el('a', label); const safe = safeURL(url); if (safe) { a.href = safe; a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a; };
    const get = k => { try { const x = JSON.parse(localStorage.getItem('uco-finder-' + k)); return Array.isArray(x) ? x.filter(v => typeof v === 'string') : []; } catch (_) { return []; } };
    const put = (k, value) => { try { localStorage.setItem('uco-finder-' + k, JSON.stringify(value)); } catch (_) {} };
    let monitorState = null, state = null, saved = get('saved'), hidden = get('hidden');
    host.className = 'finder';
    host.innerHTML = '<header class="finder-head"><div><p class="eyebrow">Pełna podróż, dobry lot, noc w Buenos Aires</p><h3>Wyszukiwarka okazji</h3><p>Aktualne tropy, zaplanowane wyszukiwania i wyceny do sprawdzenia. Cena z nagłówka promocji nie jest ceną Waszej podróży.</p></div><button type="button" id="finder-refresh">Pobierz najnowszy skan</button></header>' +
      '<p id="finder-status" role="status">Pobieranie wyników…</p><div id="finder-health"></div>' +
      '<details class="finder-plan"><summary>Wyszukaj konkretne połączenie</summary><p>KAYAK otwiera wybraną trasę dla dwóch osób. W Google wybierz „Wiele miast” i wpisz odcinki z planu poniżej; skopiowanie planu ułatwia ich przeniesienie. Sprawdź daty, dwie osoby i bagaż w formularzu. Te linki nie włączają alertów.</p><label for="finder-scenario">Wariant podróży</label><select id="finder-scenario"><option value="">Wszystkie warianty</option></select><div id="finder-routes"></div></details>' +
      '<details class="finder-quotes"><summary>Wyceny z porównywarki i gotowe oferty</summary><div id="finder-quotes"></div></details>' +
      '<form class="finder-filters" id="finder-filters"><label>Szukaj w tropach<input id="finder-query" type="search" placeholder="np. Iberia, Mendoza, stopover" maxlength="120"></label><label>Kierunek<select id="finder-category"><option value="">Wszystkie kierunki</option></select></label><label>Widok<select id="finder-mode"><option value="deals">Tropy cenowe</option><option value="all">Wszystkie wpisy</option><option value="news">Wiadomości lotnicze</option><option value="fresh">Publikacje z 7 dni</option><option value="saved">Zapisane</option><option value="hidden">Ukryte</option></select></label><label>Kolejność<select id="finder-sort"><option value="priority">Priorytet sprawdzenia</option><option value="newest">Najnowsza publikacja</option></select></label></form>' +
      '<p class="finder-note">Priorytet jest oceną przydatności tematu dla tej podróży. Nie potwierdza dostępności ani ceny. Zapisane i ukryte tropy pamięta tylko ta przeglądarka.</p><p id="finder-count" aria-live="polite"></p><ol id="finder-leads" class="finder-leads"></ol>' +
      '<details class="finder-sources"><summary>Co faktycznie sprawdzono i czego brakuje</summary><div id="finder-sources"></div><p><a href="#zrodla-monitoringu" data-lgo="radar">Pełny katalog źródeł i odczyty agenta →</a></p></details>';
    const $ = id => host.querySelector('#finder-' + id);
    Object.entries(labels).forEach(([value, label]) => { const o = el('option', label); o.value = value; $('scenario').append(o); });
    ['Mendoza', 'Buenos Aires / Argentyna', 'Inne huby', 'Doloty / informacje'].forEach(value => { const o = el('option', value); o.value = value; $('category').append(o); });

    function routes() {
      const box = $('routes'); box.replaceChildren();
      if (!state) return;
      const selected = $('scenario').value;
      const plan = currentPlan(state.plan, rules).filter(q => !selected || q.scenariusz === selected);
      if (!plan.length) box.append(el('p', 'Skan nie zawiera planu zgodnego z aktualnymi wymaganiami. Skorzystaj z pełnej trasy w sekcji „Jak szukać”.', 'finder-warning'));
      plan.forEach(q => {
        const row = el('article', null, 'finder-route');
        row.append(el('h4', q.nazwa), el('p', q.trasa, 'finder-route-text'));
        const links = el('div', null, 'finder-links'); links.append(link('KAYAK · 2 osoby ↗', q.kayak), link('Google · wpisz trasę ↗', q.google));
        const copy = el('button', 'Skopiuj plan wyszukiwania'); copy.type = 'button';
        const copyStatus = el('span', '', 'finder-note'); copyStatus.setAttribute('role', 'status');
        copy.addEventListener('click', async () => {
          const value = program.zasady_podrozy.profil + '\n' + program.zasady_podrozy.bagaz + '\n' + program.zasady_podrozy.przesiadki + '\n' + q.odcinki.map(l => l.z + ' → ' + l.do + ', ' + l.data).join('\n');
          try { await navigator.clipboard.writeText(value); copyStatus.textContent = 'Plan skopiowany. Uzupełnij formularz Google.'; }
          catch (_) { copyStatus.textContent = 'Nie udało się skopiować. Odcinki i daty znajdziesz powyżej.'; }
        });
        links.append(copy, copyStatus);
        row.append(links);
        const check = state.zapytania && state.zapytania[q.id];
        row.append(el('p', check ? date(check.sprawdzono) + ' · ' + check.status + (check.opis ? ': ' + check.opis : '') : 'Brak automatycznego odczytu tej trasy.', 'finder-note'));
        box.append(row);
      });
    }

    function leads() {
      const box = $('leads'); box.replaceChildren();
      if (!state) return;
      const list = filterLeads(state.tropy, $('query').value, $('category').value, $('mode').value, saved, hidden);
      list.sort($('sort').value === 'newest' ? (a,b) => String(b.data).localeCompare(String(a.data)) : (a,b) => (b.priorytet || 0) - (a.priorytet || 0) || String(b.data).localeCompare(String(a.data)));
      $('count').textContent = list.length ? 'Pasujące wpisy: ' + list.length + '. Pokazano: ' + Math.min(list.length, 30) + '.' : 'Brak tropów spełniających filtry. Zmień frazę lub widok. Brak wpisów nie oznacza braku okazji na rynku.';
      list.slice(0, 30).forEach(x => {
        const row = el('li', null, 'finder-lead');
        const top = el('div', null, 'finder-lead-top');
        top.append(el('span', x.zrodlo + ' · ' + date(x.data) + ' · ' + (x.odwrotny ? 'przeciwny kierunek' : x.rodzaj === 'oferta' ? 'trop cenowy' : 'wiadomość lotnicza')), el('strong', 'Priorytet ' + (x.priorytet || 0) + '/99'));
        const heading = el('h4'); heading.append(link(x.tytul + ' ↗', x.url));
        row.append(top, heading, el('p', x.opis));
        if (x.dlaczego && x.dlaczego.length) row.append(el('p', x.dlaczego.join(' · '), 'finder-note'));
        row.append(el('p', 'Do sprawdzenia: ' + (x.braki || []).join('; ') + '.', 'finder-warning'));
        const actions = el('div', null, 'finder-actions');
        [['saved', saved, 'Zapisz trop', 'Zapisany'], ['hidden', hidden, 'Ukryj', 'Przywróć']].forEach(([key, values, off, on]) => {
          const b = el('button', values.includes(x.id) ? on : off); b.type = 'button';
          b.setAttribute('aria-pressed', String(values.includes(x.id)));
          b.addEventListener('click', () => {
            const current = key === 'saved' ? saved : hidden;
            const next = current.includes(x.id) ? current.filter(v => v !== x.id) : [...current, x.id];
            if (key === 'saved') saved = next; else hidden = next;
            put(key, next); leads();
          }); actions.append(b);
        });
        row.append(actions); box.append(row);
      });
    }

    function quotes(monitor) {
      const box = $('quotes'); box.replaceChildren();
      const ranked = root.UcoFlights ? root.UcoFlights.rank(monitor.oferty, rules, program.budzet) : [];
      const ready = ranked.filter(q => q.ready);
      box.append(el('p', ready.length ? ready.length + ' ofert spełnia pełne kryteria. Szczegóły i cena na osobę poniżej w panelu „Jaką kombinację kupić?”.' : 'Brak kompletnej, potwierdzonej u linii oferty. Niczego nie rezerwujemy.'));
      const all = (state.wyceny || []).filter(q => q && safeURL(q.url));
      if (!all.length) box.append(el('p', (state.ceny || {}).status === 'wymaga podłączenia'
        ? 'Automatyczne ceny są niedostępne. Otwórz pełną trasę w bezpłatnym formularzu linii.'
        : 'Nie uzyskano kompletnej wyceny. Sprawdź stan źródła powyżej i odczyty w sekcji „Wyszukaj konkretne połączenie”. Możesz otworzyć trasę w portalu i sprawdzić ją ręcznie.'));
      all.slice().sort((a,b) => String(b.sprawdzono).localeCompare(String(a.sprawdzono))).forEach(q => {
        const row = el('article', null, 'finder-route');
        row.append(el('h4', q.nazwa), el('p', date(q.sprawdzono) + ' · ' + (fresh(q.sprawdzono) ? 'do potwierdzenia' : 'odczyt starszy niż 24 h - odśwież przed oceną')));
        row.append(el('p', 'Kwota wyniku: ' + money(q.cenaWyniku) + ' PLN. ' + q.zakresCeny + '. Nie porównujemy jej automatycznie z ceną za osobę.'));
        if (q.wspolnaOferta) row.append(el('p', 'Wspólna oferta: ' + q.wspolnaOferta.sprzedawca + '. ' + q.wspolnaOferta.uwaga));
        if ((q.odstepstwa || []).length) row.append(el('p', 'Wariant nie spełnia reguł: ' + q.odstepstwa.join('; '), 'finder-warning'));
        if (q.bagaz) row.append(el('p', q.bagaz, 'finder-warning'));
        if (q.stopoverGodziny != null) row.append(el('p', 'Postój w Buenos Aires: ' + q.stopoverGodziny + ' h. Hotel i transfery osobno.'));
        (q.trasy || []).forEach((legs, i) => row.append(el('p', 'Część ' + (i + 1) + ': ' + legs.map(l => l.z + ' ' + l.wylotLokalny + ' → ' + l.do + ' ' + l.przylotLokalny + ' (' + l.rejs + ')').join('; '), 'finder-note')));
        (q.linkiOdcinkow || []).forEach((url, i) => row.append(link('Część ' + (i + 1) + ': ' + money((q.cenyOdcinkow || [])[i]) + ' PLN ↗', url)));
        row.append(el('p', 'Brakuje: ' + (q.braki || []).join('; ') + '.', 'finder-warning'), link('Sprawdź wycenę i sprzedawcę ↗', q.url));
        box.append(row);
      });
    }

    function sources() {
      const box = $('sources'); box.replaceChildren();
      const list = el('ul', null, 'finder-source-list');
      const channels = (state.rss || {}).kanaly || [];
      channels.forEach(s => { const row = el('li'); row.append(link(s.zrodlo, s.url), el('span', ' · ' + (s.ok ? s.wpisy + ' wpisów odczytanych' : 'luka w odczycie') + ' · ' + date(s.sprawdzono))); list.append(row); });
      box.append(list, el('h4', 'Fora, komentarze i skrzynka'));
      box.append(el('p', 'Poniższe wyszukiwania obejmują indeks wyszukiwarki, a nie pełną treść wszystkich postów. Agent sprawdza dostępne źródła osobno o 9:00 i 18:00. Newslettery wymagają odczytu skrzynki; nie kopiujemy tu prywatnej korespondencji.'));
      (state.zrodlaReczne || []).forEach(s => {
        const row = el('p');
        row.append(link(s.nazwa + ' ↗', 'https://www.google.com/search?' + new URLSearchParams({q:'site:' + s.domena + ' (Mendoza OR "Buenos Aires" OR Argentyna OR Argentina) 2027', tbs:'qdr:m'})), el('span', ' · ' + s.opis)); box.append(row);
      });
      const limits = state.konfiguracjaLimitow || {};
      if (program.apiCenWlaczone) box.append(el('p', 'Tryb startowy API: do ' + limits.limitDzien + ' zapytań dziennie i ' + limits.limitMiesiac + ' miesięcznie. Jedna wycena złożonej trasy zużywa kilka zapytań, dlatego warianty są sprawdzane rotacyjnie. Odczyt API nie zastępuje weryfikacji u przewoźnika.', 'finder-note'));
    }

    async function refresh() {
      const button = $('refresh'); button.disabled = true;
      $('status').textContent = 'Pobieranie ostatniego skanu. Ten przycisk nie uruchamia płatnych zapytań.';
      try {
        const publicScan = 'https://raw.githubusercontent.com/6b7kq8bpkr-del/Madeira-interactive/uco-monitor-data/okazje.json';
        let fallback = false;
        async function scan() {
          if (location.hostname === '6b7kq8bpkr-del.github.io') {
            try { const r = await fetch(publicScan, {cache:'no-store', signal:AbortSignal.timeout(12000)}); if (r.ok) return r; } catch (_) {}
            fallback = true;
          }
          return fetch('okazje.json', {cache:'no-store'});
        }
        const responses = await Promise.all([scan(), fetch('loty.json', {cache:'no-store'})]);
        if (responses.some(r => !r.ok)) throw new Error('HTTP');
        const [data, monitor] = await Promise.all(responses.map(r => r.json()));
        if (!Array.isArray(data.tropy) || !Array.isArray(data.plan) || data.wersja !== 1) throw new Error('schema');
        state = data; monitorState = monitor;
        if (!program.apiCenWlaczone) state.ceny = {status:'wyłączone', opis:'Zapytania API wyłączone. Portale, promocje i fora sprawdzamy bez płatnych zapytań.'};
        $('status').textContent = 'Ostatni skan: ' + date(data.sprawdzono) + '. ' + (fallback ? 'Bieżący skaner jest niedostępny - pokazuję kopię z ostatniego wdrożenia strony. ' : '') + (fresh(data.sprawdzono, Date.now(), 8) ? 'Dane są aktualne względem rytmu skanera.' : 'Skan jest opóźniony. Korzystaj z linków i sprawdź źródła ręcznie.');
        const channels = (state.rss || {}).kanaly || [];
        $('health').replaceChildren(el('p', 'RSS: ' + channels.filter(c => c.ok).length + '/' + channels.length + ' kanałów. Ceny automatyczne: ' + ((state.ceny || {}).status || 'brak danych') + '.', 'finder-health-line'), el('p', (state.ceny || {}).opis, 'finder-note'));
        routes(); quotes(monitor); leads(); sources();
      } catch (_) {
        $('status').textContent = 'Nie udało się pobrać nowego skanu. ' + (state ? 'Zachowano poprzednio wczytane wyniki i ich daty.' : 'Spróbuj ponownie. Możesz też skorzystać ze scenariuszy poniżej w sekcji „Jak szukać”.');
      } finally { button.disabled = false; }
    }
    $('filters').addEventListener('submit', e => e.preventDefault());
    ['query', 'category', 'mode', 'sort'].forEach(id => $(id).addEventListener(id === 'query' ? 'input' : 'change', leads));
    $('scenario').addEventListener('change', routes);
    $('refresh').addEventListener('click', refresh);
    setInterval(() => { if (state && monitorState) quotes(monitorState); }, 60000);
    refresh();
  }
  const api = {mount, filterLeads, currentPlan, fresh, safeURL};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.UcoFinder = api;
})(typeof window !== 'undefined' ? window : globalThis);
