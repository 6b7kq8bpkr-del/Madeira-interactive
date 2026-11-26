/* Wspólna ocena ofert dla strony i kontroli raportu. Bez sieci i bez zakupów. */
(function (root) {
  'use strict';
  const finite = x => typeof x === 'number' && Number.isFinite(x);
  const stamp = x => typeof x === 'string' && /T\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?(?:Z|[+-]\d\d:\d\d)$/.test(x) ? Date.parse(x) : NaN;
  const hours = (a, b) => (stamp(b) - stamp(a)) / 36e5;
  const date = (x, zone) => new Intl.DateTimeFormat('en-CA', {timeZone: zone, year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date(stamp(x)));
  const hour = (x, zone) => +new Intl.DateTimeFormat('en-GB', {timeZone:zone, hour:'2-digit', hourCycle:'h23'}).format(new Date(stamp(x)));
  const BUE = x => x === 'AEP' || x === 'EZE';
  const safeURL = x => typeof x === 'string' && /^https:\/\/[^\s]+$/.test(x);

  function assess(o, rules, now) {
    o = o && typeof o === 'object' ? o : {};
    const reasons = [], warn = [], legs = Array.isArray(o.odcinki) ? o.odcinki : [];
    const age = (now - stamp(o.sprawdzono)) / 36e5;
    if (!(age >= 0 && age <= rules.waznosc_h)) reasons.push('Cena wymaga ponownego sprawdzenia (ważność 24 h).');
    if (o.dorosli !== 2 || o.potwierdzonaULinii !== true || !safeURL(o.url)) reasons.push('Brak potwierdzonej wyceny u linii dla 2 dorosłych.');
    const costs = Array.isArray(o.koszty) ? o.koszty : [];
    if (o.kosztyKompletne !== true || !costs.length || costs.some(c => !c || !finite(c.plnPara) || c.plnPara < 0 || c.status !== 'potwierdzone' || !safeURL(c.url))) reasons.push('Koszty niepełne lub szacowane: potrzebne bilety, bagaż i wszystkie dodatki.');
    const total = costs.length && costs.every(c => c && finite(c.plnPara) && c.plnPara >= 0) ? costs.reduce((s,c) => s+c.plnPara, 0) / 2 : null;
    if (!(total > 0)) reasons.push('Brak pełnej ceny za parę.');
    const valid = legs.length >= 3 && legs.every(l => l && /^[A-Z]{3}$/.test(l.z || '') && /^[A-Z]{3}$/.test(l.do || '') && hours(l.wylot, l.przylot) > 0 && l.bilet && l.linia && l.rejs);
    if (!valid) reasons.push('Brak kompletnych odcinków z godzinami, strefami i podziałem na bilety.');
    let stopHours = null, duration = null, separate = false;
    if (valid) {
      const first = legs[0], last = legs[legs.length-1], mdz = legs.findIndex(l => l.do === 'MDZ');
      const domestic = legs.findIndex((l,i) => i > mdz && l.z === 'MDZ' && BUE(l.do));
      const back = domestic >= 0 ? legs[domestic+1] : null;
      const outDay = date(first.wylot, 'Europe/Warsaw');
      if (first.z !== 'WAW' || last.do !== 'WAW') reasons.push('Plan B poza Warszawą: wymaga osobnej decyzji i wyceny dojazdu.');
      if (!(outDay === rules.wylot || (outDay === rules.wylotAlternatywny && hour(first.wylot,'Europe/Warsaw') >= 20))) reasons.push('Wylot poza uzgodnionymi datami lub przed 20:00 w czwartek.');
      if (domestic !== mdz + 1) reasons.push('Nieciągła trasa pomiędzy pobytem w Mendozie a Buenos Aires.');
      if (mdz < 0 || date(legs[mdz].przylot,'America/Argentina/Mendoza') !== rules.mendoza) reasons.push('Przylot do Mendozy musi być 6.11.');
      if (date(last.przylot,'Europe/Warsaw') > rules.powrot) reasons.push('Powrót do Warszawy po 14.11.');
      if (!back || !BUE(back.z) || date(legs[domestic].wylot,'America/Argentina/Mendoza') !== rules.buenosOd || date(legs[domestic].przylot,'America/Argentina/Buenos_Aires') !== rules.buenosOd || date(back.wylot,'America/Argentina/Buenos_Aires') !== rules.buenosDo) {
        reasons.push('Brak pobytu w Buenos Aires 12-13.11 w drodze powrotnej.');
      } else {
        stopHours = hours(legs[domestic].przylot, back.wylot);
        if (stopHours < rules.stop_min_h || hour(legs[domestic].przylot,'America/Argentina/Buenos_Aires') > rules.buenosPrzylotMax || hour(back.wylot,'America/Argentina/Buenos_Aires') < rules.buenosWylotMin) reasons.push('Postój za krótki na nocleg i zwiedzanie Buenos Aires.');
        if (o.stopoverWTaryfie !== true) reasons.push('Postój niepotwierdzony w finalnym planie i warunkach biletów.');
        if (o.planBUE !== true) reasons.push('Brak sprawdzonego planu hotelu, przechowania walizek i transferów w Buenos Aires.');
      }
      if (mdz >= 0 && back) {
        duration = [hours(first.wylot,legs[mdz].przylot), hours(back.wylot,last.przylot)];
        if (duration.some(h => h <= 0 || h > rules.max_podroz_h) || mdz > rules.max_przesiadki || legs.length-domestic-2 > rules.max_przesiadki) reasons.push('Za długa podróż lub ponad 2 przesiadki w stronę.');
      }
      if (legs.some(l => l.kabinowy !== true || ((rules.bagazRejestrowanyKg || 0) > 0 && (!finite(l.bagazKg) || l.bagazKg < rules.bagazRejestrowanyKg)))) reasons.push('Niepotwierdzony wymagany bagaż na każdym odcinku dla każdej osoby. Podręczny wystarczy; rejestrowany jest opcjonalny.');
      if (o.ochronaPotwierdzona !== true) reasons.push('Niepotwierdzony zakres ochrony przewoźnika dla wspólnych biletów.');
      for (let i=1; i<legs.length; i++) {
        if (i === mdz+1) continue; // pobyt w Mendozie
        const a=legs[i-1], b=legs[i], gap=hours(a.przylot,b.wylot), split=a.bilet!==b.bilet;
        separate ||= split;
        if (gap < 0) reasons.push('Odcinki nakładają się w czasie.');
        if (i===domestic+1 && BUE(a.do) && BUE(b.z)) continue; // transfer podczas pobytu, nie krótka przesiadka
        if (a.do!==b.z) reasons.push('Zmiana lotniska poza noclegiem w Buenos Aires.');
        if (split) {
          const longhaul=hours(b.wylot,b.przylot)>6;
          if (gap < (longhaul ? rules.osobnePrzedAtlantykiemH : rules.osobneH) || (longhaul && a.przylot.slice(0,10) === b.wylot.slice(0,10))) reasons.push('Osobne bilety bez wymaganego bufora lub nocy przed lotem dalekim.');
        } else if (gap < (BUE(a.do) ? rules.buePrzesiadkaH : rules.przesiadkaH) || gap > rules.max_przesiadka_h) reasons.push('Przesiadka poza przyjętym zakresem czasu.');
      }
      separate ||= new Set(legs.map(l => l.bilet)).size > 1;
      if (rules.jedenBilet && separate) reasons.push('Cała trasa z Warszawy, także MDZ-BUE, musi być na jednym chronionym bilecie.');
    }
    if (separate) warn.push('Osobne bilety: bufor i polisa nie oznaczają ochrony przez linię.');
    return {id:o.id, offer:o, cena:total, stopHours, duration, separate, reasons:[...new Set(reasons)], warn, ready:reasons.length===0};
  }

  // Only comfort limits may change. Dates, protection, baggage and stopover stay strict.
  function flexibility(rules, budget) {
    const f = rules.superOkazje;
    const keys = ['przesiadkaH', 'buePrzesiadkaH', 'max_przesiadka_h', 'max_podroz_h'];
    if (!f || f.enabled !== true || !finite(budget.super_okazja) || budget.super_okazja <= 0 ||
        !Number.isInteger(f.maxOdstepstwa) || f.maxOdstepstwa < 1 || keys.some(k => !finite(f[k]) || f[k] <= 0)) return null;
    const relaxed = {...rules};
    keys.forEach(k => { relaxed[k] = f[k]; });
    return relaxed;
  }
  function comfortDeviations(o, rules, result) {
    const minutes = h => { const m = Math.round(h * 60); return Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + m % 60 + ' min' : ''); };
    const deviations = [], legs = o.odcinki;
    const mdz = legs.findIndex(l => l.do === 'MDZ');
    const domestic = legs.findIndex((l,i) => i > mdz && l.z === 'MDZ' && BUE(l.do));
    result.duration.forEach((h,i) => {
      if (h > rules.max_podroz_h) deviations.push((i ? 'Powrót' : 'Lot do Mendozy') + ': ' + minutes(h) + ' podróży (zwykle do ' + rules.max_podroz_h + ' h).');
    });
    for (let i=1; i<legs.length; i++) {
      if (i === mdz + 1 || i === domestic + 1) continue;
      const a = legs[i-1], b = legs[i], gap = hours(a.przylot,b.wylot);
      const minimum = BUE(a.do) ? rules.buePrzesiadkaH : rules.przesiadkaH;
      if (gap < minimum || gap > rules.max_przesiadka_h) deviations.push('Przesiadka w ' + a.do + ': ' + minutes(gap) + ' (zwykle ' + minimum + '-' + rules.max_przesiadka_h + ' h).');
    }
    return deviations;
  }

  function rank(offers, rules, budget, now=Date.now()) {
    const results = (Array.isArray(offers)?offers:[]).map(o => assess(o, rules, now));
    const protectedOffers = results.filter(r => r.ready && !r.separate);
    results.filter(r => r.ready && r.separate).forEach(r => {
      const refs = protectedOffers.filter(p => date(p.offer.odcinki[0].wylot,'Europe/Warsaw') === date(r.offer.odcinki[0].wylot,'Europe/Warsaw'));
      const ref = refs.length ? Math.min(...refs.map(p=>p.cena)) : null;
      r.oszczednosc = ref===null ? null : ref-r.cena;
      if (ref===null || r.oszczednosc < budget.min_oszczednosc) {
        r.reasons.push(ref===null ? 'Brak porównywalnej wyceny chronionej do oceny oszczędności.' : 'Osobne bilety oszczędzają mniej niż 800 zł/os. po dodatkach.');
        r.ready=false;
      }
    });
    const relaxedRules = flexibility(rules, budget);
    results.forEach(r => {
      r.compromise = false; r.deviations = []; r.savingVsStandard = null;
      if (!relaxedRules || r.ready || !(r.cena > 0 && r.cena <= budget.super_okazja)) return;
      const relaxed = assess(r.offer, relaxedRules, now);
      if (!relaxed.ready || relaxed.separate) return;
      const deviations = comfortDeviations(r.offer, rules, relaxed);
      if (!deviations.length || deviations.length > rules.superOkazje.maxOdstepstwa) return;
      const reference = protectedOffers.length ? Math.min(...protectedOffers.map(p => p.cena)) : null;
      // A more comfortable ticket at the same or a lower price dominates this candidate.
      if (reference !== null && reference <= r.cena) return;
      r.compromise = true;
      r.deviations = deviations;
      r.savingVsStandard = reference === null ? null : reference - r.cena;
    });
    const priority = r => r.ready ? 2 : r.compromise ? 1 : 0;
    return results.sort((a,b) => priority(b)-priority(a) || (a.cena??Infinity)-(b.cena??Infinity));
  }
  function reportState(monitor, rules, budget, now=Date.now()) {
    const report = monitor.raport || {}, today = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Warsaw', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date(now));
    const age = /^\d{4}-\d{2}-\d{2}$/.test(report.data || '') ? (Date.parse(today) - Date.parse(report.data)) / 864e5 : NaN;
    const compatible = report.profil === rules.profil;
    const current = compatible && Number.isFinite(age) && age >= 0 && age <= 1;
    const ranked = rank(monitor.oferty, rules, budget, now);
    const best = ranked.find(x => x.ready), compromise = ranked.find(x => x.compromise);
    return {current, best, compromise, headline: best ? (best.cena <= budget.prog ? 'Jest aktualna kompletna oferta w progu. Sprawdź cenę przed zakupem.' : 'Aktualna kompletna oferta jest powyżej progu zakupu.') : compromise ? 'Jest super okazja z kompromisem. Sprawdź odstępstwa w pełnym planie.' : current ? 'Brak aktualnej, kompletnej oferty spełniającej wymagania.' : 'Raport nieaktualny. Sprawdź aktualne oferty przed decyzją.',
      detail: (report.data ? 'Raport z ' + report.data + '. ' : 'Brak daty raportu. ') + (!compatible ? 'Raport dotyczy wcześniejszych wymagań podróży. ' : current ? '' : 'Dane historyczne - wymagają odświeżenia. ') + (report.stan || '') + (compromise ? ' Super okazja: ' + (compromise.cena * 2).toLocaleString('pl-PL') + ' zł za parę. ' + compromise.deviations.join(' ') : '')};
  }
  const api = {assess, rank, reportState};
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
  else root.UcoFlights=api;
})(typeof window !== 'undefined' ? window : globalThis);
