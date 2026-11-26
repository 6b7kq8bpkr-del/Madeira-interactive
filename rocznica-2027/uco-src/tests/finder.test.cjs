const assert = require('node:assert/strict');
const {filterLeads, currentPlan, fresh, safeURL, latestChecks} = require('../../uco/finder.js');
const now = Date.parse('2026-11-26T10:00:00+01:00');
const data = [
  {id:'one',rodzaj:'oferta',tytul:'Buenos Aires - bagaż',zrodlo:'Iberia',kategoria:'Buenos Aires / Argentyna',url:'https://example.com/one',data:'2026-11-26'},
  {id:'two',rodzaj:'informacja',tytul:'Mendoza',zrodlo:'LATAM',kategoria:'Mendoza',url:'https://example.com/two',data:'2026-11-01'},
  {id:'bad',tytul:'Mendoza tanio',url:'javascript:alert(1)'}
];
assert.deepEqual(filterLeads(data,'BAGAZ iberia','','all',[],[],now).map(x=>x.id),['one']);
assert.deepEqual(filterLeads(data,'','Mendoza','all',[],[],now).map(x=>x.id),['two']);
assert.deepEqual(filterLeads(data,'','','fresh',[],[],now).map(x=>x.id),['one']);
assert.deepEqual(filterLeads(data,'','','all',[],['one'],now).map(x=>x.id),['two']);
assert.deepEqual(filterLeads(data,'','','hidden',[],['one'],now).map(x=>x.id),['one']);
assert.deepEqual(filterLeads(data,'','','saved',['two'],[],now).map(x=>x.id),['two']);
assert.deepEqual(filterLeads(data,'','','deals',[],[],now).map(x=>x.id),['one']);
assert.deepEqual(filterLeads(data,'','','news',[],[],now).map(x=>x.id),['two']);
assert.equal(filterLeads([{...data[0],odwrotny:true}],'','','deals',[],[],now).length,0);
assert.equal(fresh('2026-11-24T09:00:00Z',now),false);
assert.equal(fresh('2026-11-27T09:00:00Z',now),false);
assert.equal(fresh('not-a-date',now),false);
assert.equal(safeURL('https://user:password@example.com'), '');
assert.equal(safeURL('javascript:alert(1)'), '');
const rules = require('../data/program.json').loty.monitoring.reguly;
const previousScan = require('../../uco/okazje.json');
const routes = currentPlan(previousScan.plan, rules);
assert.equal(routes.length, 2, 'Starszy skan zachowuje oba pełne wyszukiwania');
assert.equal(currentPlan(routes.map(q=>({...q,sposobWyceny:'osobne'})),rules).length,0);
assert.equal(currentPlan(routes.map(q=>({...q,dorosli:1})),rules).length,0);
assert.equal(currentPlan(routes.map(q=>({...q,odcinki:q.odcinki.map((l,i)=>i===2?{...l,data:'2027-11-12'}:l)})),rules).length,0);
console.log('Wyszukiwarka: filtry, aktualność i bezpieczne linki - OK');
const {overview, searchPlan, reverseLead} = require('../../uco/finder.js');
const {rank} = require('../../uco/flight-rules.js');
const fixture = require('./flight-fixture.cjs');
const budget = require('../data/program.json').budzet;
const liveNow = Date.now() + 1000;
assert.equal(overview(null,rules,budget,rank,liveNow).available,false);
assert.equal(overview({},rules,budget,rank,liveNow).available,false);
assert.equal(overview({oferty:[]},rules,budget,rank,liveNow).available,true);
assert.equal(overview({oferty:[]},rules,budget,rank,liveNow).best,null);
assert.equal(overview({oferty:[fixture()]},rules,budget,rank,liveNow).best.cena,4600);
const unprotected = fixture(); unprotected.ochronaPotwierdzona = false;
assert.equal(overview({oferty:[unprotected]},rules,budget,rank,liveNow).best,null);
assert.equal(overview({oferty:[fixture()]},rules,budget,rank,liveNow+25*36e5).best,null);
const earlier = fixture(); earlier.odcinki.forEach(l=>{ l.wylot=l.wylot.replace('2027-11','2027-03'); l.przylot=l.przylot.replace('2027-11','2027-03'); });
assert.equal(overview({oferty:[earlier]},rules,budget,rank,liveNow).best,null,'Test wcześniejszych dat nie staje się ofertą listopada');
assert.equal(currentPlan(searchPlan(rules),rules).length,2,'Pełne trasy są dostępne bez skanu RSS');
assert(searchPlan(rules).every(x=>x.kayak.includes('/2adults') && x.odcinki.length===3));
const reverse = {...data[0],tytul:'Vuelos a Madrid por U$D 1.150 ida y vuelta desde Aeroparque'};
assert.equal(reverseLead(reverse),true);
assert.equal(filterLeads([reverse],'','','deals',[],[],now).length,0,'Stary skan też filtruje odwrotny kierunek');
assert.equal(filterLeads([reverse],'','','all',[],[],now).length,1,'Trop pozostaje dostępny w pełnym archiwum');
assert.equal(reverseLead({...data[0],tytul:'Madrid to Buenos Aires from €700'}),false);
console.log('Status listopada, ochrona, wygasanie i plan niezależny od RSS - OK');
const unrelated = {...data[0], kategoria:'Doloty / informacje', tytul:'Flights Madrid to Costa Rica from €390'};
const tour = {...data[0], tytul:'Black Friday: actividades en Buenos Aires desde U$D 20'};
const hub = {...data[0], kategoria:'Inne huby', tytul:'Flights Madrid to Sao Paulo for €587'};
const sale = {...data[0], kategoria:'Doloty / informacje', tytul:'Iberia Black Friday'};
assert.deepEqual(filterLeads([unrelated,tour,hub,sale],'','','deals',[],[],now).map(x=>x.tytul),[hub.tytul,sale.tytul]);
assert.equal(filterLeads([unrelated,tour],'','','all',[],[],now).length,2);
console.log('Promocje: właściwe kierunki i linie, bez wycieczek ani obcych tras - OK');
const flexOffer=fixture(4000); flexOffer.odcinki[5].wylot='2027-11-14T13:45+01:00';
const flexBoard=overview({oferty:[flexOffer]},rules,budget,rank,Date.now());
assert.equal(flexBoard.best,null,'Kompromis nie staje się ofertą spełniającą wszystkie kryteria');
assert.equal(flexBoard.compromise.cena,4000);
assert.equal(overview({oferty:[flexOffer]},rules,budget,rank,Date.now()+25*36e5).compromise,null);
console.log('Panel rozróżnia super okazję z kompromisem - OK');

// Analiza pulpitu: rzeczywiste migawki, wspólny profil, brak pozornej prognozy.
const {dashboardData}=require('../../uco/flight-rules.js');
const testResearch={wyniki:[{cenaPara:13988.92},{cenaPara:null},{cenaPara:11629.28}]};
const metrics=dashboardData({oferty:[]},rules,budget,testResearch,now);
assert.equal(metrics.best,null);
assert.equal(metrics.points.length,0);
assert.equal(metrics.tests[0].cenaPara,11629.28);
assert(Math.abs(metrics.gap-2629.28)<0.001);
assert.equal(Math.round(metrics.reduction*10)/10,22.6);
assert.equal(metrics.goalReached,false);
const snapshot=(price,time)=>({...fixture(price),sprawdzono:time});
const old=snapshot(5000,'2026-11-20T10:00:00+01:00');
const today=snapshot(4500,'2026-11-26T09:00:00+01:00');
const invalid={...snapshot(3000,'2026-11-25T10:00:00+01:00'),ochronaPotwierdzona:false};
const archive=[old,invalid, snapshot(5200,old.sprawdzono), snapshot(2000,'2026-11-27T10:00:00+01:00'),{sprawdzono:'invalid'},earlier];
const series=dashboardData({oferty:[today],archiwumOfert:archive},rules,budget,testResearch,now);
assert.deepEqual(series.points.map(x=>x.price),[10000,9000]);
assert.equal(series.change,-1000);
assert.equal(series.goalReached,true);
assert.equal(series.comparison.kind,'current');
assert.equal(series.gap,0);
const expired=dashboardData({oferty:[old]},rules,budget,{},now);
assert.equal(expired.best,null);
assert.equal(expired.points.length,1,'Dawna poprawna wycena może zasilać historię, lecz nie bieżącą cenę');
assert.equal(expired.change,null);
assert.equal(dashboardData({oferty:[flexOffer]},rules,budget,{},Date.now()).points.length,0,'Kompromisy nie obniżają standardowego trendu');
assert.equal(dashboardData(null,rules,budget,testResearch,now).available,false);
assert.equal(dashboardData({oferty:[],serie:[{hist:[{cena:1,data:'2026-11-25'}]}]},rules,budget,{},now).points.length,0,'Stare szacunki nie stają się historią pełnych cen');
console.log('Pulpit: historia, deduplikacja dni, progi, porównania i brak pozornej prognozy - OK');

// Rejestr sprawdzeń nie zastępuje ofert i nie przechodzi między profilami podróży.
const checked = {profil:rules.profil,dorosli:2,wyloty:[rules.wylot],buenosOd:rules.buenosOd,buenosDo:rules.buenosDo,sprawdzono:'2026-11-26T16:00:00+01:00',linie:[{linia:'Test',wynik:'Brak wyceny'}]};
assert.equal(latestChecks({kontrolaListopada:checked},rules),checked);
for (const changed of [{profil:'inny'},{dorosli:1},{buenosDo:'2027-03-13'},{wyloty:['2027-03-05']},{wyloty:[]},{sprawdzono:'nieznana'},{linie:[]}]) {
 assert.equal(latestChecks({kontrolaListopada:{...checked,...changed}},rules),null);
}
assert.equal(latestChecks(null,rules),null);
assert.equal(dashboardData({oferty:[],kontrolaListopada:checked},rules,budget,{},now).best,null);
assert.equal(dashboardData({oferty:[],kontrolaListopada:checked},rules,budget,{},now).points.length,0);
console.log('OK: kontrole linii nie udają cen ani innego profilu podróży');
