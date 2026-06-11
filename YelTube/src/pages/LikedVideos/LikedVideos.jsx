import { useState, useEffect } from "react";
import VideoCard from "../../components/VideoCard/VideoCard";
import videoService from "../../services/videoService";

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);

  const fetchLikedVideos = async () => {
    try {
      const data = await videoService.getVideos();
      setLikedVideos(data.filter((v) => v.user_reaction === "like"));
    } catch (err) {
      console.error("Error fetching liked videos:", err);
    }
  };

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  return (
    <div className="home" style={{ padding: "24px" }}>
      <h2>Liked Videos</h2>
      <div className="video-grid">
        {likedVideos.length === 0 ? (
          <div className="no-videos">No liked videos found.</div>
        ) : (
          likedVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default LikedVideos;