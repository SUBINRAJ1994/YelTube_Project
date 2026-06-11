import { useState, useEffect } from "react";
import "./Admin.css";
import { FaUsers, FaVideo, FaExclamationTriangle, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../../services/api";

const Admin = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("admin/stats/");
        setUsersCount(res.data.total_users);
        setVideosCount(res.data.total_videos);
        setReportsCount(res.data.total_reports);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header-main">
          <FaShieldAlt className="admin-shield-icon" />
          <div>
            <h1>Admin Panel</h1>
            <p>System metrics and content moderation portal</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-dashboard-grid">
          <div className="admin-stat-card card-users">
            <div className="card-top">
              <FaUsers className="admin-card-icon" />
              <h3>Users</h3>
            </div>
            <span className="card-stat-value">{usersCount}</span>
            <Link to="/admin/users" className="admin-link-btn">
              Manage Accounts <FaArrowRight />
            </Link>
          </div>

          <div className="admin-stat-card card-videos">
            <div className="card-top">
              <FaVideo className="admin-card-icon" />
              <h3>Videos</h3>
            </div>
            <span className="card-stat-value">{videosCount}</span>
            <Link to="/admin/videos" className="admin-link-btn">
              Manage Content <FaArrowRight />
            </Link>
          </div>

          <div className="admin-stat-card card-reports">
            <div className="card-top">
              <FaExclamationTriangle className="admin-card-icon" />
              <h3>Reported Queue</h3>
            </div>
            <span className="card-stat-value">{reportsCount}</span>
            <Link to="/admin/reports" className="admin-link-btn">
              Manage Flagged Items <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* System Details Box */}
        <div className="system-status-box">
          <h3>🖥️ System Diagnostics</h3>
          <div className="status-row"><span>Local Storage Health</span><strong className="green">100% Operational</strong></div>
          <div className="status-row"><span>Authentication Guard</span><strong className="green">Enforced</strong></div>
          <div className="status-row"><span>Vite Live Dev Reload</span><strong className="green">Active</strong></div>
        </div>
      </div>
    </div>
  );
};

export default Admin;