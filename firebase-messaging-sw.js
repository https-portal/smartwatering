importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase (same config as your index.html)
firebase.initializeApp({
  apiKey: "AIzaSyDptVEqHvZqOF1deQrOpnhQI_w6Vb5n4zQ",
  authDomain: "watersystem-e444e.firebaseapp.com",
  databaseURL: "https://watersystem-e444e-default-rtdb.firebaseio.com",
  projectId: "watersystem-e444e",
  storageBucket: "watersystem-e444e.appspot.com",
  messagingSenderId: "528910169669",
  appId: "1:528910169669:web:05c99d2ca2e6d8c069952c",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Water System Alert';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon.png',      // your app icon
    badge: '/icon.png',     // optional small badge for mobile
    data: {
      url: '/'              // click opens your dashboard
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
