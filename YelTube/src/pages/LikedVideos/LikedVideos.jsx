import VideoCard from "../../components/VideoCard/VideoCard";

const LikedVideos = () => {

  const likedVideos =
  JSON.parse(

    localStorage.getItem(
      "likedVideos"
    )

  ) || [];

  return (

    <div className="home">

      <h2>
        Liked Videos
      </h2>

      <div className="video-grid">

        {likedVideos.map((video) => (

          <VideoCard
            key={video.id}
            video={video}
          />

        ))}

      </div>

    </div>

  );

};

export default LikedVideos;