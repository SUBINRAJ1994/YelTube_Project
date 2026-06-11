import { useState, useEffect } from "react";
import "./Notifications.css";
import { FaBell, FaThumbsUp, FaComment, FaTrash, FaCheck, FaUserPlus, FaEnvelopeOpen } from "react-icons/fa";
import notificationService from "../../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener("notifications_updated", loadNotifications);
    return () => window.removeEventListener("notifications_updated", loadNotifications);
  }, []);

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    if (filter === "subscriptions") return n.type === "subscriptions";
    if (filter === "comments") return n.type === "comments";
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "subscriptions":
        return <FaUserPlus className="notif-icon sub-type" />;
      case "comments":
        return <FaComment className="notif-icon comment-type" />;
      case "likes":
        return <FaThumbsUp className="notif-icon like-type" />;
      default:
        return <FaBell className="notif-icon default-type" />;
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const diffMs = Date.now() - date.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    if (diffHrs < 1) {
      const mins = Math.floor(diffMs / 60000);
      return mins <= 1 ? "Just now" : `${mins}m ago`;
    }
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const days = Math.floor(diffHrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header */}
        <div className="notif-header">
          <div className="notif-header-left">
            <FaBell className="bell-title-icon" />
            <div>
              <h2>Notifications</h2>
              <p>{notifications.filter((n) => !n.read).length} unread notifications</p>
            </div>
          </div>
          {notifications.some((n) => !n.read) && (
            <button className="mark-read-btn" onClick={markAllAsRead}>
              <FaCheck /> Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="notif-filters">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "subscriptions", label: "Subscriptions" },
            { id: "comments", label: "Comments" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`filter-tab ${filter === tab.id ? "active" : ""}`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="notif-list">
          {filteredNotifications.length === 0 ? (
            <div className="notif-empty">
              <FaEnvelopeOpen className="empty-notif-icon" />
              <h3>All caught up!</h3>
              <p>No notifications in this category.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-card ${notif.read ? "read" : "unread"}`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                <div className="notif-card-left">
                  {getIcon(notif.type)}
                  <div className="notif-content">
                    <p className="notif-message">{notif.message}</p>
                    <span className="notif-time">{formatTime(notif.timestamp)}</span>
                  </div>
                </div>
                <div className="notif-actions">
                  {!notif.read && (
                    <button
                      className="notif-action-btn read-btn"
                      title="Mark as read"
                      onClick={() => markAsRead(notif.id)}
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    className="notif-action-btn delete-btn"
                    title="Delete notification"
                    onClick={(e) => deleteNotification(e, notif.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
