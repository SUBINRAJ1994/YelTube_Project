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

        <li>
          <FaFire className="sidebar-icon" />
          <span>Trending</span>
        </li>

        <li>
          <FaMusic className="sidebar-icon" />
          <span>Music</span>
        </li>

        <li>
          <FaVideo className="sidebar-icon" />
          <span>Video</span>
        </li>

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

        <Link to="/subscriptions">
        <li>
          <FaUserFriends className="sidebar-icon" />
          <span>Subscriptions</span>
        </li></Link>

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