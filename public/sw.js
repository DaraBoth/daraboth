self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  let data = {};
  if (event.data) {
    console.log(event.data)
    data = event.data.json(); // Parse the push event data as JSON
  }

  const title = data.title || "Notification";
  const options = {
    body: data.body || "You have a new message!",
    icon: data.icon || "/images/default-icon.png", // Replace with your icon
    badge: data.badge || "/images/default-badge.png", // Replace with your badge
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow("/");
      })
  );
});
