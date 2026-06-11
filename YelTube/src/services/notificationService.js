import API from "./api";

const transformNotification = (n) => {
  if (!n) return null;
  return {
    id: n.id,
    type: n.notification_type === "subscription" ? "subscriptions" : n.notification_type + "s", // map to UI expected types
    message: n.message,
    read: n.is_read,
    timestamp: n.created_at,
  };
};

const notificationService = {
  getNotifications: async () => {
    const response = await API.get("notifications/");
    return (response.data || []).map(transformNotification);
  },
  markAllAsRead: async () => {
    const response = await API.post("notifications/mark-read/");
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await API.post(`notifications/mark-read/${id}/`);
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await API.delete(`notifications/delete/${id}/`);
    return response.data;
  },
};

export default notificationService;
