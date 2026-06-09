import { Link } from "react-router-dom";
import { useState } from "react";
import "./WatchHistory.css";

const WatchHistory = () => {

  const [historyVideos, setHistoryVideos] =
    useState(
      JSON.parse(
        localStorage.getItem("watchHistory")
      ) || []
    );

  const clearHistory = () => {

    localStorage.removeItem(
      "watchHistory"
    );

    setHistoryVideos([]);

  };

  return (

    <div className="history-page">

      <div className="history-header">

        <h2>Watch History</h2>

        <button
          onClick={clearHistory}
        >
          Clear History
        </button>

      </div>

      {
        historyVideos.length === 0 ? (

          <h3>No watch history</h3>

        ) : (

          historyVideos.map(video => (

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

        )
      }

    </div>

  );

};

export default WatchHistory;