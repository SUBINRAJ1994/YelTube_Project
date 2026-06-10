import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import staticVideos from "../../data/videos";
import VideoCard from "../../components/VideoCard/VideoCard";
import { FaSearch, FaVideo, FaUserCircle, FaFolderOpen, FaRegFolder } from "react-icons/fa";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = useState("all"); // "all" | "videos" | "channels" | "playlists"
  const [matchedVideos, setMatchedVideos] = useState([]);
  const [matchedChannels, setMatchedChannels] = useState([]);
  const [matchedPlaylists, setMatchedPlaylists] = useState([]);

  useEffect(() => {
    const queryLower = query.toLowerCase().trim();

    // 1. Search Videos
    const uploaded = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
    const allVids = [...uploaded, ...staticVideos];
    
    // Deduplicate
    const seenVids = new Set();
    const uniqueVids = allVids.filter((v) => {
      if (seenVids.has(v.id)) return false;
      seenVids.add(v.id);
      return true;
    });

    const filteredVids = uniqueVids.filter(
      (v) =>
        v.title.toLowerCase().includes(queryLower) ||
        (v.description && v.description.toLowerCase().includes(queryLower)) ||
        v.channel.toLowerCase().includes(queryLower)
    );
    setMatchedVideos(filteredVids);

    // 2. Search Channels / Creators
    const allChannels = uniqueVids.map((v) => ({
      name: v.channel,
      logo: v.channelLogo || `https://ui-avatars.com/api/?name=${v.channel}&background=random&color=fff`,
    }));
    
    const seenChannels = new Set();
    const uniqueChannels = allChannels.filter((c) => {
      if (seenChannels.has(c.name)) return false;
      seenChannels.add(c.name);
      return true;
    });

    const filteredChannels = uniqueChannels.filter((c) =>
      c.name.toLowerCase().includes(queryLower)
    );
    setMatchedChannels(filteredChannels);

    // 3. Search Playlists
    const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    const filteredPlaylists = playlists.filter(
      (pl) =>
        pl.name.toLowerCase().includes(queryLower)
    );
    setMatchedPlaylists(filteredPlaylists);
  }, [query]);

  const totalResults = matchedVideos.length + matchedChannels.length + matchedPlaylists.length;

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        {/* Results Header */}
        <div className="search-results-header">
          <h2>
            <FaSearch className="search-header-icon" /> Search Results for "{query}"
          </h2>
          <p>{totalResults} matching results found</p>
        </div>

        {/* Tabs */}
        <div className="search-tabs">
          {[
            { id: "all", label: `All (${totalResults})` },
            { id: "videos", label: `Videos (${matchedVideos.length})` },
            { id: "channels", label: `Channels (${matchedChannels.length})` },
            { id: "playlists", label: `Playlists (${matchedPlaylists.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`search-tab-chip ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="search-results-content">
          {totalResults === 0 ? (
            <div className="search-empty-state">
              <FaFolderOpen className="empty-search-icon" />
              <h3>No results found</h3>
              <p>Try checking your spelling or search for alternative keywords.</p>
            </div>
          ) : (
            <>
              {/* CHANNELS SECTION */}
              {(activeTab === "all" || activeTab === "channels") && matchedChannels.length > 0 && (
                <div className="search-section channels-section">
                  <h3>Creators</h3>
                  <div className="search-channels-grid">
                    {matchedChannels.map((channel) => (
                      <div className="search-channel-card" key={channel.name}>
                        <img src={channel.logo} alt={channel.name} className="search-channel-logo" />
                        <div className="search-channel-info">
                          <h4>{channel.name}</h4>
                          <span className="search-channel-badge">Verified Creator</span>
                        </div>
                        <button className="search-channel-visit-btn">Visit Channel</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PLAYLISTS SECTION */}
              {(activeTab === "all" || activeTab === "playlists") && matchedPlaylists.length > 0 && (
                <div className="search-section playlists-section">
                  <h3>Playlists</h3>
                  <div className="search-playlists-grid">
                    {matchedPlaylists.map((pl) => (
                      <Link to={`/playlists/${pl.id}`} className="search-playlist-card" key={pl.id}>
                        <div className="search-playlist-preview">
                          <FaRegFolder className="search-playlist-icon" />
                          <span className="search-playlist-badge">{pl.videos?.length || 0} videos</span>
                        </div>
                        <div className="search-playlist-info">
                          <h4>{pl.name}</h4>
                          <p>Curated Collection</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* VIDEOS SECTION */}
              {(activeTab === "all" || activeTab === "videos") && matchedVideos.length > 0 && (
                <div className="search-section videos-section">
                  <h3>Videos</h3>
                  <div className="search-videos-grid">
                    {matchedVideos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
