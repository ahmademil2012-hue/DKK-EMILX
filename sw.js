self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'https://i.ibb.co.com/NnjZvt0M/logo.jpg',
      badge: 'https://i.ibb.co.com/NnjZvt0M/logo.jpg',
      vibrate: [100, 50, 100]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
