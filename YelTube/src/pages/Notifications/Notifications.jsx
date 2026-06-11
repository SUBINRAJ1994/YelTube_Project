import { useState, useEffect } from "react";
import "./Notifications.css";
import { FaBell, FaThumbsUp, FaComment, FaTrash, FaCheck, FaUserPlus, FaEnvelopeOpen } from "react-icons/fa";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "subscriptions",
    message: "Alex subscribed to your channel",
    read: false,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    type: "comments",
    message: "John commented: 'Outstanding explanation of React hooks! Thanks!'",
    read: false,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 3,
    type: "likes",
    message: "Emma liked your video: 'Build a YouTube Clone'",
    read: true,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  },
  {
    id: 4,
    type: "subscriptions",
    message: "Sarah Jenkins subscribed to your channel",
    read: true,
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadNotif = () => {
      let stored = JSON.parse(localStorage.getItem("notifications"));
      if (!stored || stored.length === 0) {
        localStorage.setItem("notifications", JSON.stringify(MOCK_NOTIFICATIONS));
        stored = MOCK_NOTIFICATIONS;
      }
      setNotifications(stored);
    };

    loadNotif();
    window.addEventListener("notifications_updated", loadNotif);
    return () => window.removeEventListener("notifications_updated", loadNotif);
  }, []);

  const saveNotifications = (updated) => {
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const markAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const deleteNotification = (e, id) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
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
