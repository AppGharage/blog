const cacheName = 'appgharage-blog';
const cacheVersion = `${cacheName}::1.0.0`;

const cachedFiles = [
    '/',
    '/css/responsive.layout.css',
    '/css/styles.layout.css',
    '/css/responsive.single-post.css',
    '/css/styles.single-post.css',
    '/css/bootstrap.css',
    '/css/ionicons.css',
    '/css/swiper.css',
    '/js/bootstrap.js',
    '/js/jquery-3.1.1.min.js',
    '/js/script.js',
    '/js/swiper.js',
    '/js/tether.min.js'
];

const networkFiles = [];

self.addEventListener('install', event => {

    console.log('[pwa install]');

    event.waitUntil(
        caches.open(cacheVersion)
        .then(cache => cache.addAll(cachedFiles))
    );

});

self.addEventListener('activate', event => {

    console.log('[pwa activate]');

    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key.indexOf(cacheName) === 0 && key !== cacheVersion)
                .map(key => caches.delete(key))
            )
        )
    );

    return self.clients.claim();

});

self.addEventListener('fetch', event => {

    if (networkFiles.filter(item => event.request.url.match(item)).length) {

        console.log('[network fetch]', event.request.url);

        event.respondWith(
            caches.match(event.request)
            .then(response => response || fetch(event.request))
        );

    } else {

        console.log('[pwa fetch]', event.request.url);

        event.respondWith(
            caches.match(event.request)
            .then(response => {

                caches.open(cacheVersion).then(cache => cache.add(event.request.url));

                return response || fetch(event.request);

            })
        );

    }

});