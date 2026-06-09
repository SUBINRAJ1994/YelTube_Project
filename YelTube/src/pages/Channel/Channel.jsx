import "./Channel.css";
import VideoCard from "../../components/VideoCard/VideoCard";

const Channel = () => {

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

  const myVideos =
    JSON.parse(localStorage.getItem("myVideos")) || [];

  const profileImage =
    localStorage.getItem("profileImage") ||
    "https://i.pravatar.cc/150";

  const bannerImage =
    localStorage.getItem("bannerImage") ||
    "https://via.placeholder.com/1200x250";

  if (!currentUser) {
    return (
      <h2>Please Login</h2>
    );
  }

  return (

    <div className="channel-page">

      <div
        className="channel-banner"
        style={{
          backgroundImage: `url(${bannerImage})`
        }}
      />

      <div className="channel-info">

        <img
          src={profileImage}
          alt="Profile"
          className="channel-avatar"
        />

        <div>

          <h2>{currentUser.name}</h2>

          <p>{currentUser.email}</p>

          <span>
            {myVideos.length} Videos
          </span>

        </div>

      </div>

      <div className="channel-tabs">

        <button>Home</button>
        <button>Videos</button>
        <button>Shorts</button>
        <button>About</button>

      </div>

      <div className="channel-videos">

        {myVideos.length === 0 ? (

          <h3>No videos uploaded yet.</h3>

        ) : (

          myVideos.map((video) => (

            <VideoCard
              key={video.id}
              video={video}
            />

          ))

        )}

      </div>

    </div>

  );

};

export default Channel;