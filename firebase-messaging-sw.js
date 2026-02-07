importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDptVEqHvZqOF1deQrOpnhQI_w6Vb5n4zQ",
  authDomain: "watersystem-e444e.firebaseapp.com",
  projectId: "watersystem-e444e",
  messagingSenderId: "528910169669",
  appId: "1:528910169669:web:05c99d2ca2e6d8c069952c"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png"  // replace with your icon path
  });
});
