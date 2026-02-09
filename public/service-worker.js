self.addEventListener("install", () => {
    self.skipWaiting();
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.open("fortnite-wins").then((cache) =>
        cache.match(event.request).then(
          (response) => response || fetch(event.request)
        )
      )
    );
  });
  