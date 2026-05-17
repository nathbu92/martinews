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

messaging.onBackgroundMessage(payload => {
  const { title, body, tag } = payload.data || {};
  self.registration.showNotification(title || 'WebRadio', {
    body: body || '',
    icon: '/favicon.ico',
    tag: tag || 'webradio',
    renotify: true,
    vibrate: [200, 100, 200]
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    if (cs.length) { cs[0].focus(); return; }
    clients.openWindow(self.location.origin);
  }));
});
