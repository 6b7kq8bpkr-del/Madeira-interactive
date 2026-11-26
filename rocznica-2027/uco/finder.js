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
  // Also classify older scanner snapshots, before the next server refresh.
  function reverseLead(x) {
    const title = norm(x.tytul);
    const origin = '(?:buenos aires|argentina|argentyny|mendoza|cordoba|rosario|tucuman|ezeiza|aeroparque|aep|eze)';
    const europe = '(?:europa|europe|madrid|madryt|barcelona|paris|paryz|rome|roma|rzym|warsaw|warszawa|london|londyn)';
    return x.odwrotny === true || new RegExp('(?:desde|from|z)\\s+' + origin + '\\b.{0,70}' + europe).test(title) ||
      new RegExp('(?:a|to)\\s+' + europe + '\\b.{0,120}?(?:desde|from)\\s+' + origin).test(title);
  }
  function overview(monitor, rules, budget, rank, now = Date.now()) {
    if (!monitor || !Array.isArray(monitor.oferty)) return {available:false, ready:[], best:null, candidates:0};
    const results = rank(monitor?.oferty, rules, budget, now);
    const ready = results.filter(x => x.ready);
    return {available:true, ready, best:ready[0] || null, candidates:results.length};
  }
  function searchPlan(rules) {
    return [...new Set([rules.wylot, rules.wylotAlternatywny])].filter(Boolean).map(day => {
      const legs = [{z:'WAW',do:'MDZ',data:day},{z:'MDZ',do:'BUE',data:rules.buenosOd},{z:'BUE',do:'WAW',data:rules.buenosDo}];
      return {id:'manual-' + day, scenariusz:'stopover', sposobWyceny:'jeden', dorosli:2, odcinki:legs,
        nazwa:'Wylot ' + day + (day === rules.wylotAlternatywny ? ' po 20:00' : ''),
        trasa:legs.map(l => l.z + ' → ' + l.do + ' ' + l.data).join(' / '),
        kayak:'https://www.kayak.pl/flights/' + legs.map(l => l.z + '-' + l.do + '/' + l.data).join('/') + '/2adults?sort=price_a',
        google:'https://www.google.com/travel/flights?hl=pl&curr=PLN'};
    });
  }
  function filterLeads(leads, query, category, mode, saved, hidden, now = Date.now()) {
    const words = norm(query).split(/\s+/).filter(Boolean);
    return (Array.isArray(leads) ? leads : []).filter(x => x && safeURL(x.url)).filter(x => {
      if (category && x.kategoria !== category) return false;
      if (mode === 'deals' && (x.rodzaj !== 'oferta' || reverseLead(x))) return false;
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
    host.innerHTML = '<header class="finder-head"><div><p class="eyebrow">Listopad 2027 · 2 dorosłych · bez API</p><h3>Stan poszukiwań lotów</h3></div><button type="button" id="finder-refresh">Odśwież zapisane wyniki</button></header>' +
      '<section id="finder-overview" class="finder-overview" aria-live="polite"><h4>Wczytuję status listopada…</h4></section>' +
      '<section id="finder-research" class="finder-research"><h4>Co dały wcześniejsze testy?</h4><div id="finder-research-results"></div></section>' +
      '<details class="finder-plan" id="finder-plan"><summary>Następny krok: sprawdź całą trasę u linii</summary><p>Najpierw KLM / Air France przez São Paulo lub Santiago, następnie Iberia przez Madryt i Aerolíneas. To kolejność sprawdzania oparta na dotychczasowych testach, nie gwarancja najniższej ceny. Wybierz „Wiele miast”, 2 dorosłych i klasę ekonomiczną. Sprawdź obie daty wylotu poniżej.</p><div id="finder-airlines" class="finder-links"></div><p class="finder-note">Linki linii otwierają formularze bez wypełnionych dat. KAYAK przenosi odcinki; wyniki mogą obejmować osobne bilety. W Google wpisz odcinki ręcznie. Sprawdź końcową kwotę i ochronę wszystkich przewoźników u linii.</p><label for="finder-scenario">Wariant podróży</label><select id="finder-scenario"><option value="">Pełna trasa - obie daty wylotu</option></select><div id="finder-routes"></div></details>' +
      '<details id="finder-promos"><summary>Promocje, portale i fora - tropy do sprawdzenia</summary><p id="finder-status" role="status">Pobieranie tropów…</p><div id="finder-health"></div>' +
      '<form class="finder-filters" id="finder-filters"><label>Szukaj w tropach<input id="finder-query" type="search" placeholder="np. Iberia, Mendoza, stopover" maxlength="120"></label><label>Kierunek<select id="finder-category"><option value="">Wszystkie kierunki</option></select></label><label>Widok<select id="finder-mode"><option value="deals">Tropy cenowe</option><option value="all">Wszystkie wpisy</option><option value="news">Wiadomości lotnicze</option><option value="fresh">Publikacje z 7 dni</option><option value="saved">Zapisane</option><option value="hidden">Ukryte</option></select></label><label>Kolejność<select id="finder-sort"><option value="priority">Przydatność dla tej podróży</option><option value="newest">Najnowsza publikacja</option></select></label></form>' +
      '<p class="finder-note">Nagłówek promocji nie jest ceną tej podróży. Domyślnie pomijamy loty rozpoczynające się w Argentynie. Zapisane i ukryte tropy pamięta tylko ta przeglądarka.</p><p id="finder-count" aria-live="polite"></p><ol id="finder-leads" class="finder-leads"></ol>' +
      '<details class="finder-sources"><summary>Odczytane źródła i luki</summary><div id="finder-sources"></div><p><a href="#zrodla-monitoringu" data-lgo="radar">Pełny katalog źródeł →</a></p></details></details>' +
      '<details class="finder-quotes"><summary>Archiwum wycen z porównywarki</summary><p>Starsze próby mogą dotyczyć innych lotnisk i dat. Nie są ofertami na tę podróż.</p><div id="finder-quotes"></div></details>';
    const $ = id => host.querySelector('#finder-' + id);
    Object.entries(labels).forEach(([value, label]) => { const o = el('option', label); o.value = value; $('scenario').append(o); });
    ['Mendoza', 'Buenos Aires / Argentyna', 'Inne huby', 'Doloty / informacje'].forEach(value => { const o = el('option', value); o.value = value; $('category').append(o); });

    function dashboard() {
      const box = $('overview'); box.replaceChildren();
      const summary = overview(monitorState, rules, program.budzet, root.UcoFlights.rank);
      const b = summary.best;
      box.append(el('p', 'STATUS LISTOPADA', 'eyebrow'), el('h4', !summary.available ? 'Nie udało się odczytać ofert na listopad' : b ? 'Jest kompletna oferta na listopad' : 'Brak potwierdzonej oferty na listopad'));
      box.append(el('p', !summary.available ? 'Stan ofert jest nieznany. Odśwież wyniki lub sprawdź formularz linii.' : b ? 'Spełnia zapisane kryteria trasy, bagażu i ochrony. Przed zakupem sprawdź ponownie dostępność.' : 'Nie mamy jeszcze aktualnej ceny całej trasy spełniającej wszystkie wymagania. To nie oznacza, że takich biletów nie ma.'));
      const stats = el('dl', null, 'finder-stats');
      const values = [['Cena całej trasy dla pary', b ? money(b.cena * 2) + ' zł' : 'Niepotwierdzona'], ['Cel dla pary', money(program.budzet.cel * 2) + ' zł'], ['Próg zakupu dla pary', money(program.budzet.prog * 2) + ' zł']];
      values.forEach(([title,value]) => { const group = el('div'); group.append(el('dt',title),el('dd',value)); stats.append(group); });
      box.append(stats);
      if (b) box.append(el('p', 'Sprawdzono: ' + date(b.offer.sprawdzono) + '. ' + (b.cena <= program.budzet.prog ? 'Cena mieści się w progu.' : 'Cena przekracza próg zakupu.'), 'finder-note'), link('Otwórz ofertę u linii ↗', b.offer.url));
      else if (summary.candidates) box.append(el('p', 'Zapisane wyceny do sprawdzenia: ' + summary.candidates + '. Żadna nie spełnia obecnie wszystkich kryteriów.', 'finder-note'));
      box.append(el('p', 'Wylot 4.11 po 20:00 lub 5.11 → Mendoza 6.11. Buenos 12-13.11, powrót do Warszawy najpóźniej 14.11. Maks. 2 przesiadki i 30 h w stronę; zwykłe przesiadki 2-8 h, w Buenos min. 3 h.', 'finder-note'));
      const next = el('a', 'Sprawdź pełną trasę u linii →'); next.href = '#finder-plan'; box.append(next);
      box.append(el('p', 'Automatycznie zbieramy publikacje o promocjach. Cena i dostępność całej trasy wymagają sprawdzenia w formularzu linii. API cen pozostaje wyłączone.', 'finder-note'));
    }

    function research() {
      const box = $('research-results'), log = program.badaniaLotow || {}, rows = Array.isArray(log.wyniki) ? log.wyniki : [];
      box.replaceChildren();
      if (!rows.length) { box.append(el('p', 'Brak zapisanych testów u linii.')); return; }
      const priced = rows.filter(x => Number.isFinite(x.cenaPara) && x.cenaPara > 0).sort((a,b) => a.cenaPara-b.cenaPara);
      const best = priced[0];
      if (best) {
        box.append(el('p', 'Najniższa zapisana pełna wycena testowa: ' + best.linia + ', ' + money(best.cenaPara) + ' zł / 2 osoby, ' + best.termin + '.'));
        box.append(el('p', best.status + '. ' + best.wynik, 'finder-warning'));
        box.append(el('p', 'Do zrobienia: ' + best.nastepny));
      }
      box.append(el('p', 'Ostatnie badanie: ' + date(log.sprawdzono) + '. ' + log.zakres + ' Ceny testowe są historyczne i wymagają ponownego odczytu.', 'finder-note'));
      const details = el('details'), summary = el('summary', 'Wyniki i luki: ' + rows.length + ' sprawdzeń u linii');
      details.append(summary);
      rows.forEach(x => {
        const row = el('article', null, 'finder-route');
        row.append(el('h4', x.linia + ' · ' + x.termin), el('p', x.status + (x.cenaPara != null ? ' · ' + money(x.cenaPara) + ' zł / 2 osoby' : ' · bez pełnej ceny')),
          el('p', x.trasa, 'finder-route-text'), el('p', x.wynik), el('p', 'Następny krok: ' + x.nastepny, 'finder-note'), link('Otwórz linię ↗', x.url));
        details.append(row);
      }); box.append(details);
      const seen = new Set();
      rows.forEach(x => { if (!seen.has(x.linia)) { seen.add(x.linia); $('airlines').append(link(x.linia + ' ↗', x.url)); } });
    }

    function routes() {
      const box = $('routes'); box.replaceChildren();
      const selected = $('scenario').value;
      const plan = searchPlan(rules).filter(q => !selected || q.scenariusz === selected);
      if (!plan.length) box.append(el('p', 'Skan nie zawiera planu zgodnego z aktualnymi wymaganiami. Skorzystaj z pełnej trasy w sekcji „Jak szukać”.', 'finder-warning'));
      plan.forEach(q => {
        const row = el('article', null, 'finder-route');
        row.append(el('h4', q.nazwa), el('p', q.trasa, 'finder-route-text'));
        const links = el('div', null, 'finder-links'); links.append(link('KAYAK · 2 osoby ↗', q.kayak), link('Google · wpisz trasę ↗', q.google));
        const copy = el('button', 'Skopiuj plan wyszukiwania'); copy.type = 'button';
        const copyStatus = el('span', '', 'finder-note'); copyStatus.setAttribute('role', 'status');
        copy.addEventListener('click', async () => {
          const value = program.zasady_podrozy.profil + '\n' + program.zasady_podrozy.bagaz + '\n' + program.zasady_podrozy.przesiadki + '\n' + q.odcinki.map(l => l.z + ' → ' + l.do + ', ' + l.data).join('\n');
          try { await navigator.clipboard.writeText(value); copyStatus.textContent = 'Plan skopiowany. Wklej odcinki w formularzu linii lub porównywarki.'; }
          catch (_) { copyStatus.textContent = 'Nie udało się skopiować. Odcinki i daty znajdziesz powyżej.'; }
        });
        links.append(copy, copyStatus);
        row.append(links);
        const oldQuery = currentPlan(state?.plan, rules).find(p => p.odcinki[0].data === q.odcinki[0].data);
        const check = oldQuery && state?.zapytania?.[oldQuery.id];
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
        top.append(el('span', x.zrodlo + ' · ' + date(x.data) + ' · ' + (reverseLead(x) ? 'przeciwny kierunek' : x.rodzaj === 'oferta' ? 'trop cenowy' : 'wiadomość lotnicza')));
        const heading = el('h4'); heading.append(link(x.tytul + ' ↗', x.url));
        row.append(top, heading, el('p', x.opis));
        if (x.dlaczego && x.dlaczego.length) row.append(el('p', x.dlaczego.join(' · '), 'finder-note'));
        row.append(el('p', 'Do sprawdzenia: ' + ((x.braki || []).join('; ') || 'cała trasa, daty, bagaż i ochrona biletu') + '.', 'finder-warning'));
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
      const ranked = root.UcoFlights ? root.UcoFlights.rank(monitor?.oferty, rules, program.budzet) : [];
      const ready = ranked.filter(q => q.ready);
      box.append(el('p', ready.length ? ready.length + ' ofert spełnia pełne kryteria. Szczegóły i cena na osobę poniżej w panelu „Jaką kombinację kupić?”.' : 'Brak kompletnej, potwierdzonej u linii oferty. Niczego nie rezerwujemy.'));
      const all = (state?.wyceny || []).filter(q => q && safeURL(q.url));
      if (!all.length) box.append(el('p', (state?.ceny || {}).status === 'wymaga podłączenia'
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
      box.append(el('p', 'Poniższe wyszukiwania obejmują indeks wyszukiwarki, a nie pełną treść wszystkich postów. Sam link nie potwierdza sprawdzenia forum ani ustawienia alertu. Newslettery nie są objęte tym skanem. Daty prób u linii są podane w wynikach testów powyżej.'));
      (state.zrodlaReczne || []).forEach(s => {
        const row = el('p');
        row.append(link(s.nazwa + ' ↗', 'https://www.google.com/search?' + new URLSearchParams({q:'site:' + s.domena + ' (Mendoza OR "Buenos Aires" OR Argentyna OR Argentina) 2027', tbs:'qdr:m'})), el('span', ' · ' + s.opis)); box.append(row);
      });
      const limits = state.konfiguracjaLimitow || {};
      if (program.apiCenWlaczone) box.append(el('p', 'Tryb startowy API: do ' + limits.limitDzien + ' zapytań dziennie i ' + limits.limitMiesiac + ' miesięcznie. Jedna wycena złożonej trasy zużywa kilka zapytań, dlatego warianty są sprawdzane rotacyjnie. Odczyt API nie zastępuje weryfikacji u przewoźnika.', 'finder-note'));
    }

    async function refresh() {
      const button = $('refresh'); button.disabled = true;
      $('status').textContent = 'Pobieranie zapisanych wyników. Nie uruchamiamy zapytań o ceny.';
      let fallback = false;
      async function read(url) {
        const response = await fetch(url, {cache:'no-store', signal:AbortSignal.timeout(12000)});
        if (!response.ok) throw new Error('HTTP');
        return response.json();
      }
      async function scan() {
        function validate(data) {
          if (!Array.isArray(data.tropy) || !Array.isArray(data.plan) || data.wersja !== 1) throw new Error('schema');
          return data;
        }
        if (location.hostname === '6b7kq8bpkr-del.github.io') {
          try { return validate(await read('https://raw.githubusercontent.com/6b7kq8bpkr-del/Madeira-interactive/uco-monitor-data/okazje.json')); } catch (_) { fallback = true; }
        }
        return validate(await read('okazje.json'));
      }
      const [scanResult, monitorResult] = await Promise.allSettled([scan(), read('loty.json').then(data => {
        if (!Array.isArray(data.oferty)) throw new Error('schema');
        return data;
      })]);
      if (monitorResult.status === 'fulfilled') monitorState = monitorResult.value;
      // A failed price-ledger read must not suggest a currently verified offer.
      else monitorState = null;
      dashboard();
      if (scanResult.status === 'fulfilled') {
        state = scanResult.value;
        if (!program.apiCenWlaczone) state.ceny = {status:'wyłączone', opis:'Bez API. Skan publikacji nie sprawdza ceny całej trasy.'};
        $('status').textContent = 'Skan publikacji: ' + date(state.sprawdzono) + '. ' + (fallback ? 'Pokazuję kopię z wdrożenia - bieżący skaner jest niedostępny. ' : '') + (fresh(state.sprawdzono, Date.now(), 8) ? 'Skan świeży; ceny lotów nie zostały przez niego potwierdzone.' : 'Skan opóźniony - sprawdź źródła ręcznie.');
        const channels = (state.rss || {}).kanaly || [];
        $('health').replaceChildren(el('p', 'Odczytano ' + channels.filter(c => c.ok).length + ' z ' + channels.length + ' kanałów RSS. API cen: ' + (program.apiCenWlaczone ? 'włączone' : 'wyłączone') + '.', 'finder-health-line'));
        leads(); sources();
      } else {
        $('status').textContent = 'Nie udało się pobrać skanu publikacji. ' + (state ? 'Pozostają wcześniej odczytane tropy z ich datami.' : 'Otwórz formularze linii lub spróbuj ponownie.');
        $('health').replaceChildren();
      }
      routes(); quotes(monitorState || {});
      button.disabled = false;
    }
    $('filters').addEventListener('submit', e => e.preventDefault());
    ['query', 'category', 'mode', 'sort'].forEach(id => $(id).addEventListener(id === 'query' ? 'input' : 'change', leads));
    $('scenario').addEventListener('change', routes);
    $('refresh').addEventListener('click', refresh);
    setInterval(() => { dashboard(); if (state) quotes(monitorState || {}); }, 60000);
    research(); routes(); refresh();
  }
  const api = {mount, filterLeads, currentPlan, searchPlan, overview, reverseLead, fresh, safeURL};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.UcoFinder = api;
})(typeof window !== 'undefined' ? window : globalThis);
