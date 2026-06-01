import VideoCard from "../../components/VideoCard/VideoCard";
import videos from "../../data/videos";
import shortsData from "../../data/shortsData";

import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaShare,
} from "react-icons/fa";

import "./Home.css";

const Home = ({
  searchQuery,
  selectedCategory,
  sidebar
}) => {

  const filteredVideos =
  videos.filter((video) => {

    const matchesSearch =

      video.title
      .toLowerCase()
      .includes(
        searchQuery.toLowerCase()
      );

    const matchesCategory =

      selectedCategory === "All"
      ||

      video.category ===
      selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );

  });

  const firstVideos =
  filteredVideos.slice(0,8);

  const remainingVideos =
  filteredVideos.slice(4);

  return (

    <div
      className={
        sidebar
        ? "home"
        : "home full"
      }
    >

      <div className="video-grid">

        {
          filteredVideos.length === 0 ? (

            <div className="no-videos">

              No videos found for
              "{searchQuery}"

            </div>

          ) : (

            <>

              {firstVideos.map((video) => (

                <VideoCard
                  key={video.id}
                  video={video}
                />

              ))}

              <div className="shorts-section">

                <h2>
                  Shorts
                </h2>

                <div className="shorts-row">

                  {shortsData.map((short) => (

                    <div
                      className="short-card"
                      key={short.id}
                    >

                      <video
                        src={short.video}
                        autoPlay
                        muted
                        loop
                        controls
                      />

                      <div className="short-info">

                        <h4>
                          {short.title}
                        </h4>

                        <div className="short-actions">

                          <span>
                            <FaThumbsUp />
                            {short.likes}
                          </span>

                          <span>
                            <FaThumbsDown />
                            {short.dislikes}
                          </span>

                          <span>
                            <FaComment />
                            {short.comments}
                          </span>

                          <span>
                            <FaShare />
                            Share
                          </span>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              {remainingVideos.map((video) => (

                <VideoCard
                  key={video.id}
                  video={video}
                />

              ))}

            </>

          )
        }

      </div>

    </div>

  );

};

export default Home;