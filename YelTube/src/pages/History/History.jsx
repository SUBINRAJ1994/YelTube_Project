import VideoCard from "../../components/VideoCard/VideoCard";

const History = () => {

  const history = JSON.parse(
    localStorage.getItem(
      "watchHistory"
    )
  ) || [];

  return (

    <div className="home">

      <h2>
        Watch History
      </h2>

      <div className="video-grid">

        {history.map((video) => (

          <VideoCard
            key={video.id}
            video={video}
          />

        ))}

      </div>

    </div>

  );

};

export default History;