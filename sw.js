// Mat1a offline: åbn altid straks fra den gemte kopi, og hent en nyere version i baggrunden, når der er net.
// GitHub Pages lader browseren gemme filer i 10 min., så nye versioner hentes udenom browserens cache (cache:'reload'/'no-cache').
const CACHE='mat1a-d8c21c3c63';
const FILES=['./','index.html','app.bin','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mat1a-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll({type:'window'})).then(cs=>cs.forEach(c=>c.postMessage({type:'mat1a-update'}))))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  const key=r.mode==='navigate'?'./':new URL(r.url).pathname.split('/').pop()||'./';
  e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(key,{ignoreSearch:true});
    const net=fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok)c.put(key,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return (await net)||new Response('Offline',{status:503})}))});
