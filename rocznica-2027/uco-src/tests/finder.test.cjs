const assert = require('node:assert/strict');
const {filterLeads, fresh, safeURL} = require('../../uco/finder.js');
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
console.log('Wyszukiwarka: filtry, aktualność i bezpieczne linki - OK');
