import { useState, useEffect } from "react";
import "./Trending.css";
import staticVideos from "../../data/videos";
import VideoCard from "../../components/VideoCard/VideoCard";
import { FaFire, FaGamepad, FaMusic, FaLaptopCode, FaRunning } from "react-icons/fa";

const CATEGORIES = [
  { id: "all", label: "All Trending", icon: <FaFire /> },
  { id: "music", label: "Music", icon: <FaMusic /> },
  { id: "gaming", label: "Gaming", icon: <FaGamepad /> },
  { id: "tech", label: "Technology", icon: <FaLaptopCode /> },
  { id: "sports", label: "Sports", icon: <FaRunning /> },
];

const Trending = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [trendingVideos, setTrendingVideos] = useState([]);

  useEffect(() => {
    const uploaded = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
    const all = [...uploaded, ...staticVideos];
    
    // De-duplicate videos by id
    const seen = new Set();
    const unique = all.filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });

    // Map videos to categories
    const mapped = unique.map((v) => {
      let cat = "tech"; // default
      const title = v.title.toLowerCase();
      if (title.includes("react") || title.includes("django") || title.includes("clone") || title.includes("code")) {
        cat = "tech";
      } else if (v.id % 4 === 0) {
        cat = "music";
      } else if (v.id % 4 === 1) {
        cat = "gaming";
      } else if (v.id % 4 === 2) {
        cat = "sports";
      } else {
        cat = "tech";
      }
      return { ...v, category: cat };
    });

    setTrendingVideos(mapped);
  }, []);

  const filtered = trendingVideos.filter((v) => {
    if (activeTab === "all") return true;
    return v.category === activeTab;
  });

  return (
    <div className="trending-page">
      <div className="trending-container">
        {/* Title */}
        <div className="trending-header">
          <FaFire className="trending-fire-icon" />
          <div>
            <h2>Trending</h2>
            <p>See the most popular videos on YelTube right now</p>
          </div>
        </div>

        {/* Category Selector Chips */}
        <div className="trending-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`trending-tab-chip ${activeTab === cat.id ? "active" : ""}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.icon} <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="trending-grid">
          {filtered.length === 0 ? (
            <div className="trending-empty">
              <h3>No trending videos found</h3>
              <p>Check back later or select a different category.</p>
            </div>
          ) : (
            filtered.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Trending;
