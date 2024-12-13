self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json(); // Parse the push event data as JSON
    data = JSON.parse(data); // Parse the JSON string
  }
  const title = data.title || "Notification";
  const options = {
    body: data.body || "You have a new message!",
    icon: "/icons/maskable_icon_x72.png", // Replace with your icon
    badge: "/icons/maskable_icon_x72.png", // Replace with your badge
  };
  console.log({options});
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
