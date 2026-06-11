import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaCheck, FaTimes, FaPlay } from "react-icons/fa";
import "./Subscriptions.css";
import videoService from "../../services/videoService";

const Subscriptions = () => {
  const [activeChip, setActiveChip] = useState("All");
  const [subscriptions, setSubscriptions] = useState([]);
  const [videos, setVideos] = useState([]);

  const loadData = async () => {
    try {
      const subs = await videoService.getSubscriptions();
      setSubscriptions(subs);
      const vids = await videoService.getVideos();
      setVideos(vids);
    } catch (err) {
      console.error("Error loading subscriptions feed:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter videos from subscribed channels
  const subscribedVideos = videos.filter((video) =>
    subscriptions.some((sub) => sub.channel_details.username === video.channel)
  );

  // Map simulated timestamps/order for sorting
  const getSortScore = (video) => {
    if (video.created_at) {
      return new Date(video.created_at).getTime();
    }
    return 0;
  };

  // Sort by newest first
  const sortedVideos = [...subscribedVideos].sort((a, b) => getSortScore(b) - getSortScore(a));

  // Filter based on active chip
  const filteredVideos = sortedVideos.filter((video) => {
    if (activeChip === "All") return true;
    const timeStr = video.time || "";
    if (activeChip === "Today") {
      return (
        timeStr.includes("m ago") ||
        timeStr.includes("h ago") ||
        timeStr === "Just now" ||
        timeStr === "Yesterday"
      );
    }
    if (activeChip === "This Week") {
      return !timeStr.includes("/") && !timeStr.includes("d ago") || (timeStr.includes("d ago") && parseInt(timeStr) <= 7);
    }
    return true;
  });

  const unsubscribeChannel = async (channelId, channelName) => {
    if (window.confirm(`Unsubscribe from ${channelName}?`)) {
      try {
        await videoService.toggleSubscription(channelId);
        setSubscriptions(subscriptions.filter((sub) => sub.channel_details.id !== channelId));
      } catch (err) {
        console.error("Error unsubscribing:", err);
      }
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
              {subscriptions.map((sub, i) => (
                <div key={i} className="channel-avatar-card">
                  <div className="avatar-wrapper">
                    <img src={sub.channel_details.profile_pic || getAvatarUrl(sub.channel_details.username)} alt={sub.channel_details.username} className="channel-avatar-img" />
                    <button
                      className="unsub-icon-btn"
                      onClick={() => unsubscribeChannel(sub.channel_details.id, sub.channel_details.username)}
                      title="Unsubscribe"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <span className="channel-avatar-name">{sub.channel_details.username}</span>
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