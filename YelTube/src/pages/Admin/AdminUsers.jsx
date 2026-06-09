import { useState, useEffect } from "react";
import "./Admin.css";
import { FaUserSlash, FaUserCheck, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(loaded);
  }, []);

  const toggleBanStatus = (email) => {
    const updated = users.map((u) => {
      if (u.email === email) {
        const newStatus = !u.banned;
        return { ...u, banned: newStatus };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));

    // If currentUser is banned, log them out
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.email === email) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
      alert("You have banned your own account! You will be logged out.");
      window.location.href = "/";
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-sub-header">
          <Link to="/admin" className="back-admin-btn"><FaChevronLeft /> Back to Dashboard</Link>
          <h2>Manage Users</h2>
        </div>

        <div className="admin-card-table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">No users registered in system.</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index} className="admin-row">
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td><span className="role-badge">Creator</span></td>
                    <td>
                      <span className={`status-badge ${user.banned ? "banned" : "active"}`}>
                        {user.banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`admin-action-btn ${user.banned ? "activate" : "ban"}`}
                        onClick={() => toggleBanStatus(user.email)}
                        title={user.banned ? "Reactivate User" : "Ban User"}
                      >
                        {user.banned ? (
                          <>
                            <FaUserCheck /> Reactivate
                          </>
                        ) : (
                          <>
                            <FaUserSlash /> Ban User
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
