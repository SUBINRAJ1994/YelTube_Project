import { Link } from "react-router-dom";
import { useState } from "react";
import "./WatchHistory.css";

const WatchHistory = () => {
  const [historyVideos, setHistoryVideos] = useState(
    JSON.parse(localStorage.getItem("watchHistory")) || []
  );
  const [historySearch, setHistorySearch] = useState("");

  const clearHistory = () => {
    if (!window.confirm("Clear your entire watch history?")) return;
    localStorage.removeItem("watchHistory");
    setHistoryVideos([]);
  };

  const filteredVideos = historyVideos.filter((video) =>
    video.title.toLowerCase().includes(historySearch.toLowerCase()) ||
    video.channel.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>Watch History</h2>
        <div className="history-controls">
          <input
            type="text"
            className="history-search-input"
            placeholder="Search watch history..."
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
          />
          <button onClick={clearHistory} className="clear-history-btn">
            Clear History
          </button>
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <h3 className="empty-history-text">
          {historySearch ? "No matching videos found" : "No watch history"}
        </h3>
      ) : (
        filteredVideos.map((video) => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="history-link"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
            />
            <div>
              <h4>{video.title}</h4>
              <p>{video.channel}</p>
              <span>{video.views}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default WatchHistory;