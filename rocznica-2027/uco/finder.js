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
    if (!monitor || !Array.isArray(monitor.oferty)) return {available:false, ready:[], best:null, compromise:null, candidates:0};
    const results = rank(monitor?.oferty, rules, budget, now);
    const ready = results.filter(x => x.ready);
    return {available:true, ready, best:ready[0] || null, compromise:results.find(x=>x.compromise) || null, candidates:results.length};
  }
  function latestChecks(monitor, rules) {
    const log = monitor?.kontrolaListopada;
    return log && log.profil === rules.profil && log.dorosli === 2 &&
      log.buenosOd === rules.buenosOd && log.buenosDo === rules.buenosDo &&
      Array.isArray(log.wyloty) && log.wyloty.every(d => [rules.wylot, rules.wylotAlternatywny].includes(d)) &&
      log.wyloty.length && Number.isFinite(Date.parse(log.sprawdzono)) && Array.isArray(log.linie) && log.linie.length ? log : null;
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
  function usefulLead(x) {
    const title = norm(x.tytul);
    if (/(actividades|excursiones|visitas guiadas|atrakcje|zwiedzanie|tours|hotels|noclegi)/.test(title) && !/(vuelos|flights|loty|bilety lotnicze)/.test(title)) return false;
    return ['Mendoza', 'Buenos Aires / Argentyna', 'Inne huby'].includes(x.kategoria) ||
      /\b(iberia|air france|klm|latam|aerolineas|air europa|lufthansa|swiss|turkish|tap)\b/.test(title);
  }
  function filterLeads(leads, query, category, mode, saved, hidden, now = Date.now()) {
    const words = norm(query).split(/\s+/).filter(Boolean);
    return (Array.isArray(leads) ? leads : []).filter(x => x && safeURL(x.url)).filter(x => {
      if (category && x.kategoria !== category) return false;
      if (mode === 'deals' && (x.rodzaj !== 'oferta' || reverseLead(x) || !usefulLead(x))) return false;
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
    const money = n => Number(n).toLocaleString('pl-PL', {maximumFractionDigits: 0}).replace(/^(\d)(\d{3})$/, '$1\u00a0$2');
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
    let shortlistMode = null;
    let monitorState = null, state = null, saved = get('saved'), hidden = get('hidden');
    host.className = 'finder';
    host.innerHTML = '<header class="finder-head"><div><p class="eyebrow">Listopad 2027 · 2 dorosłych · jeden bilet</p><h3>Pulpit lotów</h3></div><button type="button" id="finder-refresh">Odśwież zapisane wyniki</button></header><ol class="finder-itinerary" id="finder-itinerary" aria-label="Planowana trasa"></ol>' +
      '<section id="finder-overview" class="finder-overview" aria-live="polite"><h4>Wczytuję status listopada…</h4></section>' +
      '<div id="finder-dashboard-actions" class="finder-dashboard-actions"></div><div class="finder-main"><section class="finder-best"><p class="eyebrow">Wyniki poszukiwań</p><h4>Co udało się sprawdzić</h4><div id="finder-shortlist"></div></section><aside id="finder-insights" class="finder-insights" aria-label="Cena i cel"></aside></div>' +
      '<section id="finder-research" class="finder-research"><h4>Co dały wcześniejsze testy?</h4><div id="finder-research-results"></div></section>' +
      '<details class="finder-plan" id="finder-plan"><summary>Następny krok: sprawdź całą trasę u linii</summary><p>Najpierw KLM / Air France przez São Paulo lub Santiago, następnie Iberia przez Madryt i Aerolíneas. To kolejność sprawdzania oparta na dotychczasowych testach, nie gwarancja najniższej ceny. Wybierz „Wiele miast”, 2 dorosłych i klasę ekonomiczną. Sprawdź obie daty wylotu poniżej.</p><div id="finder-airlines" class="finder-links"></div><p class="finder-note">Linki linii otwierają formularze bez wypełnionych dat. KAYAK przenosi odcinki; wyniki mogą obejmować osobne bilety. W Google wpisz odcinki ręcznie. Sprawdź końcową kwotę i ochronę wszystkich przewoźników u linii.</p><label for="finder-scenario">Wariant podróży</label><select id="finder-scenario"><option value="">Pełna trasa - obie daty wylotu</option></select><div id="finder-routes"></div></details>' +
      '<details id="finder-promos"><summary>Promocje, portale i fora - tropy do sprawdzenia</summary><p id="finder-status" role="status">Pobieranie tropów…</p><div id="finder-health"></div>' +
      '<form class="finder-filters" id="finder-filters"><label>Szukaj w tropach<input id="finder-query" type="search" placeholder="np. Iberia, Mendoza, stopover" maxlength="120"></label><label>Kierunek<select id="finder-category"><option value="">Wszystkie kierunki</option></select></label><label>Widok<select id="finder-mode"><option value="deals">Tropy cenowe</option><option value="all">Wszystkie wpisy</option><option value="news">Wiadomości lotnicze</option><option value="fresh">Publikacje z 7 dni</option><option value="saved">Zapisane</option><option value="hidden">Ukryte</option></select></label><label>Kolejność<select id="finder-sort"><option value="priority">Przydatność dla tej podróży</option><option value="newest">Najnowsza publikacja</option></select></label></form>' +
      '<p class="finder-note">Nagłówek promocji nie jest ceną tej podróży. Domyślnie pokazujemy Argentynę, Santiago, São Paulo i kampanie odpowiednich linii. Pomijamy loty rozpoczynające się w Argentynie oraz oferty atrakcji. Zapisane i ukryte tropy pamięta tylko ta przeglądarka.</p><p id="finder-count" aria-live="polite"></p><ol id="finder-leads" class="finder-leads"></ol>' +
      '<details class="finder-sources"><summary>Odczytane źródła i luki</summary><div id="finder-sources"></div><p><a href="#zrodla-monitoringu" data-lgo="radar">Pełny katalog źródeł →</a></p></details></details>' +
      '<details class="finder-quotes"><summary>Archiwum wycen z porównywarki</summary><p>Starsze próby mogą dotyczyć innych lotnisk i dat. Nie są ofertami na tę podróż.</p><div id="finder-quotes"></div></details>';
    const $ = id => host.querySelector('#finder-' + id);
    const day = s => new Intl.DateTimeFormat('pl-PL',{day:'2-digit',month:'2-digit',timeZone:'Europe/Warsaw'}).format(new Date(s+'T12:00:00Z'));
    [['WAW','Warszawa',day(rules.wylotAlternatywny)+' po 20:00 / '+day(rules.wylot)],['MDZ','Mendoza','przylot '+day(rules.mendoza)],['BUE','Buenos Aires',day(rules.buenosOd)+'-'+day(rules.buenosDo)+' · stopover'],['WAW','Warszawa','powrót do '+day(rules.powrot)]].forEach(([code,city,when])=>{
      const stop=el('li'); stop.append(el('strong',code),el('span',city),el('small',when)); $('itinerary').append(stop);
    });
    Object.entries(labels).forEach(([value, label]) => { const o = el('option', label); o.value = value; $('scenario').append(o); });
    ['Mendoza', 'Buenos Aires / Argentyna', 'Inne huby', 'Doloty / informacje'].forEach(value => { const o = el('option', value); o.value = value; $('category').append(o); });

    function dashboard() {
      const box = $('overview'); box.replaceChildren();
      const actions = $('dashboard-actions'); actions.replaceChildren();
      const summary = overview(monitorState, rules, program.budzet, root.UcoFlights.rank);
      const b = summary.best, c = summary.compromise;
      const data = root.UcoFlights.dashboardData(monitorState, rules, program.budzet, program.badaniaLotow);
      const checks = latestChecks(monitorState, rules);
      insights(data); shortlist(data, shortlistMode || (data.ranked.length || checks ? 'november' : 'tests'));
      box.dataset.state = !summary.available ? 'error' : b ? 'ready' : c ? 'compromise' : 'search';
      box.append(el('p', !summary.available ? 'STATUS NIEZNANY' : b ? 'OFERTA DO SPRAWDZENIA' : c ? 'SUPER OKAZJA' : 'SZUKAMY DALEJ', 'finder-status-badge'), el('h4', !summary.available ? 'Nie udało się odczytać ofert na listopad' : b ? 'Jest kompletna oferta na listopad' : c ? 'Super okazja z kompromisem na listopad' : 'Brak potwierdzonej oferty na listopad'));
      box.append(el('p', !summary.available ? 'Stan ofert jest nieznany. Odśwież wyniki lub sprawdź formularz linii.' : b ? 'Spełnia zapisane kryteria trasy, bagażu i ochrony. Przed zakupem sprawdź ponownie dostępność.' : c ? 'Cena, trasa, bagaż i ochrona są potwierdzone. Ten wariant wymaga niewielkiego kompromisu w komforcie podróży - szczegóły poniżej.' : 'Nie mamy jeszcze aktualnej ceny całej trasy spełniającej wszystkie wymagania. To nie oznacza, że takich biletów nie ma.'));
      const stats = el('dl', null, 'finder-stats');
      const values = [['Najlepsza cena · listopad', b ? money(b.cena*2)+' zł' : c ? money(c.cena*2)+' zł' : 'Brak wyceny', b ? 'Potwierdzona · bez odstępstw' : c ? 'Super okazja z kompromisem' : 'Cała trasa na jednym bilecie'], ['Cel dla pary', money(data.target)+' zł', 'Podręczny · wszystkie odcinki'], ['Super okazja', budgetMoney('super_okazja'), 'Mały kompromis w komforcie'], ['Wcześniejszy test · inne daty', data.tests.length ? money(data.tests[0].cenaPara)+' zł' : 'Brak danych', data.tests.length ? data.tests[0].linia+' · '+data.tests[0].termin : 'Brak historycznej ceny']];
      values.forEach(([title,value,note]) => { const group = el('div'); group.append(el('dt',title),el('dd',value),el('span',note,'finder-note')); stats.append(group); });
      box.append(stats);
      if (checks) {
        const last = el('p', 'Ostatnia kontrola: ' + date(checks.sprawdzono) + ' · ' + checks.linie.length + ' przewoźników · bez API', 'finder-note');
        const more = el('a', 'Zobacz wyniki '+checks.linie.length+' linii ↓', 'finder-primary'); more.href = '#finder-shortlist';
        more.addEventListener('click', () => { shortlistMode = 'november'; shortlist(data, 'november'); });
        box.append(last, more);
      }
      if (b) box.append(el('p', 'Sprawdzono: ' + date(b.offer.sprawdzono) + '. ' + (b.cena <= program.budzet.prog ? 'Cena mieści się w progu.' : 'Cena przekracza próg zakupu.'), 'finder-note'), link('Otwórz ofertę u linii ↗', b.offer.url));
      else if (summary.candidates && !c) box.append(el('p', 'Zapisane wyceny do sprawdzenia: ' + summary.candidates + '. Żadna nie spełnia obecnie wszystkich kryteriów.', 'finder-note'));
      const criteria = el('p', 'Wylot 4.11 po 20:00 lub 5.11 → Mendoza 6.11. Buenos 12-13.11, powrót do Warszawy najpóźniej 14.11. Standardowo maks. 2 przesiadki i 30 h w stronę; zwykłe przesiadki 2-8 h, w Buenos min. 3 h.', 'finder-note');
      if (c) {
        const option = el('div', null, 'finder-route');
        option.append(el('h4', 'Super okazja z kompromisem: ' + money(c.cena * 2) + ' zł / 2 osoby'));
        option.append(el('p', 'Sprawdzono: ' + date(c.offer.sprawdzono) + '. ' + (c.savingVsStandard !== null ? 'Oszczędność wobec aktualnej oferty bez odstępstw: ' + money(c.savingVsStandard * 2) + ' zł za parę.' : 'Brak aktualnej oferty bez odstępstw do porównania oszczędności.'), 'finder-note'));
        const list = el('ul'); c.deviations.forEach(t => list.append(el('li',t))); option.append(list);
        option.append(el('p', 'Do rozważenia po ocenie tych kompromisów i ponownej kontroli ceny.', 'finder-warning'), link('Sprawdź tę ofertę u linii ↗', c.offer.url)); box.append(option);
      }
      const flex = el('details'); flex.append(el('summary', 'Przy super okazji dopuszczamy mały kompromis'), el('p', program.zasady_podrozy.super_okazje, 'finder-note'), criteria); actions.append(flex);
      const next = el('a', 'Sprawdź pełną trasę u linii →', 'finder-primary'); next.href = '#finder-plan'; actions.prepend(next);
      actions.append(el('p', 'Automatycznie zbieramy publikacje o promocjach. Cena i dostępność całej trasy wymagają sprawdzenia w formularzu linii. API cen pozostaje wyłączone.', 'finder-note'));
      const services = el('a', 'Co już działa: monitoring i newslettery →'); services.href = '#zadania'; services.dataset.lgo = 'zadania'; actions.append(services);
    }

    function insights(data) {
      const box = $('insights'); box.replaceChildren();
      const trend = el('section', null, 'finder-trend');
      trend.append(el('p', 'RUCH CEN · OSTATNIE 30 DNI', 'eyebrow'), el('h4', 'Trend pełnej trasy'));
      const points = data.points;
      const chart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chart.setAttribute('viewBox','0 0 560 210'); chart.setAttribute('role','img');
      chart.setAttribute('aria-label', points.length ? 'Dzienne minima ceny dla pary. ' + points.map(p=>date(p.day)+': '+money(p.price)+' zł').join('; ') : 'Brak potwierdzonych wycen do wykresu. Linia celu: '+money(data.target)+' zł za parę.');
      const add = (tag, attrs, text) => { const n = document.createElementNS(chart.namespaceURI,tag); Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v)); if(text) n.textContent=text; chart.append(n); return n; };
      const max = Math.max(data.target*1.4,...points.map(p=>p.price))*1.08;
      const y = price => 176-price/max*150;
      [0, data.target, max].forEach(v => {
        add('line',{x1:65,x2:542,y1:y(v),y2:y(v),class:v===data.target?'chart-target':'chart-grid'});
        add('text',{x:57,y:y(v)+4,'text-anchor':'end'},money(v));
      });
      add('text',{x:70,y:y(data.target)-8,class:'chart-label'},'Cel '+money(data.target)+' zł');
      if (points.length) {
        const start = Date.parse(points[0].day), end = Date.parse(points.at(-1).day);
        const x = p => points.length===1 ? 300 : 75+(Date.parse(p.day)-start)/(end-start)*450;
        if(points.length>1) add('polyline',{points:points.map(p=>x(p)+','+y(p.price)).join(' '),class:'chart-price'});
        points.forEach(p=>{ const c=add('circle',{cx:x(p),cy:y(p.price),r:4,class:'chart-dot'}); const t=document.createElementNS(chart.namespaceURI,'title'); t.textContent=date(p.day)+': '+money(p.price)+' zł'; c.append(t); });
        add('text',{x:75,y:203},date(points[0].day));
        if(points.length>1) add('text',{x:535,y:203,'text-anchor':'end'},date(points.at(-1).day));
      } else add('text',{x:300,y:54,'text-anchor':'middle',class:'chart-empty'},'Czekamy na pierwszą pełną wycenę');
      if(points.length) trend.append(chart);
      else {
        const empty=el('div',null,'finder-chart-empty');
        empty.append(el('strong','Czekamy na pierwszą cenę'),el('p','0 potwierdzonych odczytów na listopad'));
        trend.append(empty);
      }
      trend.append(el('p', points.length>1 ? (data.change<0?'Spadek o ':data.change>0?'Wzrost o ':'Bez zmiany: ')+money(Math.abs(data.change))+' zł między pierwszym i ostatnim odczytem. '+points.length+' dni z wyceną.' : points.length===1 ? 'Jeden dzień z wyceną. Za mało, aby ocenić kierunek zmian.' : 'Brak trendu na listopad. Wcześniejsze testy i sumy osobnych biletów nie zasilają tego wykresu.', 'finder-note'));
      const methodology = el('details'); methodology.append(el('summary','Jak liczymy trend?'),el('p','Dzienne minimum za 2 osoby z odczytów ostatnich 30 dni, zgodnych z obecnymi datami, jednym biletem, bagażem i stopoverem. Łączymy dostępne dni bez uzupełniania luk. To zmiana najniższej znalezionej ceny, nie prognoza rynku. Wykluczamy kompromisy komfortu i niepełne wyceny.','finder-note')); trend.append(methodology);
      const chance = el('section',null,'finder-chance');
      chance.append(el('p','CEL · '+money(data.target)+' ZŁ ZA PARĘ','eyebrow'),el('h4','Szansa na osiągnięcie celu'));
      chance.append(el('p',data.goalReached?'Cel dostępny teraz':'Brak wiarygodnej prognozy','finder-chance-verdict'));
      chance.append(el('p',data.goalReached?'Znaleźliśmy pełną ofertę w celu. Sprawdź ponownie cenę i dostępność przed decyzją.':'Nie ma podstaw do uczciwego procentu prawdopodobieństwa. '+(points.length?'Historia obejmuje '+points.length+' dni z pełną wyceną.':'Nie mamy jeszcze historii pełnych cen na listopad.'),'finder-note'));
      if(data.comparison) {
        const test = data.comparison.kind==='test';
        chance.append(el('p',test?'Punkt odniesienia: najtańszy wcześniejszy test.':'Punkt odniesienia: najlepsza aktualna oferta.','finder-note'));
        chance.append(el('strong',data.gap>0?'Potrzebny spadek: '+money(data.gap)+' zł ('+data.reduction.toLocaleString('pl-PL',{maximumFractionDigits:1})+'%)':test?'Cena testowa mieści się w celu':'Cena mieści się w celu','finder-gap'));
        const track = el('div',null,'finder-goal-track'); track.setAttribute('aria-hidden','true'); const fill=el('span'); fill.style.width=Math.min(100,data.target/data.comparison.price*100)+'%'; track.append(fill); chance.append(track);
        chance.append(el('p',test?'Porównanie do testu z innych dat. Wymagany spadek nie jest szansą na promocję.':'Różnica ceny do celu; nie prawdopodobieństwo spadku.','finder-note'));
      }
      const thresholds = el('dl',null,'finder-thresholds');
      [['Super okazja',budgetMoney('super_okazja')],['Cel',money(data.target)+' zł'],['Próg zakupu',budgetMoney('prog')]].forEach(([a,b])=>{ const d=el('div'); d.append(el('dt',a),el('dd',b)); thresholds.append(d); }); chance.append(thresholds);
      box.append(chance,trend);
    }
    function budgetMoney(key) { return money(program.budzet[key]*2)+' zł'; }

    function shortlist(data, mode) {
      const box=$('shortlist'); box.replaceChildren();
      const group=el('div',null,'finder-switch'); group.setAttribute('role','group'); group.setAttribute('aria-label','Zakres porównania ofert');
      [['november','Listopad 2027'],['tests','Wcześniejsze testy']].forEach(([key,title])=>{ const b=el('button',title); b.type='button'; b.setAttribute('aria-pressed',String(mode===key)); b.addEventListener('click',()=>{ shortlistMode=key; shortlist(data,key); }); group.append(b); });
      box.append(group);
      if(mode==='november') {
        const checks = latestChecks(monitorState, rules);
        if(!data.available || data.ranked.length) box.append(el('p',data.available?'Pełna trasa dla dwóch osób. Kolejność: oferty zgodne, kompromisy, pozostałe wyceny.':'Nie udało się odczytać ofert. Odśwież zapisane wyniki.','finder-note'));
        if(data.available && !data.ranked.length && !checks) box.append(el('p','Brak zapisanej pełnej oferty na listopad. Otwórz formularz linii lub porównaj wcześniejsze testy.','finder-empty'));
        data.ranked.slice(0,3).forEach(r=>{
          const a=el('article',null,'finder-offer');
          const top=el('div'); top.append(el('span',r.ready?'Zgodna z kryteriami':r.compromise?'Super okazja z kompromisem':'Do ponownej weryfikacji','finder-badge'),el('h4',r.offer.nazwa || 'Pełna trasa z Warszawy'),el('p','Odczyt: '+date(r.offer.sprawdzono),'finder-note'));
          const price=el('div',null,'finder-offer-price'); price.append(el('strong',r.cena?money(r.cena*2)+' zł':'Brak pełnej ceny'),el('span','za 2 osoby','finder-note')); a.append(top,price);
          const info=el('div',null,'finder-offer-info'); info.append(el('p',r.ready?'Jeden bilet · podręczny · Buenos '+Math.round(r.stopHours)+' h':(r.compromise?r.deviations:r.reasons).join(' '),'finder-note'),link('Sprawdź u linii ↗',r.offer.url)); a.append(info); box.append(a);
        });
        if(checks) {
          const section=el('section',null,'finder-checks'); section.id='finder-checks';
          section.append(el('h4','Ostatnie sprawdzenie u linii'),el('p',date(checks.sprawdzono)+' · rozwiń linię, aby zobaczyć daty i wynik.','finder-note'));
          const scope=el('details',null,'finder-check-scope'); scope.append(el('summary','Zakres tej kontroli'),el('p',checks.zakres,'finder-note'));
          checks.linie.forEach(r=>{
            const row=el('details',null,'finder-check');
            row.dataset.state = /niepełny|niedostępna/.test(r.status) ? 'gap' : 'checked';
            const title=el('summary'); title.append(el('strong',r.linia),el('span',r.status,'finder-check-status'));
            row.append(title,el('p',r.termin+' · '+r.trasa,'finder-note'),el('p',r.wynik,'finder-note'),link('Formularz '+r.linia+' ↗',r.url));
            section.append(row);
          });
          const next=el('div',null,'finder-next'); next.append(el('strong','Następny ruch'),el('p',checks.nastepny,'finder-note'));
          section.append(next,scope); box.append(section);
        }
      } else {
        box.append(el('p','Historyczne odczyty na inne terminy. Nie potwierdzają cen na listopad ani dostępności dziś. Kwoty za 2 osoby.','finder-note'));
        const max=Math.max(data.target,...data.tests.map(x=>x.cenaPara));
        data.tests.slice(0,3).forEach((r,i)=>{
          const a=el('article',null,'finder-offer'); const top=el('div'); top.append(el('span',i===0?'Najtańszy test':'Wcześniejszy test','finder-badge'),el('h4',r.linia),el('p',r.termin,'finder-note'));
          const price=el('div',null,'finder-offer-price'); price.append(el('strong',money(r.cenaPara)+' zł'),el('span','za 2 osoby','finder-note')); a.append(top,price);
          const bar=el('div',null,'finder-price-bar'); bar.setAttribute('aria-hidden','true'); const fill=el('span'); fill.style.width=r.cenaPara/max*100+'%'; const goal=el('i'); goal.style.left=data.target/max*100+'%'; bar.append(fill,goal); a.append(bar);
          const info=el('div',null,'finder-offer-info'); info.append(el('p',r.trasa,'finder-route-text'),el('p',r.status+'. '+r.wynik,'finder-note'),el('p','Następny krok: '+r.nastepny,'finder-note'),link('Formularz '+r.linia+' ↗',r.url)); a.append(info); box.append(a);
        });
        if(!data.tests.length) box.append(el('p','Brak zapisanych pełnych cen testowych.','finder-empty'));
        else box.append(el('p','Kreska na paskach oznacza cel '+money(data.target)+' zł. Różne terminy nie są szeregiem cenowym.','finder-note'));
      }
    }

    function research() {
      const box = $('research-results'), log = program.badaniaLotow || {}, rows = Array.isArray(log.wyniki) ? log.wyniki : [];
      box.replaceChildren();
      if (!rows.length) { box.append(el('p', 'Brak zapisanych testów u linii.')); return; }
      box.append(el('p', 'Ostatnie badanie: ' + date(log.sprawdzono) + '. ' + log.zakres + ' Ceny testowe są historyczne i wymagają ponownego odczytu.', 'finder-note'));
      const details = el('details'), summary = el('summary', 'Pozostałe sprawdzenia i luki (' + rows.filter(x=>!Number.isFinite(x.cenaPara)).length + ')');
      details.append(summary);
      rows.filter(x => !Number.isFinite(x.cenaPara)).forEach(x => {
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
          const value = program.zasady_podrozy.profil + '\n' + program.zasady_podrozy.bagaz + '\n' + program.zasady_podrozy.przesiadki + '\n' + program.zasady_podrozy.super_okazje + '\n' + q.odcinki.map(l => l.z + ' → ' + l.do + ', ' + l.data).join('\n');
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
      box.append(el('p', ready.length ? ready.length + ' ofert spełnia pełne kryteria. Szczegóły i cena na osobę poniżej w panelu „Jaką kombinację kupić?”.' : ranked.some(q=>q.compromise) ? 'Jest super okazja z kompromisem - sprawdź ją w statusie listopada powyżej.' : 'Brak kompletnej, potwierdzonej u linii oferty. Niczego nie rezerwujemy.'));
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
  const api = {mount, filterLeads, currentPlan, searchPlan, overview, latestChecks, reverseLead, usefulLead, fresh, safeURL};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.UcoFinder = api;
})(typeof window !== 'undefined' ? window : globalThis);
