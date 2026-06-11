export const pushNotification = (type, message) => {
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  const newNotif = {
    id: Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    type, // "likes", "comments", "subscriptions"
    message,
    read: false,
    timestamp: new Date().toISOString(),
  };
  notifications.unshift(newNotif);
  localStorage.setItem("notifications", JSON.stringify(notifications));
  
  // Trigger a custom event to notify listening components
  window.dispatchEvent(new Event("notifications_updated"));
};
