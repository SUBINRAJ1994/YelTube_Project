import { Link } from "react-router-dom";
import { useState } from "react";
import { FaTrash, FaHistory } from "react-icons/fa";
import "./WatchHistory.css";

const WatchHistory = () => {
  const [historyVideos, setHistoryVideos] = useState(() => {
    return JSON.parse(localStorage.getItem("watchHistory")) || [];
  });

  const clearHistory = () => {
    if (!window.confirm("Are you sure you want to clear your entire watch history?")) return;
    localStorage.removeItem("watchHistory");
    setHistoryVideos([]);
  };

  const removeVideo = (id) => {
    const updated = historyVideos.filter((v) => v.id !== id);
    setHistoryVideos(updated);
    localStorage.setItem("watchHistory", JSON.stringify(updated));
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>
          <FaHistory style={{ marginRight: "10px", color: "#ff0000" }} />
          Watch History ({historyVideos.length})
        </h2>
        {historyVideos.length > 0 && (
          <button className="clear-btn" onClick={clearHistory}>
            Clear History
          </button>
        )}
      </div>

      {historyVideos.length === 0 ? (
        <div className="empty-state">
          <h3>No Watch History</h3>
          <p>Videos you watch will be shown here.</p>
        </div>
      ) : (
        <div className="history-list">
          {historyVideos.map((video) => (
            <div className="history-card" key={video.id}>
              <Link to={`/watch/${video.id}`} className="history-link">
                <img src={video.thumbnail} alt={video.title} />
                <div className="history-info">
                  <h4>{video.title}</h4>
                  <p>{video.channel}</p>
                  <span>{video.views}</span>
                </div>
              </Link>
              <button
                className="remove-btn"
                onClick={() => removeVideo(video.id)}
                title="Remove from history"
              >
                <FaTrash /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;