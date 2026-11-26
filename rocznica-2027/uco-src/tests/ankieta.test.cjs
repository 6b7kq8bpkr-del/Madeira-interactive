const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const source = fs.readFileSync(path.resolve(__dirname, '../../../api/uco-ankieta.js'), 'utf8');
const CODE = 'test-only-not-a-real-code';
function fixture({barrier=false, failRead=false, failWrite=false}={}) {
  const store = new Map([['uco/ankieta.json', JSON.stringify({pary:{'Dawna para':{wybory:{hotel:'Lares'}}}})]]);
  let reads=0, writes=0, release;
  const gate = new Promise(resolve => release=resolve);
  const blob = {
    async get(key) {
      if (failRead) throw Error('storage secret details');
      const value=store.get(key);
      if (barrier && key==='uco/ankieta.json' && reads<2) { if (++reads===2) release(); await gate; }
      return value ? {statusCode:200, stream:value} : null;
    },
    async list({prefix}) { return {blobs:[...store.keys()].filter(k=>k.startsWith(prefix)).map(pathname=>({pathname})), hasMore:false}; },
    async put(key,value,options) { if (failWrite) throw Error('private token'); assert.equal(options.access,'private'); writes++; store.set(key,value); }
  };
  const sandbox={module:{exports:{}},require:n=>{if(n==='@vercel/blob')return blob;if(n==='node:crypto')return crypto;throw Error('Unexpected dependency '+n);},process:{env:{UCO_KOD:CODE}},Response,Buffer,Date};
  vm.runInNewContext(source,sandbox);
  async function call(body,headers={'x-uco-code':CODE},method=body?'POST':'GET') {
    const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(data){this.data=JSON.parse(JSON.stringify(data));return this;},end(){return this;}};
    await sandbox.module.exports({method,headers,body,query:{kod:CODE}},res);
    return res;
  }
  return {call,store,writes:()=>writes};
}
test('parallel writes preserve both pairs and the legacy answer',async()=>{
  const f=fixture({barrier:true});
  const results=await Promise.all(['Para A','Para B'].map(para=>f.call({para,wybory:{hotel:'Uco'}})));
  assert.deepEqual(results.map(r=>r.code),[200,200]);
  const r=await f.call(); assert.deepEqual(Object.keys(r.data.pary).sort(),['Dawna para','Para A','Para B']);
  assert.equal(f.writes(),2); assert.equal(JSON.parse(f.store.get('uco/ankieta.json')).pary['Dawna para'].wybory.hotel,'Lares');
});
test('update and withdrawal override legacy without deleting it',async()=>{
  const f=fixture(); await f.call({para:'Dawna para',wybory:{hotel:'Nowy'}});
  assert.equal((await f.call()).data.pary['Dawna para'].wybory.hotel,'Nowy');
  await f.call({para:'Dawna para',usun:true}); assert.deepEqual((await f.call()).data.pary,{});
  assert.ok(f.store.has('uco/ankieta.json'));
});
test('query/body codes are rejected; authenticated malformed input is controlled',async()=>{
  const f=fixture(); const r=await f.call({kod:CODE,para:'A',wybory:{a:'b'}},{});
  assert.equal(r.code,403); assert.equal(f.writes(),0);
  assert.equal((await f.call('{')).code,400);
  assert.equal((await f.call(null,{'x-uco-code':CODE,origin:'https://untrusted.example'})).code,403);
});
test('storage errors never return success or expose their message',async()=>{
  for (const option of [{failRead:true},{failWrite:true}]) {
    const f=fixture(option),r=await f.call({para:'A',wybory:{a:'b'}});
    assert.equal(r.code,503); assert.doesNotMatch(JSON.stringify(r.data),/token|secret/);
  }
});
test('repeated invalid authentication is throttled in the instance',async()=>{
  const f=fixture();for(let i=0;i<10;i++)assert.equal((await f.call(null,{'x-uco-code':'bad','x-forwarded-for':'test-ip'})).code,403);
  assert.equal((await f.call(null,{'x-uco-code':CODE,'x-forwarded-for':'test-ip'})).code,403);
  assert.equal((await f.call(null,{'x-uco-code':CODE,'x-forwarded-for':'other-test-ip'})).code,200);
});
