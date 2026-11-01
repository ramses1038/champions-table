const V='ct-v7';
const SHELL=['./','index.html','jszip.min.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin&&(r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html'))){
    // 앱 화면: 인터넷이 되면 새 버전, 안 되면 저장본
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(ca=>ca.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
  // 나머지(글꼴 포함): 저장본 먼저, 없으면 받아서 저장
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(V).then(ca=>ca.put(r,c))}return res})))
});
