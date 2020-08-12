  const PRECACHE = "static-cache-v2";
  const RUNTIME = "data-cache-v1";
const FILES_TO_CACHE = [
    "/index.html",
    "/index.js",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
  ];
  //store transaction name, transaction amount, +/-

  
  self.addEventListener("install", event => {
    event.waitUntil(
      caches.open(PRECACHE)
        .then(cache => {
          return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
  });
  
  self.addEventListener("fetch", event => {
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(RUNTIME).then(cachedResponse => {
          return fetch(event.request)
            .then(response =>{
              if(response.status === 200){
                cachedResponse.put(event.request.url, response.clone());
              }
              return response;
            }).catch(err =>{
              return cachedResponse.match(event.request);
            });
          }).catch(err => console.log(err))
        );
          return;
      }
      
      });
        
  
  // The activate handler takes care of cleaning up old caches.
  self.addEventListener("activate", event => {
    event.waitUntil(
      caches.keys().then(list => {
        return Promise.all(
          list.map(item =>{
            if(item!== PRECACHE && item!== RUNTIME){
              return caches.delete(item);
            }
          })
        );
      })
    );
  self.clients.claim();
  });
  
  