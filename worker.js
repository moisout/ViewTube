let cacheName = 'viewtube-cache-v1';
let cacheUrls = [{
        "url": "404.html",
        "revision": "ec03a788263e88de903aad27266f90b8"
    },
    {
        "url": "404.js",
        "revision": "43218586b3a2d3460207e1d5c549a69e"
    },
    {
        "url": "bin/jquery-3.4.0.min.js",
        "revision": "475f3bdf8d1211c09e8b8f1d83539d27"
    },
    {
        "url": "bin/js.cookie.js",
        "revision": "d8f7daaf3cdc73a04124791fd24adb67"
    },
    {
        "url": "bin/mustache.js",
        "revision": "819421d6bda3df26a7bc1d2dad8a3ec0"
    },
    {
        "url": "bin/ripple.min.js",
        "revision": "e44f9a3550269f79f120531ce971c6f2"
    },
    {
        "url": "channel/channel.js",
        "revision": "238a563434bd6fa8fb5528728fc5de7a"
    },
    {
        "url": "channel/index.html",
        "revision": "5be6bbd7e079dc791f3dbdee1e90517f"
    },
    {
        "url": "components/vt-channel-entry.html",
        "revision": "40f1e6f580ba6f6690e0a51ba2f151f1"
    },
    {
        "url": "components/vt-error.html",
        "revision": "49418671f6a00d139d21a1f9fb1cb868"
    },
    {
        "url": "components/vt-header.html",
        "revision": "07cfe178ea0447e6a64554ed7450d1af"
    },
    {
        "url": "components/vt-loader-overlay.html",
        "revision": "0fc8d7ea4efa360bd32f7bb3b0766e33"
    },
    {
        "url": "components/vt-loader.html",
        "revision": "62247b9b2fe0ff298aeb98d92f210bea"
    },
    {
        "url": "components/vt-play-btn.html",
        "revision": "f551e95189fb4994275333677aa0f7c7"
    },
    {
        "url": "components/vt-playlist-entry.html",
        "revision": "a4c83545108e55e07abb70fdbe666182"
    },
    {
        "url": "components/vt-show-more.html",
        "revision": "f6e40ad63a44f8676f156180c1243589"
    },
    {
        "url": "components/vt-tooltip.html",
        "revision": "874573603a631e39b5a305045f42c08c"
    },
    {
        "url": "components/vt-video-entry.html",
        "revision": "1653a3b13e704ea27e21004cc84eaa69"
    },
    {
        "url": "font/google-fonts.css",
        "revision": "a231b999ac5dbf2e2775187554d42a16"
    },
    {
        "url": "font/material-icons.woff2",
        "revision": "d7e60f9d1433a45ed71817f6d23abeca"
    },
    {
        "url": "font/righteous-latin-ext.woff2",
        "revision": "88b9a2da8ccc0c4db39e44c22623b02f"
    },
    {
        "url": "font/righteous-latin.woff2",
        "revision": "2669249f36607a740d21ff026caca825"
    },
    {
        "url": "images/icon-192.jpg",
        "revision": "2a57145c0f0c08bd7c011225978d083f"
    },
    {
        "url": "images/icon-192.png",
        "revision": "2a57145c0f0c08bd7c011225978d083f"
    },
    {
        "url": "images/icon-256.jpg",
        "revision": "bb0b086f342549c72889c2f1d1bbdd1c"
    },
    {
        "url": "images/icon-256.png",
        "revision": "bb0b086f342549c72889c2f1d1bbdd1c"
    },
    {
        "url": "images/icon-512.jpg",
        "revision": "5f2a0963d2b366146c41248a6267b9c3"
    },
    {
        "url": "images/icon-512.png",
        "revision": "5f2a0963d2b366146c41248a6267b9c3"
    },
    {
        "url": "images/screenshots/Screenshot-Homepage.png",
        "revision": "a69aa67d3ee201b3b34bf9c8ce85217d"
    },
    {
        "url": "images/screenshots/Screenshot-Video.png",
        "revision": "3c0a894344f583ce277d7f40f903adca"
    },
    {
        "url": "index.html",
        "revision": "e529bf8df0303a952860a42c5d4a374b"
    },
    {
        "url": "index.js",
        "revision": "b55e60bbac0454beab85bb2ff9efe49e"
    },
    {
        "url": "loader.js",
        "revision": "8f34ec4832f7ea44c8bb4a014cda3d3f"
    },
    {
        "url": "main.js",
        "revision": "ec1f69638fafa2772e50227290c51cab"
    },
    {
        "url": "manifest.json",
        "revision": "2b78bd2ef7013230bb5648f7386fa86e"
    },
    {
        "url": "README.md",
        "revision": "a74e40a99f65788d15c0d7b2950e9756"
    },
    {
        "url": "results/index.html",
        "revision": "a1d2c80a040bb6a7382c5098eab908ff"
    },
    {
        "url": "results/search.js",
        "revision": "c695a43c485222c8a300aa696246906e"
    },
    {
        "url": "robots.txt",
        "revision": "4d3cbeebf38214307d4a3457dee987c6"
    },
    {
        "url": "style/_animations.scss",
        "revision": "cfd16176cd2640886d36453b84a3a322"
    },
    {
        "url": "style/_channel.scss",
        "revision": "19728623f3ff0893f80541f072beb900"
    },
    {
        "url": "style/_dark-theme.scss",
        "revision": "33c0e8cfa3e48c863430d9c15c3eab7d"
    },
    {
        "url": "style/_error.scss",
        "revision": "aafdb3afb5bb69284b1e0a9901e65657"
    },
    {
        "url": "style/_header.scss",
        "revision": "c7d0f5d07b14abb5614ad9effe3ff916"
    },
    {
        "url": "style/_light-theme.scss",
        "revision": "10e2e9df2027f98910de01c48c4be8e8"
    },
    {
        "url": "style/_player.scss",
        "revision": "4feef5d7a637e08143f91049165ac3cd"
    },
    {
        "url": "style/_ripple.scss",
        "revision": "84051ce71eae9841ee67e419db906f1e"
    },
    {
        "url": "style/_spinner.scss",
        "revision": "cd6a64e5edfba9c78e696088c05d4956"
    },
    {
        "url": "style/_style.scss",
        "revision": "8b40ff9385f07f9b4ed74d3db6048778"
    },
    {
        "url": "style/_variables.scss",
        "revision": "12028ff244d849fc819dd4f520615283"
    },
    {
        "url": "style/main.css",
        "revision": "2ddf7cf99d7d7fd5a40813d022266dc5"
    },
    {
        "url": "style/main.scss",
        "revision": "f266ff735ee2326c05b812369089fe26"
    },
    {
        "url": "watch/index.html",
        "revision": "dc10ebdf038fd2140846be81a746b4b9"
    },
    {
        "url": "watch/video-player.js",
        "revision": "3e512ce7600ffa83df9a7e4143cfc978"
    },
    {
        "url": "worker.js",
        "revision": "87f282c3b664514526e4ce20a3f86642"
    },
    {
        "url": "offline.html"
    }
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
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    let responseToCache = response.clone();

                    caches.open(cacheName)
                        .then(cache => cache.put(e.request, responseToCache));

                    return response
                })
                .catch(() => {
                    return caches.open(cacheName)
                        .then(cache => {
                            return cache.match('offline.html');
                        });
                });
        })
    )
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.forEach(element => {
                    return caches.delete(element);
                })
            );
        })
    );
});