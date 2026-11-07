// Mat1a offline: åbn altid straks fra den gemte kopi, og hent en nyere version i baggrunden, når der er net.
const CACHE='mat1a-9d3d99fae0';
const FILES=['./','index.html','app.bin','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mat1a-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  const key=r.mode==='navigate'?'./':new URL(r.url).pathname.split('/').pop()||'./';
  e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(key,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res.ok)c.put(key,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return (await net)||new Response('Offline',{status:503})}))});
