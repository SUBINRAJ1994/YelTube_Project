import "./Header.css";

import {
  FaBars,
  FaSearch,
  FaBell,
  FaMicrophone,
  FaPlus,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { useState } from "react";

function Header({
  toggleSidebar,
  searchQuery,
  setSearchQuery
}) {

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [showProfileMenu,
  setShowProfileMenu] =
  useState(false);

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

        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(
              e.target.value
            )
          }
        />

        <button className="search-btn">
          <FaSearch />
        </button>

        <button className="mic-btn">
          <FaMicrophone />
        </button>

      </div>

      <div className="header-right">

        <Link
          to={
            currentUser
            ? "/upload"
            : "/login"
          }
        >
          <button className="upload-btn">
            <FaPlus className="upload-icon" />
          </button>
        </Link>
        <FaBell className="notification-icon" />
        {currentUser ? (
          <div className="profile-section">

            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="profile-image"
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
            />
            {
              showProfileMenu && (
                <div className="profile-dropdown">
                  <p className="profile-name">
                    {currentUser.name}
                  </p>
                  <Link to="/profile" className="dropdown-link">
                    <button>
                    Profile
                    </button>
                  </Link>
                  <Link to="/channel">
                  <button>{currentUser.name}'s Channel</button>
                  </Link>
                  <button
                  onClick={handleLogout}
                  >
                  Logout
                  </button>
                </div>
              )
            }
          </div>
        ) : (
          <div className="auth-buttons">

            <Link to="/login">
              <button>
                Login
              </button>
            </Link>

            <Link to="/register">
              <button>
                Register
              </button>
            </Link>

          </div>

        )}
      </div>
    </header>
  );
}
export default Header;