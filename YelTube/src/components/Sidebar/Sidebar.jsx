import {
  FaHome,
  FaVideo,
  FaUser,
  FaHistory,
  FaFire,
  FaMusic,
  FaThumbsUp,
  FaUserFriends,
  FaGamepad,
  FaThumbsDown,
  FaFilm,
  FaClock,
  FaUpload,
  FaSignOutAlt,
  FaUserCircle,
  FaCog,
  FaStar,
  FaShieldAlt,
  FaUsers,
  FaPlusCircle,
  FaTv,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "./Sidebar.css";

const currentUser = JSON.parse(
  localStorage.getItem("currentUser")
);

const Sidebar = ({ sidebar }) => {

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

    <div
      className={
      sidebar
      ? "sidebar active"
      : "sidebar"
      }
    >

      <ul>

        <Link to="/" className="sidebar-link">
        <li>
          <FaHome className="sidebar-icon" />
          <span>Home</span>
        </li>
        </Link>

        <Link to="/trending" className="sidebar-link">
        <li>
          <FaFire className="sidebar-icon" />
          <span>Trending</span>
        </li>
        </Link>

        <Link to="/explore" className="sidebar-link">
        <li>
          <FaVideo className="sidebar-icon" />
          <span>Explore</span>
        </li>
        </Link>

        <Link to="/shorts" className="sidebar-link">
        <li>
          <FaFilm className="sidebar-icon" />
          <span>Shorts</span>
        </li>
        </Link>

        <Link to="/likedvideos" className="sidebar-link">
        <li>
          <FaThumbsUp className="sidebar-icon" />
          <span>Liked Videos</span>
        </li>
        </Link>

        <li>
          <FaThumbsDown className="sidebar-icon" />
          <span>Disliked Videos</span>
        </li>

        <Link to="/subscriptions" className="sidebar-link">
        <li>
          <FaUserFriends className="sidebar-icon" />
          <span>Subscriptions</span>
        </li></Link>

        <Link to="/community" className="sidebar-link">
        <li>
          <FaUsers className="sidebar-icon" />
          <span>Community</span>
        </li>
        </Link>

        <li>
          <FaGamepad className="sidebar-icon" />
          <span>Games</span>
        </li>
        
        <Link to="/history" className="sidebar-link">
          <li>
            <FaHistory className="sidebar-icon" />
            <span>History</span>
          </li>
        </Link>

        <Link to="/watchlater" className="sidebar-link">
        <li>
          <FaClock className="sidebar-icon" />
          <span>Watch Later</span>
        </li>
        </Link>

        <Link to="/premium" className="sidebar-link">
        <li>
          <FaStar className="sidebar-icon" style={{ color: "#ff9800" }} />
          <span>Premium</span>
        </li>
        </Link>

        <Link to="/settings" className="sidebar-link">
        <li>
          <FaCog className="sidebar-icon" />
          <span>Settings</span>
        </li>
        </Link>

        <hr />

        {
          currentUser ? (

            <>

              <li>

                <FaUserCircle
                  className="sidebar-icon"
                />

                <span>
                  {currentUser.name}
                </span>

              </li>

              <Link
                to="/upload"
                className="sidebar-link"
              >

                <li>

                  <FaUpload
                    className="sidebar-icon"
                  />

                  <span>
                    Upload
                  </span>

                </li>

              </Link>

              <Link
                to="/upload?category=Shorts"
                className="sidebar-link"
              >
                <li>
                  <FaPlusCircle className="sidebar-icon" />
                  <span>Create Short</span>
                </li>
              </Link>

              <Link
                to="/channel"
                className="sidebar-link"
              >
                <li>
                  <FaTv className="sidebar-icon" />
                  <span>Create Channel</span>
                </li>
              </Link>

              <Link to="/studio" className="sidebar-link">
                <li>
                  <FaVideo className="sidebar-icon" />
                  <span>Creator Studio</span>
                </li>
              </Link>

              <Link to="/admin" className="sidebar-link">
                <li>
                  <FaShieldAlt className="sidebar-icon" />
                  <span>Admin Panel</span>
                </li>
              </Link>

              <li
                onClick={handleLogout}
              >

                <FaSignOutAlt
                  className="sidebar-icon"
                />

                <span>
                  Logout
                </span>

              </li>

            </>

          ) : (

            <>

              <Link
                to="/login"
                className="sidebar-link"
              >

                <li>

                  <FaUser
                    className="sidebar-icon"
                  />

                  <span>
                    Login
                  </span>

                </li>

              </Link>

              <Link
                to="/register"
                className="sidebar-link"
              >

                <li>

                  <FaUserCircle
                    className="sidebar-icon"
                  />

                  <span>
                    Register
                  </span>

                </li>

              </Link>

            </>

          )
        }

      </ul>

    </div>

  );

};

export default Sidebar;