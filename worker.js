let cacheName = 'viewtube-cache-v1';
let cacheUrls = [
    "404.html",
    "404.js",
    "bin/jquery-3.4.0.min.js",
    "bin/js.cookie.js",
    "bin/mustache.js",
    "bin/ripple.min.js",
    "channel/channel.js",
    "channel/index.html",
    "components/vt-channel-entry.html",
    "components/vt-error.html",
    "components/vt-header.html",
    "components/vt-loader-overlay.html",
    "components/vt-loader.html",
    "components/vt-play-btn.html",
    "components/vt-playlist-entry.html",
    "components/vt-show-more.html",
    "components/vt-tooltip.html",
    "components/vt-video-entry.html",
    "font/google-fonts.css",
    "font/material-icons.woff2",
    "font/righteous-latin-ext.woff2",
    "font/righteous-latin.woff2",
    "images/icon-192.jpg",
    "images/icon-192.png",
    "images/icon-256.jpg",
    "images/icon-256.png",
    "images/icon-512.jpg",
    "images/icon-512.png",
    "index.html",
    "index.js",
    "loader.js",
    "main.js",
    "manifest.json",
    "results/index.html",
    "results/search.js",
    "robots.txt",
    "style/main.css",
    "watch/index.html",
    "watch/video-player.js",
    "worker.js",
    "offline.html"
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(cacheUrls.map(value => value.url));
            })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(e.request)
                    .then(response => {
                        let responseToCache = response.clone();

                        caches.open(cacheName)
                            .then(cache => cache.put(e.request, responseToCache));

                        return response;
                    })
            })
            .catch(() => {
                return caches.match('offline.html');
            })
    )
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(key => {
                return caches.delete(key);
            }))
        })
    );
});