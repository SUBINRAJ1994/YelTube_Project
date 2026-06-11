import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaTrash, FaHistory } from "react-icons/fa";
import "./WatchHistory.css";
import videoService from "../../services/videoService";

const WatchHistory = () => {
  const [historyVideos, setHistoryVideos] = useState([]);

  const fetchHistory = async () => {
    try {
      const data = await videoService.getWatchHistory();
      setHistoryVideos(
        (data || []).map((h) => ({
          ...h.video,
          historyId: h.id,
        }))
      );
    } catch (err) {
      console.error("Error loading watch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your entire watch history?")) return;
    try {
      await videoService.clearWatchHistory();
      setHistoryVideos([]);
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  const removeVideo = async (historyId) => {
    try {
      await videoService.removeFromWatchHistory(historyId);
      setHistoryVideos(historyVideos.filter((v) => v.historyId !== historyId));
    } catch (err) {
      console.error("Error removing from history:", err);
    }
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
            <div className="history-card" key={video.historyId}>
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
                onClick={() => removeVideo(video.historyId)}
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