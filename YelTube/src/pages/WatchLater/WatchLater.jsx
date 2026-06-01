import { Link } from "react-router-dom";
import { useState } from "react";
import "./WatchLater.css";

const WatchLater = () => {

  const [watchLaterVideos, setWatchLaterVideos] = useState(() => {
    return JSON.parse(localStorage.getItem("watchLater")) || [];
  });

  const removeVideo = (id) => {

    const updatedVideos =
      watchLaterVideos.filter(
        (video) =>
          video.id !== id
      );

    setWatchLaterVideos(
      updatedVideos
    );

    localStorage.setItem(
      "watchLater",
      JSON.stringify(
        updatedVideos
      )
    );

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