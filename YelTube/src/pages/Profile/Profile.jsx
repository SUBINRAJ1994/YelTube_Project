import "./Profile.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const Profile = () => {

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

  const likedVideos =
    JSON.parse(localStorage.getItem("likedVideos")) || [];

  const watchLater =
    JSON.parse(localStorage.getItem("watchLater")) || [];

  const watchHistory =
    JSON.parse(localStorage.getItem("watchHistory")) || [];

  const [profileImage, setProfileImage] =
    useState(
      localStorage.getItem("profileImage") ||
      "https://i.pravatar.cc/150"
    );

  const [bannerImage, setBannerImage] =
    useState(
      localStorage.getItem("bannerImage") ||
      ""
    );

  const [editing, setEditing] =
    useState(false);

  const handleProfileImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl =
        URL.createObjectURL(file);

      setProfileImage(imageUrl);

      localStorage.setItem(
        "profileImage",
        imageUrl
      );
    }
  };

  const handleBannerImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl =
        URL.createObjectURL(file);

      setBannerImage(imageUrl);

      localStorage.setItem(
        "bannerImage",
        imageUrl
      );
    }
  };

  if (!currentUser) {
    return <h2>Please Login</h2>;
  }

  return (
    <div className="profile-page">

      <div
        className="profile-banner"
        style={{
          backgroundImage:
            bannerImage
              ? `url(${bannerImage})`
              : ""
        }}
      >
      </div>

      <div className="profile-content">

        <img
          src={profileImage}
          alt="Profile"
          className="profile-avatar"
        />

        <h2>{currentUser.name}</h2>

        <p>{currentUser.email}</p>

        <span>1K Subscribers</span>

        <div className="profile-stats">

          <div className="stat-card">
            <h3>{likedVideos.length}</h3>
            <p>Liked Videos</p>
          </div>

          <div className="stat-card">
            <h3>{watchLater.length}</h3>
            <p>Watch Later</p>
          </div>

          <div className="stat-card">
            <h3>{watchHistory.length}</h3>
            <p>History</p>
          </div>

        </div>

        <button
          onClick={() =>
            setEditing(!editing)
          }
        >
          {editing ? "Close" : "Edit Profile"}
        </button>

        {editing && (
          <div className="edit-profile">

            <label>
              Profile Picture
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImage}
            />

            <label>
              Banner Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleBannerImage}
            />

          </div>
        )}

        <div className="profile-links">

          <Link to="/likedvideos">
            <button>Liked Videos</button>
          </Link>

          <Link to="/watchlater">
            <button>Watch Later</button>
          </Link>

          <Link to="/watchhistory">
            <button>History</button>
          </Link>
          <Link to="/playlist">
            <button>Playlist</button>
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Profile;