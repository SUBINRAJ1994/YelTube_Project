import "./Profile.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCamera, FaTimes, FaUserEdit, FaRegSmile, FaCalendarAlt, FaTv } from "react-icons/fa";

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const emailKey = currentUser ? currentUser.email.replace(/[@.]/g, "_") : "";

  const [likedVideos, setLikedVideos] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  
  // Custom user profile states
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150");
  const [bannerImage, setBannerImage] = useState("");
  const [bio, setBio] = useState("No bio added yet. Tell the YelTube community about yourself!");
  const [username, setUsername] = useState("");
  
  // Modal toggle state
  const [showModal, setShowModal] = useState(false);
  
  // Form input states
  const [avatarInput, setAvatarInput] = useState("");
  const [bannerInput, setBannerInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    
    // Load lists
    setLikedVideos(JSON.parse(localStorage.getItem("likedVideos")) || []);
    setWatchLater(JSON.parse(localStorage.getItem("watchLater")) || []);
    setWatchHistory(JSON.parse(localStorage.getItem("watchHistory")) || []);

    // Load custom profile properties
    const storedAvatar = localStorage.getItem(`profileImage_${emailKey}`);
    if (storedAvatar) setProfileImage(storedAvatar);
    else if (currentUser.avatar) setProfileImage(currentUser.avatar);

    const storedBanner = localStorage.getItem(`bannerImage_${emailKey}`);
    if (storedBanner) setBannerImage(storedBanner);

    const storedBio = localStorage.getItem(`bio_${emailKey}`);
    if (storedBio) setBio(storedBio);

    setUsername(currentUser.name);
    
    // Pre-populate input states
    setAvatarInput(storedAvatar || currentUser.avatar || "");
    setBannerInput(storedBanner || "");
    setBioInput(storedBio || "No bio added yet. Tell the YelTube community about yourself!");
    setUsernameInput(currentUser.name);
  }, []);

  if (!currentUser) {
    return (
      <div className="profile-page-empty">
        <h2>Please Login</h2>
        <p>Log in to view and customize your YelTube profile.</p>
        <Link to="/login"><button className="login-btn">Login Now</button></Link>
      </div>
    );
  }

  // File uploading handlers
  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarInput(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBannerInput(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (!usernameInput.trim()) {
      alert("Username cannot be empty");
      return;
    }

    // Save states
    setProfileImage(avatarInput);
    setBannerImage(bannerInput);
    setBio(bioInput);
    setUsername(usernameInput);

    // Save to localStorage
    localStorage.setItem(`profileImage_${emailKey}`, avatarInput);
    localStorage.setItem(`bannerImage_${emailKey}`, bannerInput);
    localStorage.setItem(`bio_${emailKey}`, bioInput);

    // Update currentUser object
    const updatedUser = {
      ...currentUser,
      name: usernameInput,
      avatar: avatarInput,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) => {
      if (u.email === currentUser.email) {
        return { ...u, name: usernameInput, avatar: avatarInput };
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Synchronize avatar key inside other components
    localStorage.setItem(`profileImage_${currentUser.email}`, avatarInput);

    setShowModal(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-page">
      {/* Banner */}
      <div
        className="profile-banner"
        style={{
          background: bannerImage ? `url(${bannerImage}) center/cover no-repeat` : "linear-gradient(135deg, #1f1f2e 0%, #0c0c14 100%)"
        }}
      >
      </div>

      <div className="profile-content">
        <div className="profile-header-card">
          <img
            src={profileImage}
            alt="Profile Avatar"
            className="profile-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&bold=true`;
            }}
          />
          <div className="profile-user-info">
            <h2>{username}</h2>
            <p className="profile-email">{currentUser.email}</p>
            <p className="profile-bio-text"><FaRegSmile className="bio-icon" /> {bio}</p>
            <div className="profile-badge-row">
              <span className="profile-badge"><FaCalendarAlt /> Joined June 2026</span>
              <span className="profile-badge"><FaTv /> Creator Channel</span>
            </div>
            
            <button className="edit-profile-trigger" onClick={() => setShowModal(true)}>
              <FaUserEdit /> Edit Profile
            </button>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="profile-stats">
          <div className="stat-card blue">
            <h3>{likedVideos.length}</h3>
            <p>Liked Videos</p>
          </div>
          <div className="stat-card purple">
            <h3>{watchLater.length}</h3>
            <p>Watch Later</p>
          </div>
          <div className="stat-card red">
            <h3>{watchHistory.length}</h3>
            <p>History Videos</p>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="profile-links">
          <Link to="/likedvideos">
            <button className="profile-nav-btn">Liked Videos</button>
          </Link>
          <Link to="/watchlater">
            <button className="profile-nav-btn">Watch Later</button>
          </Link>
          <Link to="/history">
            <button className="profile-nav-btn">Watch History</button>
          </Link>
          <Link to="/playlists">
            <button className="profile-nav-btn">My Playlists</button>
          </Link>
        </div>
      </div>

      {/* Edit Profile Overlay Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="edit-profile-modal">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Username Edit */}
              <div className="modal-field">
                <label>Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter username"
                />
              </div>

              {/* Bio Edit */}
              <div className="modal-field">
                <label>Biography</label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              {/* Avatar Image Edit */}
              <div className="modal-field file-field">
                <label>Change Avatar Picture</label>
                <div className="file-input-preview-group">
                  <div className="preview-wrap avatar">
                    <img src={avatarInput || "https://i.pravatar.cc/150"} alt="Avatar Preview" />
                  </div>
                  <div className="file-input-wrap">
                    <button className="file-choose-btn" onClick={() => document.getElementById("avatar-file-picker").click()}>
                      <FaCamera /> Choose Image
                    </button>
                    <input
                      type="file"
                      id="avatar-file-picker"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      style={{ display: "none" }}
                    />
                    <span className="file-name-hint">Max 2MB. Square ratio recommended.</span>
                  </div>
                </div>
              </div>

              {/* Banner Image Edit */}
              <div className="modal-field file-field">
                <label>Change Banner Image</label>
                <div className="file-input-preview-group">
                  <div className="preview-wrap banner" style={{ background: bannerInput ? `url(${bannerInput}) center/cover` : "#333" }}>
                    {!bannerInput && "Default Gradient"}
                  </div>
                  <div className="file-input-wrap">
                    <button className="file-choose-btn" onClick={() => document.getElementById("banner-file-picker").click()}>
                      <FaCamera /> Choose Image
                    </button>
                    <input
                      type="file"
                      id="banner-file-picker"
                      accept="image/*"
                      onChange={handleBannerFile}
                      style={{ display: "none" }}
                    />
                    <span className="file-name-hint">Recommended ratio 16:9 or wider.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;