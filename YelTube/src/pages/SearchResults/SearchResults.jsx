import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaPlayCircle, FaList, FaUserFriends, FaRegFolderOpen } from "react-icons/fa";
import videosData from "../../data/videos";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("videos");
  
  // Extract search query
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search_query") || "";

  const [matchedVideos, setMatchedVideos] = useState([]);
  const [matchedChannels, setMatchedChannels] = useState([]);
  const [matchedPlaylists, setMatchedPlaylists] = useState([]);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();

    // 1. Search Videos (uploaded + static)
    const uploaded = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
    const blacklist = JSON.parse(localStorage.getItem("deletedVideoIds")) || [];
    const allVideos = [...uploaded, ...videosData].filter(v => !blacklist.includes(v.id));
    const vFiltered = allVideos.filter(
      (v) =>
        v.title.toLowerCase().includes(query) ||
        (v.description && v.description.toLowerCase().includes(query))
    );
    setMatchedVideos(vFiltered);

    // 2. Search Channels
    const users = JSON.parse(localStorage.getItem("users")) || [];
    // Get all channels that either have uploaded videos or are registered users
    const uniqueCreators = [...new Set(allVideos.map(v => v.channel))];
    const channelList = uniqueCreators.map((name) => {
      const u = users.find(usr => usr.name.toLowerCase() === name.toLowerCase());
      return {
        name,
        avatar: u?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00bcd4&color=fff&bold=true`,
        email: u?.email || `${name.toLowerCase().replace(/\s+/g, "")}@example.com`
      };
    });

    const cFiltered = channelList.filter(
      (c) => c.name.toLowerCase().includes(query)
    );
    setMatchedChannels(cFiltered);

    // 3. Search Playlists
    const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    const pFiltered = playlists.filter(
      (p) => p.name.toLowerCase().includes(query)
    );
    setMatchedPlaylists(pFiltered);

  }, [searchQuery, location.search]);

  return (
    <div className="search-results-page">
      <div className="results-header">
        <h2>Search Results for <span className="query-highlight">"{searchQuery}"</span></h2>
        <p>Found {matchedVideos.length} videos, {matchedChannels.length} channels, {matchedPlaylists.length} playlists</p>
      </div>

      {/* Tabs */}
      <div className="results-tabs">
        <button 
          className={`results-tab-btn ${activeTab === "videos" ? "active" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          Videos ({matchedVideos.length})
        </button>
        <button 
          className={`results-tab-btn ${activeTab === "channels" ? "active" : ""}`}
          onClick={() => setActiveTab("channels")}
        >
          Channels ({matchedChannels.length})
        </button>
        <button 
          className={`results-tab-btn ${activeTab === "playlists" ? "active" : ""}`}
          onClick={() => setActiveTab("playlists")}
        >
          Playlists ({matchedPlaylists.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="results-content">
        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div className="results-videos-list">
            {matchedVideos.length === 0 ? (
              <p className="no-results-msg">No videos found matching your query.</p>
            ) : (
              matchedVideos.map((video) => (
                <div key={video.id} className="search-video-card">
                  <Link to={`/watch/${video.id}`} className="search-video-thumb-link">
                    <div className="search-video-thumbnail">
                      <img src={video.thumbnail} alt={video.title} />
                      <span className="search-video-duration">{video.duration || "3:00"}</span>
                    </div>
                  </Link>
                  <div className="search-video-details">
                    <Link to={`/watch/${video.id}`}>
                      <h3>{video.title}</h3>
                    </Link>
                    <div className="search-video-meta">
                      <Link to={`/channel?name=${encodeURIComponent(video.channel)}`} className="creator-details">
                        <img 
                          src={video.channelLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.channel)}&background=random&color=fff`} 
                          alt={video.channel} 
                          className="search-channel-avatar" 
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.channel)}&background=random&color=fff`;
                          }}
                        />
                        <span>{video.channel}</span>
                      </Link>
                      <span className="dot">•</span>
                      <span>{video.views}</span>
                      <span className="dot">•</span>
                      <span>{video.time}</span>
                    </div>
                    <p className="search-video-desc">
                      {video.description || "No description provided for this video. Watch and enjoy on YelTube."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CHANNELS TAB */}
        {activeTab === "channels" && (
          <div className="results-channels-list">
            {matchedChannels.length === 0 ? (
              <p className="no-results-msg">No channels found matching your query.</p>
            ) : (
              matchedChannels.map((channel) => {
                const subKey = `subs_count_${channel.email.replace(/[@.]/g, "_")}`;
                const subsCount = localStorage.getItem(subKey) || "1.2K";
                
                return (
                  <div key={channel.name} className="search-channel-card">
                    <Link to={`/channel?name=${encodeURIComponent(channel.name)}`}>
                      <img 
                        src={localStorage.getItem(`profileImage_${channel.email.replace(/[@.]/g, "_")}`) || channel.avatar} 
                        alt={channel.name} 
                        className="channel-card-avatar" 
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.name)}&background=random&color=fff`;
                        }}
                      />
                    </Link>
                    <div className="channel-card-info">
                      <Link to={`/channel?name=${encodeURIComponent(channel.name)}`}>
                        <h3>{channel.name}</h3>
                      </Link>
                      <p className="channel-card-handle">@{channel.name.toLowerCase().replace(/\s+/g, "")}</p>
                      <p className="channel-card-subs">
                        <FaUserFriends /> {parseInt(subsCount, 10).toLocaleString() || subsCount} Subscribers
                      </p>
                    </div>
                    <Link to={`/channel?name=${encodeURIComponent(channel.name)}`}>
                      <button className="channel-card-btn">Visit Channel</button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* PLAYLISTS TAB */}
        {activeTab === "playlists" && (
          <div className="results-playlists-list">
            {matchedPlaylists.length === 0 ? (
              <p className="no-results-msg">No playlists found matching your query.</p>
            ) : (
              matchedPlaylists.map((pl) => (
                <div key={pl.id} className="search-playlist-card">
                  <div className="playlist-card-thumbnail">
                    {pl.videos && pl.videos[0] ? (
                      <img src={pl.videos[0].thumbnail} alt={pl.name} />
                    ) : (
                      <div className="empty-playlist-preview">
                        <FaRegFolderOpen />
                      </div>
                    )}
                    <div className="playlist-count-overlay">
                      <FaList /> <span>{pl.videos?.length || 0} videos</span>
                    </div>
                  </div>
                  <div className="playlist-card-info">
                    <h3>{pl.name}</h3>
                    <p>Created by you</p>
                    <Link to={`/playlists/${pl.id}`}>
                      <button className="playlist-view-btn"><FaPlayCircle /> View Playlist</button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
