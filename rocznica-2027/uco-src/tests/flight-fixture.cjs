// Wyłącznie dane syntetyczne do testów. Nigdy nie publikować jako oferty.
module.exports = function fixture(price=4600) {
  const leg=(z,do_,wylot,przylot,rejs)=>({z,do:do_,wylot,przylot,linia:'Test',rejs,bilet:'A',bagazKg:23,kabinowy:true});
  return {id:'fixture',nazwa:'TEST - jeden bilet',dorosli:2,sprawdzono:new Date().toISOString(),url:'https://example.org/test',potwierdzonaULinii:true,kosztyKompletne:true,ochronaPotwierdzona:true,stopoverWTaryfie:true,planBUE:true,
    koszty:[{nazwa:'Test: komplet',plnPara:price*2,status:'potwierdzone',url:'https://example.org/test'}],
    odcinki:[
      leg('WAW','MAD','2027-11-05T10:00+01:00','2027-11-05T13:00+01:00','T1'),
      leg('MAD','EZE','2027-11-05T17:00+01:00','2027-11-06T02:00-03:00','T2'),
      leg('EZE','MDZ','2027-11-06T06:00-03:00','2027-11-06T08:00-03:00','T3'),
      leg('MDZ','AEP','2027-11-12T10:00-03:00','2027-11-12T12:00-03:00','T4'),
      leg('EZE','MAD','2027-11-13T20:00-03:00','2027-11-14T12:00+01:00','T5'),
      leg('MAD','WAW','2027-11-14T15:00+01:00','2027-11-14T18:00+01:00','T6')
    ]};
};
