// Mat1a offline: gem appen på telefonen, og hent en nyere version i baggrunden, når der er net.
const CACHE='mat1a-a0b146449f';
const FILES=['./','index.html','app.bin','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mat1a-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  // net først (så nye versioner kommer med), ellers den gemte kopi
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r.mode==='navigate'?'./':r,cp))}return res}).catch(()=>caches.match(r.mode==='navigate'?'./':r,{ignoreSearch:true}).then(m=>m||caches.match(r,{ignoreSearch:true}))))});
