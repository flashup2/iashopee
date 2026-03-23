self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Shopee Viral Pro';
  const options = {
    body: data.body || 'Hora do envio agendado!',
    icon: 'https://img.icons8.com/color/192/shopee.png',
    badge: 'https://img.icons8.com/color/72/shopee.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE') {
    const { id, delay, title, body } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title || 'Shopee Viral Pro', {
        body: body || 'Hora do envio agendado!',
        icon: 'https://img.icons8.com/color/192/shopee.png',
        vibrate: [200, 100, 200],
        tag: id
      });
    }, delay);
  }
});
