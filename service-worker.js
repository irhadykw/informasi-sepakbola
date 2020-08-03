importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '1' },
  { url: '/navigasi.html', revision: '1' },
  { url: '/detail-klub.html', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/css/style.css', revision: '1' },
  { url: '/js/api.js', revision: '1' },
  { url: '/js/db.js', revision: '1' },
  { url: '/js/get-teambyid.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/navigasi.js', revision: '1' },
  { url: '/js/push-permission.js', revision: '1' },
  { url: '/js/register-sw.js', revision: '1' },
  { url: '/manifest.json', revision: '1' }
],
  {
    ignoreUrlParametersMatching: [/.*/]
  }
);

workbox.routing.registerRoute(    
  new RegExp('/'),
  workbox.strategies.staleWhileRevalidate()
);

// Menyimpan cache untuk file font selama 1 tahun
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// Menyimpan file google font
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Menyimpan semua file yang bersumber dari folder pages
// ke dalam chaceName 'pages'
workbox.routing.registerRoute(
  new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

// menyimpan semua file gambar dari folder images
workbox.routing.registerRoute(
  new RegExp('/images/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'images'
    })
);

// menyimpan data API
workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
    cacheExpiration: {
          maxAgeSeconds: 60 * 30 //cache diperbarui setiap 30 menit
    }
  })
);


self.addEventListener('push', (event) => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    icon: './images/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Pesan Notifikasi', options)
  );
});