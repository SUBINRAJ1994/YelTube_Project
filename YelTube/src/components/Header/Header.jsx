import "./Header.css";
import {
  FaBars,
  FaSearch,
  FaBell,
  FaMicrophone,
  FaPlus,
  FaVideo,
  FaSignInAlt,
  FaSun,
  FaMoon,
  FaUser,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import staticVideos from "../../data/videos";
import notificationService from "../../services/notificationService";

function Header({
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  theme,
  setTheme
}) {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const POPULAR_SEARCHES = [
    "React",
    "React Tutorial",
    "React Hooks",
    "Subin Tech",
    "Django REST",
    "YouTube Clone",
    "HTML CSS Tutorial",
    "Vite JS"
  ];

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const uploaded = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
    const allTitles = [...uploaded, ...staticVideos].map((v) => v.title);
    const combined = [...new Set([...POPULAR_SEARCHES, ...allTitles])];
    const filtered = combined.filter((title) =>
      title.toLowerCase().includes(query)
    ).slice(0, 8);

    setSuggestions(filtered);
  }, [searchQuery]);

  const triggerSearch = (query) => {
    setSearchQuery(query);
    setShowSuggestions(false);
<<<<<<< HEAD
    navigate(`/results?search_query=${encodeURIComponent(query)}`);
=======
    navigate(`/search?q=${encodeURIComponent(query)}`);
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      if (suggestions.length === 0) return;
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        triggerSearch(suggestions[highlightedIndex]);
      } else {
        triggerSearch(searchQuery);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadNotifications = async () => {
    if (!currentUser) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "currentUser"
    );

    window.location.reload();

  };

  return (

    <header className="header">

      <div className="header-left">

        <FaBars
          className="menu-icon"
          onClick={toggleSidebar}
        />

        <Link to="/">
          <h2>YelTube</h2>
        </Link>

      </div>

      <div className="header-center">
        <div
          className="search-box-container"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
        >
          <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
            />
            <button className="search-btn" title="Search" onClick={() => triggerSearch(searchQuery)}>
              <FaSearch />
            </button>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="search-suggestions-dropdown">
              {suggestions.map((sug, index) => (
                <li
                  key={index}
                  className={`suggestion-item ${highlightedIndex === index ? "highlighted" : ""}`}
                  onMouseDown={() => {
                    triggerSearch(sug);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <FaSearch className="suggestion-search-icon" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="mic-btn" title="Search with your voice">
          <FaMicrophone />
        </button>
      </div>

      <div className="header-right">
        <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
            <Link to="/livestream">
        <button className="live-btn" title="Go Live">
          <FaVideo />
        </button>
        </Link> 
        <Link
          to={
            currentUser
            ? "/upload"
            : "/login"
          }
        >
          <button className="upload-btn" title="Upload video">
            <FaPlus className="upload-icon" />
          </button>
        </Link>
        <div className="notification-icon-container">
          <FaBell className="notification-icon" title="Notifications" onClick={toggleNotifications} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          {showNotifications && (
            <div className="notifications-dropdown">
              <h4>Notifications</h4>
              {notifications.length === 0 ? (
                <p className="no-notifications">No notifications yet</p>
              ) : (
                <>
                  {notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${notif.read ? "" : "unread"}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      {notif.message}
                    </div>
                  ))}
                  <Link
                    to="/notifications"
                    className="view-all-notifications"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        {currentUser ? (
          <div className="profile-section">

            <img
<<<<<<< HEAD
              src={localStorage.getItem(`profileImage_${currentUser.email.replace(/[@.]/g, "_")}`) || currentUser.avatar || "https://i.pravatar.cc/40"}
=======
              src={
                localStorage.getItem(`profileImage_${currentUser.email.replace(/[@.]/g, "_")}`) ||
                currentUser.avatar ||
                "https://i.pravatar.cc/40"
              }
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
              alt="Profile"
              className="profile-image"
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random&color=fff&bold=true`;
              }}
            />
            {
              showProfileMenu && (
                <div className="profile-dropdown">
                  <p className="profile-name"><b>
                    {currentUser.name}</b>
                  </p>
                  <Link to="/profile" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                    <button>
                      <FaUser /> Profile
                    </button>
                  </Link>
                  <Link to="/channel" onClick={() => setShowProfileMenu(false)}>
                    <button>
                      <FaVideo /> {currentUser.name}'s Channel
                    </button>
                  </Link>
                  <Link to="/settings" onClick={() => setShowProfileMenu(false)}>
                    <button>
                      <FaCog /> Settings
                    </button>
                  </Link>
                  <Link to="/admin" onClick={() => setShowProfileMenu(false)}>
                    <button>
                      <FaShieldAlt /> Admin Panel
                    </button>
                  </Link>
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )
            }
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn-link">
              <button title="Login" className="auth-btn">
                <FaUser className="auth-icon" /> Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;