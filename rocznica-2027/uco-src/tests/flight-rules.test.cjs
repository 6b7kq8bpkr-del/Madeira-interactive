const assert=require('node:assert/strict');
const {rank,assess,reportState}=require('../../uco/flight-rules.js');
const fixture=require('./flight-fixture.cjs');
const P=require('../data/program.json'), R=P.loty.monitoring.reguly, B=P.budzet;
let count=0;
function reject(mutate,pattern) {const o=fixture();mutate(o);const r=assess(o,R,Date.now());assert.equal(r.ready,false);assert.match(r.reasons.join(' '),pattern);count++;}
const good=assess(fixture(),R,Date.now());assert.equal(good.ready,true,good.reasons.join('; '));assert.equal(good.stopHours,32);assert.equal(good.cena,4600);count++;
reject(o=>o.dorosli=1,/2 dorosłych/);
reject(o=>o.sprawdzono='2020-01-01T12:00Z',/ponownego/);
reject(o=>o.koszty[0].status='szacunek',/szacowane/);
reject(o=>o.koszty[0].plnPara='9200',/Koszty/);
reject(o=>o.odcinki[2].kabinowy=false,/bagaż/);
const cabin=fixture();cabin.odcinki.forEach(l=>delete l.bagazKg);assert.equal(assess(cabin,R,Date.now()).ready,true);count++;
reject(o=>o.odcinki[0].wylot='2027-11-04T19:00+01:00',/20:00/);
reject(o=>o.odcinki[5].przylot='2027-11-15T01:00+01:00',/po 14.11/);
reject(o=>o.odcinki[4].wylot='2027-11-13T08:00-03:00',/Postój za krótki/);
reject(o=>o.odcinki[4].wylot='2027-11-12T20:00-03:00',/Brak pobytu/);
reject(o=>o.odcinki[2].z='AEP',/Zmiana lotniska/);
reject(o=>o.odcinki[2].wylot='2027-11-06T03:00-03:00',/Przesiadka poza/);
reject(o=>o.ochronaPotwierdzona=false,/zakres ochrony/);
reject(o=>o.stopoverWTaryfie=false,/Postój niepotwierdzony/);
reject(o=>o.planBUE=false,/hotelu/);
reject(o=>o.odcinki[1].bilet='B',/jednym chronionym bilecie/);
reject(o=>o.odcinki[1].wylot='2027-11-05T17:00',/strefami/);
const split=fixture(3800);split.id='split';split.odcinki[3].bilet='B';
let rs=rank([fixture(4600),split],R,B);assert.equal(rs[0].id,'fixture');assert.equal(rs[1].ready,false);count++;
rs=rank([split],R,B);assert.equal(rs[0].ready,false);assert.match(rs[0].reasons.join(),/jednym chronionym bilecie/);count++;
const now=Date.parse('2026-11-26T12:00:00Z');
for (const raport of [{data:'2026-11-20',profil:R.profil},{data:'2026-11-26'},{data:'2026-11-30',profil:R.profil}]) {const s=reportState({raport,oferty:[]},R,B,now);assert.equal(s.current,false);assert.match(s.headline,/nieaktualny/);count++;}
assert.equal(reportState({raport:{data:'2026-11-26',profil:R.profil},oferty:[]},R,B,now).current,true);
assert.deepEqual(rank([],R,B),[]);count++;
console.log('OK:',count,'kontroli ofert, dat, ochrony, bagażu i stopoveru');

// Super okazje: pełne wyceny i niezmienione zabezpieczenia, tylko małe różnice komfortu.
function flexFixture(price=4000) {
  const o=fixture(price); o.id='flex';
  o.odcinki[5].wylot='2027-11-14T13:45+01:00';
  return o;
}
function flexRank(o, others=[], rules=R, budget=B, time=Date.now()) { return rank([...others,o],rules,budget,time).find(x=>x.id===o.id); }
let flex=flexRank(flexFixture());
assert.equal(flex.ready,false); assert.equal(flex.compromise,true);
assert.match(flex.deviations[0],/MAD: 1 h 45 min/);
assert.equal(flex.savingVsStandard,null);
assert.equal(flexRank(flexFixture(4000.01)).compromise,false,'Cena powyżej progu wyklucza wyjątek');
assert.equal(flexRank(flexFixture(4000),[fixture(3900)]).compromise,false,'Wygodniejsza tańsza oferta ma pierwszeństwo');
assert.equal(flexRank(flexFixture(4000),[fixture(4600)]).savingVsStandard,600);
assert.equal(flexRank(flexFixture(),[],{...R,superOkazje:{...R.superOkazje,enabled:false}}).compromise,false);
assert.equal(flexRank(flexFixture(),[],R,{...B,super_okazja:undefined}).compromise,false);
function noFlex(change) { const o=flexFixture(); change(o); assert.equal(flexRank(o).compromise,false); }
noFlex(o=>o.odcinki[5].wylot='2027-11-14T13:44+01:00');
noFlex(o=>o.ochronaPotwierdzona=false);
noFlex(o=>o.potwierdzonaULinii=false);
noFlex(o=>o.kosztyKompletne=false);
noFlex(o=>o.koszty[0].status='szacunek');
noFlex(o=>o.dorosli=1);
noFlex(o=>o.odcinki[0].z='BER');
noFlex(o=>o.odcinki[3].bilet='B');
noFlex(o=>o.odcinki[2].kabinowy=false);
noFlex(o=>o.sprawdzono='2020-01-01T12:00:00Z');
noFlex(o=>o.stopoverWTaryfie=false);
noFlex(o=>o.planBUE=false);
noFlex(o=>o.odcinki[4].wylot='2027-11-13T17:00-03:00');
noFlex(o=>o.odcinki[5].przylot='2027-11-15T01:00+01:00');
noFlex(o=>o.odcinki[0].wylot='2027-11-04T19:00+01:00');
const bue=fixture(4000); bue.odcinki[2].wylot='2027-11-06T04:45-03:00';
assert.equal(flexRank(bue).compromise,true);
bue.odcinki[2].wylot='2027-11-06T04:44-03:00'; assert.equal(flexRank(bue).compromise,false);
const long=fixture(4000); long.odcinki[5].wylot='2027-11-14T21:00+01:00'; long.odcinki[5].przylot='2027-11-14T23:59+01:00';
assert.equal(flexRank(long).compromise,true);
long.odcinki[5].wylot='2027-11-14T21:01+01:00'; assert.equal(flexRank(long).compromise,false);
const duration=fixture(4000); duration.odcinki[0].wylot='2027-11-05T04:00+01:00';
assert.equal(flexRank(duration).compromise,true);
duration.odcinki[0].wylot='2027-11-05T03:59+01:00'; assert.equal(flexRank(duration).compromise,false);
const tooMany=flexFixture(); tooMany.odcinki[1].wylot='2027-11-05T14:45+01:00';
assert.equal(flexRank(tooMany).deviations.length,2);
tooMany.odcinki[2].wylot='2027-11-06T04:45-03:00'; assert.equal(flexRank(tooMany).compromise,false,'Trzy małe kompromisy też są odrzucane');
const expire=flexFixture(); assert.equal(flexRank(expire,[],R,B,Date.now()+25*36e5).compromise,false);
const past=flexFixture(); past.odcinki.forEach(l=>{l.wylot=l.wylot.replace('2027-11','2027-03');l.przylot=l.przylot.replace('2027-11','2027-03');});
assert.equal(flexRank(past).compromise,false);
const report=reportState({oferty:[flexFixture()]},R,B);
assert.equal(report.best,undefined); assert.equal(report.compromise.compromise,true); assert.match(report.headline,/z kompromisem/);
console.log('Super okazje: progi, granice czasów, najwyżej 2 odstępstwa, ochrona i wygasanie - OK');
