import { useState, useEffect } from "react";
import "./Settings.css";
import { FaUser, FaSlidersH, FaLock, FaBell, FaPalette, FaTrashAlt, FaGlobe } from "react-icons/fa";

const Settings = ({ theme, setTheme }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState(localStorage.getItem("settings_lang") || "en");
  
  // Privacy preferences
  const [keepHistory, setKeepHistory] = useState(
    localStorage.getItem("settings_keepHistory") !== "false"
  );
  const [privateSubs, setPrivateSubs] = useState(
    localStorage.getItem("settings_privateSubs") === "true"
  );

  // Notification preferences
  const [notifyComments, setNotifyComments] = useState(
    localStorage.getItem("settings_notifyComments") !== "false"
  );
  const [notifySubscribers, setNotifySubscribers] = useState(
    localStorage.getItem("settings_notifySubscribers") !== "false"
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleUpdateAccount = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Name and email cannot be empty.");
      return;
    }

    const updatedUser = { ...currentUser, name, email };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) => (u.email === currentUser.email ? updatedUser : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    alert("Account settings updated successfully!");
    window.location.reload(); // Reload to update header/profile layouts
  };

  const handleToggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("settings_lang", lang);
  };

  const handleToggleHistory = () => {
    const val = !keepHistory;
    setKeepHistory(val);
    localStorage.setItem("settings_keepHistory", val);
  };

  const handleTogglePrivateSubs = () => {
    const val = !privateSubs;
    setPrivateSubs(val);
    localStorage.setItem("settings_privateSubs", val);
  };

  const handleToggleComments = () => {
    const val = !notifyComments;
    setNotifyComments(val);
    localStorage.setItem("settings_notifyComments", val);
  };

  const handleToggleSubscribers = () => {
    const val = !notifySubscribers;
    setNotifySubscribers(val);
    localStorage.setItem("settings_notifySubscribers", val);
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("ARE YOU SURE? This will delete your account permanently. All uploaded videos, playlists, and watch logs will remain, but you will be signed out.")) {
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.filter((u) => u.email !== currentUser.email);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    
    alert("Account deleted.");
    window.location.href = "/";
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h2>Settings</h2>
        <p className="settings-subtitle">Manage your account preferences and application settings.</p>

        <div className="settings-grid">
          {/* Theme & Styling */}
          <div className="settings-section">
            <h3 className="section-title">
              <FaPalette className="section-icon-settings" /> Appearance
            </h3>
            <div className="setting-control-row">
              <div>
                <h4>Dark Mode</h4>
                <p>Use a dark theme for low-light environments.</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={theme === "dark"} onChange={handleToggleTheme} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-control-row">
              <div>
                <h4>App Language</h4>
                <p>Choose your preferred language for menus.</p>
              </div>
              <div className="lang-selector">
                <FaGlobe className="select-globe" />
                <select value={language} onChange={handleLanguageChange}>
                  <option value="en">English</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="ja">日本語 (Japanese)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="settings-section">
            <h3 className="section-title">
              <FaLock className="section-icon-settings" /> Privacy & Security
            </h3>
            <div className="setting-control-row">
              <div>
                <h4>Keep watch history</h4>
                <p>Save watched videos to your personal History feed.</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={keepHistory} onChange={handleToggleHistory} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-control-row">
              <div>
                <h4>Keep my subscriptions private</h4>
                <p>Hide your subscribed channels list on your public channel.</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={privateSubs} onChange={handleTogglePrivateSubs} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <h3 className="section-title">
              <FaBell className="section-icon-settings" /> Notification Preferences
            </h3>
            <div className="setting-control-row">
              <div>
                <h4>Comment Activity</h4>
                <p>Notify me about replies, likes, or reports on my comments.</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifyComments} onChange={handleToggleComments} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-control-row">
              <div>
                <h4>Subscriber Alerts</h4>
                <p>Get notified when a new user subscribes to my channel.</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifySubscribers} onChange={handleToggleSubscribers} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* Account Profile Edit */}
          {currentUser && (
            <div className="settings-section wide-section">
              <h3 className="section-title">
                <FaUser className="section-icon-settings" /> Account Profile
              </h3>
              <form onSubmit={handleUpdateAccount} className="settings-form">
                <div className="form-group">
                  <label>Channel / Account Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="settings-save-btn">
                  Update Account
                </button>
              </form>

              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <p>Permanently delete your user profile and all associated data.</p>
                <button className="delete-account-btn" onClick={handleDeleteAccount}>
                  <FaTrashAlt /> Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
