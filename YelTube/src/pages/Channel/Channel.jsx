import { useState, useEffect, useRef } from "react";
import "./Channel.css";
import VideoCard from "../../components/VideoCard/VideoCard";
import { FaCamera, FaEdit, FaSave, FaPlusCircle, FaHeart, FaCommentAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Channel = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [activeTab, setActiveTab] = useState("videos");
  const [myVideos, setMyVideos] = useState([]);
  
  // Custom states for profile images
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150");
  const [bannerImage, setBannerImage] = useState("");
  
  // Description and edit state
  const [channelDesc, setChannelDesc] = useState("This is your public YelTube channel. Customize this space to introduce yourself, link your social media, and show off your creative content.");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState("");

  // Playlists and community posts
  const [playlists, setPlaylists] = useState([]);
  const [posts, setPosts] = useState([]);

  // File input refs
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    // Load videos
    const a = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
    const b = JSON.parse(localStorage.getItem("myVideos")) || [];
    const seen = new Set();
    const mergedVideos = [...a, ...b].filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
    setMyVideos(mergedVideos);

    // Load avatar & banner
    const emailKey = currentUser.email.replace(/[@.]/g, "_");
    const storedAvatar = localStorage.getItem(`profileImage_${emailKey}`);
    if (storedAvatar) setProfileImage(storedAvatar);
    
    const storedBanner = localStorage.getItem(`bannerImage_${emailKey}`);
    if (storedBanner) setBannerImage(storedBanner);

    // Load description
    const storedDesc = localStorage.getItem(`channelDesc_${emailKey}`);
    if (storedDesc) {
      setChannelDesc(storedDesc);
      setDescInput(storedDesc);
    } else {
      setDescInput(channelDesc);
    }

    // Load Playlists
    const storedPlaylists = JSON.parse(localStorage.getItem("playlists")) || [];
    setPlaylists(storedPlaylists);

    // Load Community Posts
    const storedPosts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    setPosts(storedPosts);
  }, []);

  if (!currentUser) {
    return (
      <div className="channel-page-empty">
        <h2>Please Login</h2>
        <p>You must be signed in to customize and view your channel.</p>
        <Link to="/login"><button className="login-redirect-btn">Login Now</button></Link>
      </div>
    );
  }

  const emailKey = currentUser.email.replace(/[@.]/g, "_");

  // Handle Profile Upload
  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setProfileImage(dataUrl);
      localStorage.setItem(`profileImage_${emailKey}`, dataUrl);
      // Synchronize current profile image in Header
      localStorage.setItem(`profileImage_${currentUser.email}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Handle Banner Upload
  const handleBannerClick = () => {
    bannerInputRef.current?.click();
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

  // Handle Description Update
  const handleSaveDesc = () => {
    setChannelDesc(descInput);
    localStorage.setItem(`channelDesc_${emailKey}`, descInput);
    setIsEditingDesc(false);
  };

  // Stats calculation
  const totalViews = myVideos.reduce((s, v) => s + (v.views || 0), 0);
  const subscriberCount = parseInt(localStorage.getItem("streamFollowers")) || 0;

  return (
    <div className="channel-page">
      {/* Hidden File Inputs */}
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
          background: bannerImage ? `url(${bannerImage}) center/cover no-repeat` : "linear-gradient(135deg, #2c2c54 0%, #111122 100%)",
        }}
      >
        <button className="edit-banner-btn" onClick={handleBannerClick} title="Upload banner">
          <FaCamera /> Update Banner
        </button>
      </div>

      {/* Profile Info */}
      <div className="channel-info-container">
        <div className="channel-avatar-wrap">
          <img src={profileImage} alt="Avatar" className="channel-avatar" />
          <button className="edit-avatar-overlay" onClick={handleAvatarClick} title="Update avatar">
            <FaCamera />
          </button>
        </div>

        <div className="channel-text-details">
          <h2>{currentUser.name}</h2>
          <p className="channel-handle">@{currentUser.name.toLowerCase().replace(/\s+/g, "")}</p>
          <div className="channel-meta-stats">
            <span><strong>{subscriberCount.toLocaleString()}</strong> Subscribers</span>
            <span className="dot">•</span>
            <span><strong>{myVideos.length}</strong> Videos</span>
            <span className="dot">•</span>
            <span><strong>{totalViews.toLocaleString()}</strong> Total Views</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="channel-tabs">
        {[
          { id: "videos", label: "Videos" },
          { id: "playlists", label: "Playlists" },
          { id: "community", label: "Community" },
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

      {/* Tab Contents */}
      <div className="channel-tab-content">
        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div className="channel-videos-grid">
            {myVideos.length === 0 ? (
              <div className="empty-channel-tab">
                <h3>No videos uploaded yet.</h3>
                <p>Upload videos inside your Creator Studio to share them with the world.</p>
                <Link to="/upload">
                  <button className="upload-channel-btn"><FaPlusCircle /> Upload Video</button>
                </Link>
              </div>
            ) : (
              myVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            )}
          </div>
        )}

        {/* PLAYLISTS TAB */}
        {activeTab === "playlists" && (
          <div className="channel-playlists-grid">
            {playlists.length === 0 ? (
              <div className="empty-channel-tab">
                <h3>No playlists created yet.</h3>
                <p>Add watch later videos or custom lists to playlists.</p>
                <Link to="/playlists">
                  <button className="upload-channel-btn"><FaPlusCircle /> Go to Playlists</button>
                </Link>
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

        {/* COMMUNITY TAB */}
        {activeTab === "community" && (
          <div className="channel-community-feed">
            {posts.length === 0 ? (
              <div className="empty-channel-tab">
                <h3>No community posts yet.</h3>
                <p>Create posts on the Community feed to interact with your viewers.</p>
                <Link to="/community">
                  <button className="upload-channel-btn"><FaPlusCircle /> Write Post</button>
                </Link>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="channel-post-card">
                  <div className="post-header-info">
                    <img src={profileImage} alt="" className="post-avatar" />
                    <div>
                      <strong>{currentUser.name}</strong>
                      <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="post-text-body">{post.text}</p>
                  
                  {post.isPoll && (
                    <div className="post-poll-display">
                      {post.options.map((opt, i) => {
                        const totalVotes = post.votes?.reduce((s, v) => s + v, 0) || 0;
                        const votes = post.votes?.[i] || 0;
                        const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                        return (
                          <div key={opt} className="poll-option-row-display">
                            <span className="poll-option-label">{opt}</span>
                            <div className="poll-option-bar-outer">
                              <div className="poll-option-bar-inner" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="poll-option-pct">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="post-actions-row">
                    <span><FaHeart /> {post.likes || 0} Likes</span>
                    <span><FaCommentAlt /> {post.comments?.length || 0} Comments</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div className="channel-about-section">
            <div className="about-left-desc">
              <div className="desc-header-about">
                <h3>Description</h3>
                {!isEditingDesc ? (
                  <button className="edit-desc-icon-btn" onClick={() => setIsEditingDesc(true)}>
                    <FaEdit /> Edit
                  </button>
                ) : (
                  <button className="save-desc-icon-btn" onClick={handleSaveDesc}>
                    <FaSave /> Save
                  </button>
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
                <strong>{subscriberCount.toLocaleString()}</strong>
              </div>
              <div className="about-stat-row">
                <span>Total Video Views</span>
                <strong>{totalViews.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;