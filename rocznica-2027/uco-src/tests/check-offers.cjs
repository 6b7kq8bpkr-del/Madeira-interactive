// Kontrola prawdziwych danych raportu, bez sieci i transakcji.
const assert=require('node:assert/strict');
const {rank}=require('../../uco/flight-rules.js');
const P=require('../data/program.json'), M=require('../../uco/loty.json');
assert.ok(Array.isArray(M.oferty));
const now=Date.parse(M.raport.data+'T23:59:59+01:00');
if (M.raport.calosc != null) {
 const r=rank(M.oferty,P.loty.monitoring.reguly,P.budzet,now).find(x=>x.id===M.raport.ofertaId);
 assert.ok(r && r.ready, 'raport.calosc wymaga poprawnej oferty w dniu raportu');
 assert.equal(M.raport.typCeny,'potwierdzona');
 assert.equal(M.raport.calosc, Math.round(r.cena/10)*10);
}
if (/^[🎯🟢]/u.test(M.raport.werdykt)) assert.ok(M.raport.calosc > 0, 'werdykt kupna bez oferty');
console.log('OK: raport nie myli szacunku z ofertą');
