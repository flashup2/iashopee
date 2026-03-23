importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCWnWWaxQ5H6Rzi6eda1wvYgtk60Hd6dxc",
  projectId: "iashopee7",
  messagingSenderId: "784750676949",
  appId: "1:784750676949:web:0582600dcdd645a79b8b5c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body } = payload.notification;
  self.registration.showNotification(title || 'Shopee Viral Pro', {
    body: body || 'Hora do envio agendado!',
    icon: 'https://img.icons8.com/color/192/shopee.png',
    vibrate: [200, 100, 200]
  });
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('https://iashopee-p7ve.vercel.app'));
});

// Agendamento local via message
self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SCHEDULE') {
    setTimeout(function() {
      self.registration.showNotification(e.data.title || 'Shopee Viral Pro ⏰', {
        body: e.data.body || 'Hora do envio!',
        icon: 'https://img.icons8.com/color/192/shopee.png',
        vibrate: [200, 100, 200],
        tag: e.data.id
      });
    }, e.data.delay);
  }
});
