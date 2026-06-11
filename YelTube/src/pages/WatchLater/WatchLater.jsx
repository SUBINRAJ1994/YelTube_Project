import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./WatchLater.css";
import videoService from "../../services/videoService";

const WatchLater = () => {
  const [watchLaterVideos, setWatchLaterVideos] = useState([]);

  const fetchWatchLater = async () => {
    try {
      const data = await videoService.getWatchLater();
      setWatchLaterVideos((data || []).map((wl) => wl.video).filter(Boolean));
    } catch (err) {
      console.error("Error loading watch later videos:", err);
    }
  };

  useEffect(() => {
    fetchWatchLater();
  }, []);

  const removeVideo = async (id) => {
    try {
      await videoService.toggleWatchLater(id);
      setWatchLaterVideos(watchLaterVideos.filter((video) => video.id !== id));
    } catch (err) {
      console.error("Error removing video from watch later:", err);
    }
  };

  return (

    <div className="watchlater-page">

      <h2>
        Watch Later
        ({watchLaterVideos.length})
      </h2>

      {
        watchLaterVideos.length === 0 ? (

          <div className="empty-state">

  <h3>
    No Watch Later Videos
  </h3>

  <p>
    Save videos to watch later.
  </p>

</div>

        ) : (

          <div className="watchlater-videos">

            {
              watchLaterVideos.map(
                (video) => (

                <div
                  className="watchlater-card"
                  key={video.id}
                >

                  <Link
                    to={`/watch/${video.id}`}
                    className="watchlater-link"
                  >

                    <img
                      src={video.thumbnail}
                      alt={video.title}
                    />

                    <div>

                      <h3>
                        {video.title}
                      </h3>

                      <p>
                        {video.channel}
                      </p>

                      <span>
                        {video.views}
                      </span>

                    </div>

                  </Link>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeVideo(video.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              ))
            }

          </div>

        )
      }

    </div>

  );

};

export default WatchLater;