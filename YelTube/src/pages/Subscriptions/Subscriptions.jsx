import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaCheck, FaTimes, FaPlay } from "react-icons/fa";
import mockVideos from "../../data/videos";
import "./Subscriptions.css";

const Subscriptions = () => {
  const [activeChip, setActiveChip] = useState("All");

  // Load subscriptions (array of channel names)
  const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

  // Load custom uploads
  const uploadedVideos = JSON.parse(localStorage.getItem("uploadedVideos")) || [];

  // Combine mock videos and uploaded videos
  // Filter out any banned/deleted videos
  const deletedVideoIds = JSON.parse(localStorage.getItem("deletedVideoIds")) || [];
  const allVideos = [...uploadedVideos, ...mockVideos].filter(
    (video) => !deletedVideoIds.includes(video.id)
  );

  // Filter videos from subscribed channels
  const subscribedVideos = allVideos.filter((video) =>
    subscriptions.includes(video.channel)
  );

  // Map simulated timestamps/order for sorting
  const getSortScore = (video) => {
    // Custom uploaded videos have id as timestamp (recent)
    if (video.id > 1700000000000) {
      return video.id; // actual epoch timestamp
    }
    // Parse mock time strings
    const timeStr = video.time || "";
    if (timeStr.includes("hour") || timeStr.includes("minute") || timeStr.includes("now")) {
      return Date.now() - 3600000; // Today
    }
    if (timeStr.includes("day")) {
      const days = parseInt(timeStr) || 1;
      return Date.now() - days * 24 * 3600 * 1000;
    }
    if (timeStr.includes("week")) {
      const weeks = parseInt(timeStr) || 1;
      return Date.now() - weeks * 7 * 24 * 3600 * 1000;
    }
    return 0; // Old
  };

  // Sort by newest first
  const sortedVideos = [...subscribedVideos].sort((a, b) => getSortScore(b) - getSortScore(a));

  // Filter based on active chip
  const filteredVideos = sortedVideos.filter((video) => {
    if (activeChip === "All") return true;
    const timeStr = video.time || "";
    if (activeChip === "Today") {
      return (
        timeStr.includes("hour") ||
        timeStr.includes("minute") ||
        timeStr.includes("now") ||
        (timeStr.includes("day") && parseInt(timeStr) <= 1)
      );
    }
    if (activeChip === "This Week") {
      return !timeStr.includes("month") && !timeStr.includes("year") && (!timeStr.includes("week") || parseInt(timeStr) <= 1);
    }
    return true;
  });

  const unsubscribeChannel = (channelName) => {
    if (window.confirm(`Unsubscribe from ${channelName}?`)) {
      const updated = subscriptions.filter((sub) => sub !== channelName);
      localStorage.setItem("subscriptions", JSON.stringify(updated));
      window.location.reload();
    }
  };

  // Helper to get initials avatar if no logo
  const getAvatarUrl = (channel) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      channel
    )}&background=ff0000&color=ffffff&bold=true&size=128`;
  };

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-container">
        <div className="subscriptions-header">
          <h2>Subscriptions Feed</h2>
          <p className="subs-lead-text">Stay up to date with channels you follow.</p>
        </div>

        {/* Channels List Horizontal Scroll */}
        {subscriptions.length > 0 && (
          <div className="subscribed-channels-carousel">
            <h3>Subscribed Channels ({subscriptions.length})</h3>
            <div className="channels-scroll-row">
              {subscriptions.map((channel, i) => (
                <div key={i} className="channel-avatar-card">
                  <div className="avatar-wrapper">
                    <img src={getAvatarUrl(channel)} alt={channel} className="channel-avatar-img" />
                    <button
                      className="unsub-icon-btn"
                      onClick={() => unsubscribeChannel(channel)}
                      title="Unsubscribe"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <span className="channel-avatar-name">{channel}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Chips */}
        <div className="subs-filter-chips">
          {["All", "Today", "This Week"].map((chip) => (
            <button
              key={chip}
              className={`chip-btn ${activeChip === chip ? "active" : ""}`}
              onClick={() => setActiveChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="empty-subscriptions">
            <FaBell className="empty-subs-icon" />
            {subscriptions.length === 0 ? (
              <>
                <h3>No subscriptions yet</h3>
                <p>Subscribe to channels from watch pages to populate your personalized feed.</p>
              </>
            ) : (
              <>
                <h3>No videos found</h3>
                <p>Try switching to another filter or check back later.</p>
              </>
            )}
          </div>
        ) : (
          <div className="subscriptions-video-grid">
            {filteredVideos.map((video) => {
              const isNew =
                video.time === "Just now" ||
                video.time.includes("hour") ||
                video.time.includes("minute") ||
                (video.time.includes("day") && parseInt(video.time) <= 2);

              return (
                <div key={video.id} className="sub-video-card">
                  <Link to={`/watch/${video.id}`} className="video-thumbnail-link">
                    <div className="thumbnail-wrapper">
                      <img src={video.thumbnail} alt={video.title} className="video-thumb" />
                      {isNew && <span className="new-badge">NEW</span>}
                      <span className="play-overlay-icon"><FaPlay /></span>
                    </div>
                  </Link>
                  <div className="video-details-row">
                    <img
                      src={video.channelLogo || getAvatarUrl(video.channel)}
                      alt={video.channel}
                      className="subs-channel-logo"
                    />
                    <div className="video-metadata">
                      <Link to={`/watch/${video.id}`} className="video-title-link">
                        <h4>{video.title}</h4>
                      </Link>
                      <span className="channel-name">{video.channel}</span>
                      <div className="stats-row">
                        <span>{video.views}</span>
                        <span className="dot">•</span>
                        <span>{video.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;