import "./Profile.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
<<<<<<< HEAD
import { FaCamera, FaTimes, FaUserEdit, FaRegSmile, FaCalendarAlt, FaTv } from "react-icons/fa";
import authService from "../../services/authService";
import videoService from "../../services/videoService";
=======
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

<<<<<<< HEAD
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
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerInput, setBannerInput] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bioInput, setBioInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const fetchStatsAndProfile = async () => {
    try {
      const profile = await authService.getCurrentUser();
      setUsername(profile.username);
      setProfileImage(profile.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random&color=fff&bold=true`);
      setBannerImage(profile.banner_image || "");
      setBio(profile.bio || "No bio added yet. Tell the YelTube community about yourself!");

      // Pre-populate input states
      setAvatarInput(profile.profile_pic || "");
      setBannerInput(profile.banner_image || "");
      setBioInput(profile.bio || "No bio added yet. Tell the YelTube community about yourself!");
      setUsernameInput(profile.username);

      const likedData = await videoService.getVideos();
      setLikedVideos(likedData.filter(v => v.user_reaction === "like"));

      const wlData = await videoService.getWatchLater();
      setWatchLater(wlData);

      const historyData = await videoService.getWatchHistory();
      setWatchHistory(historyData);

    } catch (err) {
      console.error("Error loading profile details:", err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchStatsAndProfile();
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
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

  // File uploading handlers
  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarInput(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBannerInput(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      if (avatarFile) {
        formData.append("profile_pic", avatarFile);
      }
      if (bannerFile) {
        formData.append("banner_image", bannerFile);
      }
      formData.append("bio", bioInput);

      const res = await videoService.updateStudioProfile(formData);
      setProfileImage(res.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&bold=true`);
      setBannerImage(res.banner_image || "");
      setBio(res.bio || "No bio added yet. Tell the YelTube community about yourself!");

      // Update local storage
      const updatedUser = {
        ...currentUser,
        profile_pic: res.profile_pic,
        banner_image: res.banner_image,
        bio: res.bio,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      setShowModal(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="profile-page">
<<<<<<< HEAD
      {/* Banner */}
      <div
        className="profile-banner"
        style={{
          background: bannerImage ? `url(${bannerImage}) center/cover no-repeat` : "linear-gradient(135deg, #1f1f2e 0%, #0c0c14 100%)"
=======
      <div
        className="profile-banner"
        style={{
          backgroundImage: bannerImage ? `url(${bannerImage})` : "",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#222"
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
        }}
      ></div>

      <div className="profile-content">
<<<<<<< HEAD
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
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
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

<<<<<<< HEAD
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
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
    </div>
  );
};

export default Profile;