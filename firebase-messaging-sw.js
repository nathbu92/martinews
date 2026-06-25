importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyASoPn03y1OsIhfPmNA4oqtYdkIwkWBx6Y",
  authDomain: "webradio-martinews-notifs.firebaseapp.com",
  projectId: "webradio-martinews-notifs",
  storageBucket: "webradio-martinews-notifs.firebasestorage.app",
  messagingSenderId: "165465587608",
  appId: "1:165465587608:web:85feee28a4fb68bbf8f5ed"
});

const messaging = firebase.messaging();

// Background messages
messaging.onBackgroundMessage(payload => {
  const { title, body, tag } = payload.data || {};
  self.registration.showNotification(title || 'WebRadio', {
    body: body || '',
    icon: '/martinews/icon.png',
    tag: tag || 'webradio',
    renotify: true,
    vibrate: [200, 100, 200]
  });
});

// Messages depuis l'app (foreground) — affiche quand même la notif système
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'NOTIFY') {
    self.registration.showNotification(e.data.title || 'WebRadio', {
      body: e.data.body || '',
      icon: '/martinews/icon.png',
      tag: e.data.tag || 'webradio',
      renotify: true,
      vibrate: [200, 100, 200]
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    if (cs.length) { cs[0].focus(); return; }
    clients.openWindow('https://nathbu92.github.io/martinews/');
  }));
});
