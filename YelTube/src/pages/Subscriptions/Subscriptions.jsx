import videos from "../../data/videos";
import "./Subscriptions.css";

const Subscriptions = () => {

  const subscriptions =
    JSON.parse(
      localStorage.getItem(
        "subscriptions"
      )
    ) || [];

  const subscribedVideos =
    videos.filter(
      (video) =>
        subscriptions.includes(
          video.channel
        )
    );

  return (

    <div className="subscriptions-page">

      <h2>
        Subscriptions
      </h2>

      {
        subscribedVideos.length === 0 ? (

          <p>
            No subscriptions yet
          </p>

        ) : (

          <div className="subscriptions-grid">

            {
              subscribedVideos.map(
                (video) => (

                <div
                  key={video.id}
                  className="subscription-card"
                >

                  <img
                    src={video.thumbnail}
                    alt={video.title}
                  />

                  <h4>
                    {video.title}
                  </h4>

                  <p>
                    {video.channel}
                  </p>

                </div>

              ))
            }

          </div>

        )
      }

    </div>

  );

};

export default Subscriptions;