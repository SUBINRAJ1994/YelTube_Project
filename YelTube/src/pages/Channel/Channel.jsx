import { useState, useEffect, useRef } from "react";
import "./Channel.css";
import VideoCard from "../../components/VideoCard/VideoCard";
import { FaCamera, FaEdit, FaSave, FaPlusCircle, FaHeart, FaBell, FaPlayCircle } from "react-icons/fa";
import { Link, useLocation, useParams } from "react-router-dom";
import shortsData from "../../data/shortsData";
import authService from "../../services/authService";
import videoService from "../../services/videoService";
import playlistService from "../../services/playlistService";

const Channel = () => {
  const { username: routeUsername } = useParams();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  // Extract channel name from route params or search query (e.g., /channel?name=John)
  const params = new URLSearchParams(location.search);
  const targetChannelName = routeUsername || params.get("name");

  // Determine if viewing own channel
  const isOwnChannel = !targetChannelName || (currentUser && currentUser.username.toLowerCase() === targetChannelName.toLowerCase());

  // Load target user profile
  const [channelUser, setChannelUser] = useState(null);
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150");
  const [bannerImage, setBannerImage] = useState("");
  const [channelDesc, setChannelDesc] = useState("This is a YelTube channel dedicated to creating premium digital content.");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState("");

  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState(0);

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const fetchChannelData = async () => {
    try {
      let profile = null;
      if (isOwnChannel) {
        if (!currentUser) return;
        profile = await authService.getCurrentUser();
      } else {
        profile = await authService.getChannelProfile(targetChannelName);
      }

      setChannelUser(profile);
      if (!profile) return;

      const username = profile.username;
      setProfileImage(profile.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff`);
      setBannerImage(profile.banner_image || "");
      
      const defaultDesc = isOwnChannel 
        ? "This is your public YelTube channel. Customize this space to introduce yourself, link your social media, and show off your creative content."
        : `Welcome to the official YelTube channel of ${username}. Subscribe to stay updated!`;
      setChannelDesc(profile.bio || defaultDesc);
      setDescInput(profile.bio || defaultDesc);

      setSubscribers(profile.subscribers_count || 0);
      setIsSubscribed(profile.is_subscribed || false);

      // Load uploaded videos
      const userVideos = await videoService.getChannelVideos(username);
      setVideos(userVideos);

      // Filter user shorts
      const userShorts = userVideos.filter(v => v.category === "Shorts");
      if (userShorts.length > 0) {
        setShorts(userShorts);
      } else {
        setShorts(shortsData.slice(0, 3).map(s => ({ ...s, channel: username, views: "4.8K views" })));
      }

      // Load Playlists
      const userPlaylists = await playlistService.getChannelPlaylists(username);
      setPlaylists(userPlaylists);

    } catch (err) {
      console.error("Error loading channel data:", err);
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [targetChannelName, location.search]);

  if (!currentUser && isOwnChannel) {
    return (
      <div className="channel-page-empty">
        <h2>Please Login</h2>
        <p>You must be signed in to view and customize your channel.</p>
        <Link to="/login"><button className="login-redirect-btn">Login Now</button></Link>
      </div>
    );
  }

  if (!channelUser && !isOwnChannel) {
    return (
      <div className="channel-page-empty">
        <h2>Channel Not Found</h2>
        <p>The channel you are looking for does not exist on YelTube.</p>
        <Link to="/"><button className="login-redirect-btn">Go Home</button></Link>
      </div>
    );
  }

  // Subscribe Handler
  const handleSubscribe = async () => {
    if (!currentUser) {
      alert("Please log in to subscribe to channels.");
      return;
    }

    try {
      const res = await videoService.toggleSubscription(channelUser.id);
      setIsSubscribed(res.is_subscribed);
      setSubscribers(res.subscriber_count);
    } catch (err) {
      console.error("Error updating subscription:", err);
    }
  };

  // Profile Uploads
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("profile_pic", file);
      const res = await videoService.updateStudioProfile(formData);
      setProfileImage(res.profile_pic);
      const updatedUser = { ...currentUser, profile_pic: res.profile_pic };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error updating avatar:", err);
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("banner_image", file);
      const res = await videoService.updateStudioProfile(formData);
      setBannerImage(res.banner_image);
      const updatedUser = { ...currentUser, banner_image: res.banner_image };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error updating banner:", err);
    }
  };

  const handleSaveDesc = async () => {
    try {
      const formData = new FormData();
      formData.append("bio", descInput);
      const res = await videoService.updateStudioProfile(formData);
      setChannelDesc(res.bio);
      const updatedUser = { ...currentUser, bio: res.bio };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setIsEditingDesc(false);
    } catch (err) {
      console.error("Error saving channel bio:", err);
    }
  };

  return (
    <div className="channel-page">
      <input
        type="file"
        accept="image/*"
        ref={avatarInputRef}
        style={{ display: "none" }}
        onChange={handleAvatarChange}
      />
      <input
        type="file"
        accept="image/*"
        ref={bannerInputRef}
        style={{ display: "none" }}
        onChange={handleBannerChange}
      />

      {/* Banner */}
      <div
        className="channel-banner"
        style={{
          background: bannerImage ? `url(${bannerImage}) center/cover no-repeat` : "linear-gradient(135deg, #1f1f2e 0%, #0c0c14 100%)",
        }}
      >
        {isOwnChannel && (
          <button className="edit-banner-btn" onClick={() => bannerInputRef.current.click()} title="Upload banner">
            <FaCamera /> Update Banner
          </button>
        )}
      </div>

      {/* Profile Info Row */}
      <div className="channel-info-container">
        <div className="channel-avatar-wrap">
          <img src={profileImage} alt="Avatar" className="channel-avatar" />
          {isOwnChannel && (
            <button className="edit-avatar-overlay" onClick={() => avatarInputRef.current.click()} title="Update avatar">
              <FaCamera />
            </button>
          )}
        </div>

        <div className="channel-text-details">
          <h2>{channelUser.name}</h2>
          <p className="channel-handle">@{channelUser.name.toLowerCase().replace(/\s+/g, "")}</p>
          <div className="channel-meta-stats">
            <span><strong>{subscribers.toLocaleString()}</strong> Subscribers</span>
            <span className="dot">•</span>
            <span><strong>{videos.length}</strong> Videos</span>
          </div>

          <div className="channel-actions-row">
            {!isOwnChannel ? (
              <button 
                className={`subscribe-channel-btn ${isSubscribed ? "subscribed" : ""}`} 
                onClick={handleSubscribe}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            ) : (
              <div className="channel-owner-actions">
                <Link to="/studio"><button className="owner-action-btn studio-btn">Creator Studio</button></Link>
                <button className="owner-action-btn edit-btn" onClick={() => { setActiveTab("about"); setIsEditingDesc(true); }}>Edit Bio</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="channel-tabs">
        {[
          { id: "videos", label: "Videos" },
          { id: "shorts", label: "Shorts" },
          { id: "playlists", label: "Playlists" },
          { id: "about", label: "About" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`channel-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab contents */}
      <div className="channel-tab-content">
        {activeTab === "videos" && (
          <div className="channel-videos-grid">
            {videos.length === 0 ? (
              <div className="empty-channel-tab">
                <h3>No videos uploaded yet.</h3>
                {isOwnChannel && (
                  <Link to="/upload">
                    <button className="upload-channel-btn"><FaPlusCircle /> Upload Video</button>
                  </Link>
                )}
              </div>
            ) : (
              videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            )}
          </div>
        )}

        {activeTab === "shorts" && (
          <div className="channel-shorts-grid">
            {shorts.length === 0 ? (
              <div className="empty-channel-tab">
                <h3>No Shorts uploaded yet.</h3>
              </div>
            ) : (
              shorts.map((short) => (
                <div key={short.id} className="channel-short-card">
                  <div className="short-thumb-wrap">
                    <video src={short.video || short.videoUrl} muted preload="metadata" />
                    <div className="short-views-overlay">
                      <FaPlayCircle /> {short.views || "1.2K views"}
                    </div>
                  </div>
                  <h4>{short.title}</h4>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "playlists" && (
          <div className="channel-playlists-grid">
            {playlists.length === 0 ? (
              <div className="empty-channel-tab">
                <h3>No playlists created yet.</h3>
              </div>
            ) : (
              playlists.map((pl) => (
                <Link key={pl.id} to={`/playlists/${pl.id}`} className="playlist-channel-card">
                  <div className="pl-card-preview">
                    {pl.videos && pl.videos[0] ? (
                      <img src={pl.videos[0].thumbnail} alt="" className="pl-thumb" />
                    ) : (
                      <div className="pl-placeholder-box">Empty Playlist</div>
                    )}
                    <span className="pl-video-count">{pl.videos?.length || 0} videos</span>
                  </div>
                  <h4>{pl.name}</h4>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="channel-about-section">
            <div className="about-left-desc">
              <div className="desc-header-about">
                <h3>Description</h3>
                {isOwnChannel && (
                  <>
                    {!isEditingDesc ? (
                      <button className="edit-desc-icon-btn" onClick={() => setIsEditingDesc(true)}>
                        <FaEdit /> Edit
                      </button>
                    ) : (
                      <button className="save-desc-icon-btn" onClick={handleSaveDesc}>
                        <FaSave /> Save
                      </button>
                    )}
                  </>
                )}
              </div>

              {isEditingDesc ? (
                <textarea
                  className="about-textarea"
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  rows={6}
                />
              ) : (
                <p className="about-text-content">{channelDesc}</p>
              )}
            </div>

            <div className="about-right-stats">
              <h3>Stats</h3>
              <div className="about-stat-row">
                <span>Joined</span>
                <strong>June 2026</strong>
              </div>
              <div className="about-stat-row">
                <span>Subscribers</span>
                <strong>{subscribers.toLocaleString()}</strong>
              </div>
              <div className="about-stat-row">
                <span>Total Videos</span>
                <strong>{videos.length}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;