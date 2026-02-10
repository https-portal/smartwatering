importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // optional
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
