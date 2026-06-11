import { useState, useEffect, useRef } from "react";
import "./Channel.css";
import VideoCard from "../../components/VideoCard/VideoCard";
import { FaCamera, FaEdit, FaSave, FaPlusCircle, FaHeart, FaBell, FaPlayCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import shortsData from "../../data/shortsData";

const Channel = () => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  // Extract channel name from search query (e.g., /channel?name=John)
  const params = new URLSearchParams(location.search);
  const targetChannelName = params.get("name");

  // Determine if viewing own channel
  const isOwnChannel = !targetChannelName || (currentUser && currentUser.name.toLowerCase() === targetChannelName.toLowerCase());

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
  const [subscribers, setSubscribers] = useState(1200);

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    // 1. Identify which channel user to load
    let activeUser = null;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    if (isOwnChannel) {
      if (currentUser) {
        activeUser = currentUser;
      }
    } else {
      activeUser = users.find(u => u.name.toLowerCase() === targetChannelName.toLowerCase());
      if (!activeUser) {
        // Fallback mock user if channel name doesn't exist in registered users
        activeUser = {
          name: targetChannelName,
          email: `${targetChannelName.toLowerCase().replace(/\s+/g, "")}@example.com`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(targetChannelName)}&background=00bcd4&color=fff&bold=true`
        };
      }
    }

    setChannelUser(activeUser);
    if (!activeUser) return;

    const emailKey = activeUser.email.replace(/[@.]/g, "_");

    // Load profile images
    const storedAvatar = localStorage.getItem(`profileImage_${emailKey}`);
    setProfileImage(storedAvatar || activeUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser.name)}&background=random&color=fff`);

    const storedBanner = localStorage.getItem(`bannerImage_${emailKey}`);
    setBannerImage(storedBanner || "");

    // Load Description
    const storedDesc = localStorage.getItem(`channelDesc_${emailKey}`);
    const defaultDesc = isOwnChannel 
      ? "This is your public YelTube channel. Customize this space to introduce yourself, link your social media, and show off your creative content."
      : `Welcome to the official YelTube channel of ${activeUser.name}. Subscribe to stay updated!`;
    setChannelDesc(storedDesc || defaultDesc);
    setDescInput(storedDesc || defaultDesc);

    // Load subscriber count
    const storedSubs = localStorage.getItem(`subs_count_${emailKey}`);
    if (storedSubs) {
      setSubscribers(parseInt(storedSubs, 10));
    } else {
      const randomSubs = Math.floor(Math.random() * 4500) + 120;
      setSubscribers(randomSubs);
      localStorage.setItem(`subs_count_${emailKey}`, randomSubs);
    }

    // Load subscription status (for logged-in user checking this channel)
    if (currentUser) {
      const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];
      setIsSubscribed(subscriptions.includes(activeUser.name));
    }

    // Load uploaded videos
    const uploaded = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
    const blacklist = JSON.parse(localStorage.getItem("deletedVideoIds")) || [];
    
    // Filter videos where video channel matches this active user
    const userVideos = uploaded.filter(v => v.channel === activeUser.name && !blacklist.includes(v.id));
    setVideos(userVideos);

    // Filter user shorts (videos categorized as Shorts, plus mock items if empty)
    const userShorts = userVideos.filter(v => v.category === "Shorts");
    if (userShorts.length > 0) {
      setShorts(userShorts);
    } else {
      // Load a subset of default shorts labeled as creator's shorts for premium preview
      setShorts(shortsData.slice(0, 3).map(s => ({ ...s, channel: activeUser.name, views: "4.8K views" })));
    }

    // Load Playlists
    const allPlaylists = JSON.parse(localStorage.getItem("playlists")) || [];
    // Show playlists containing videos or mock user playlists
    setPlaylists(allPlaylists);

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

  if (!channelUser) {
    return (
      <div className="channel-page-empty">
        <h2>Channel Not Found</h2>
        <p>The channel you are looking for does not exist on YelTube.</p>
        <Link to="/"><button className="login-redirect-btn">Go Home</button></Link>
      </div>
    );
  }

  const emailKey = channelUser.email.replace(/[@.]/g, "_");

  // Subscribe Handler
  const handleSubscribe = () => {
    if (!currentUser) {
      alert("Please log in to subscribe to channels.");
      return;
    }

    let subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];
    let updatedSubs = [...subscriptions];
    let newSubCount = subscribers;

    if (isSubscribed) {
      updatedSubs = updatedSubs.filter(name => name !== channelUser.name);
      newSubCount = Math.max(0, subscribers - 1);
      setIsSubscribed(false);
      setSubscribers(newSubCount);
    } else {
      updatedSubs.push(channelUser.name);
      newSubCount = subscribers + 1;
      setIsSubscribed(true);
      setSubscribers(newSubCount);

      // Create a subscription notification
      const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
      notifications.unshift({
        id: Date.now(),
        type: "subscriptions",
        message: `${currentUser.name} subscribed to your channel!`,
        read: false,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }

    localStorage.setItem("subscriptions", JSON.stringify(updatedSubs));
    localStorage.setItem(`subs_count_${emailKey}`, newSubCount);
  };

  // Profile Uploads
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setProfileImage(dataUrl);
      localStorage.setItem(`profileImage_${emailKey}`, dataUrl);
      localStorage.setItem(`profileImage_${currentUser.email}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setBannerImage(dataUrl);
      localStorage.setItem(`bannerImage_${emailKey}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDesc = () => {
    setChannelDesc(descInput);
    localStorage.setItem(`channelDesc_${emailKey}`, descInput);
    setIsEditingDesc(false);
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