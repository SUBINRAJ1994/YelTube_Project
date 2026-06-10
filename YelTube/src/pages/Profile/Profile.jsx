import "./Profile.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || [];
  const watchLater  = JSON.parse(localStorage.getItem("watchLater")) || [];
  const watchHistory = JSON.parse(localStorage.getItem("watchHistory")) || [];

  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150");
  const [bannerImage, setBannerImage] = useState("");
  const [bio, setBio] = useState("");
  
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    const emailKey = currentUser.email.replace(/[@.]/g, "_");
    
    const storedAvatar = localStorage.getItem(`profileImage_${emailKey}`);
    if (storedAvatar) setProfileImage(storedAvatar);
    
    const storedBanner = localStorage.getItem(`bannerImage_${emailKey}`);
    if (storedBanner) setBannerImage(storedBanner);

    const storedBio = localStorage.getItem(`channelDesc_${emailKey}`) || "No bio added yet.";
    setBio(storedBio);
    
    setNameInput(currentUser.name || "");
    setBioInput(storedBio !== "No bio added yet." ? storedBio : "");
  }, []);

  if (!currentUser) {
    return (
      <div className="profile-page-empty">
        <h2>Please Login</h2>
        <p>You must be logged in to view your profile page.</p>
        <Link to="/login"><button className="login-redirect-btn">Login Now</button></Link>
      </div>
    );
  }

  const emailKey = currentUser.email.replace(/[@.]/g, "_");

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        setProfileImage(dataUrl);
        localStorage.setItem(`profileImage_${emailKey}`, dataUrl);
        // Sync with Header
        localStorage.setItem(`profileImage_${currentUser.email}`, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        setBannerImage(dataUrl);
        localStorage.setItem(`bannerImage_${emailKey}`, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!nameInput.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    const updatedUser = { ...currentUser, name: nameInput };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) => (u.email === currentUser.email ? { ...u, name: nameInput } : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Save bio
    setBio(bioInput);
    localStorage.setItem(`channelDesc_${emailKey}`, bioInput);

    setEditing(false);
    alert("Profile updated successfully!");
    window.location.reload();
  };

  return (
    <div className="profile-page">
      <div
        className="profile-banner"
        style={{
          backgroundImage: bannerImage ? `url(${bannerImage})` : "",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#222"
        }}
      ></div>

      <div className="profile-content">
        <div className="avatar-stats-row">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-avatar"
          />
          <div className="profile-heading-details">
            <h2>{currentUser.name}</h2>
            <p className="profile-email-text">{currentUser.email}</p>
            <p className="profile-bio-text">{bio || "No bio added yet."}</p>
          </div>
        </div>

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
          className="edit-profile-trigger-btn"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel Editing" : "Edit Profile"}
        </button>

        {editing && (
          <div className="edit-profile-form">
            <h3>Edit Account Details</h3>
            
            <div className="edit-form-field">
              <label>Username</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>

            <div className="edit-form-field">
              <label>Bio / Description</label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={3}
                placeholder="Write a brief channel bio..."
              />
            </div>

            <div className="edit-form-field file-inputs-row">
              <div>
                <label>Change Profile Picture</label>
                <div className="edit-preview-avatar-wrap">
                  <img src={profileImage} alt="Avatar Preview" className="edit-preview-avatar" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImage}
                />
              </div>

              <div>
                <label>Change Banner Image</label>
                <div className="edit-preview-banner-wrap">
                  {bannerImage ? (
                    <img src={bannerImage} alt="Banner Preview" className="edit-preview-banner" />
                  ) : (
                    <div className="edit-preview-banner-placeholder">No Banner Uploaded</div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImage}
                />
              </div>
            </div>

            <button className="save-profile-btn" onClick={handleSaveProfile}>
              Save Profile Changes
            </button>
          </div>
        )}

        <div className="profile-links-section">
          <h3>Quick Links</h3>
          <div className="profile-links">
            <Link to="/likedvideos">
              <button>Liked Videos</button>
            </Link>

            <Link to="/watchlater">
              <button>Watch Later</button>
            </Link>

            <Link to="/watchhistory">
              <button>Watch History</button>
            </Link>
            
            <Link to="/playlists">
              <button>My Playlists</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;