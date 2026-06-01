import { useParams, Link } from "react-router-dom";
import videos from "../../data/videos";
import "./Watch.css";
import { FaThumbsUp, FaThumbsDown, FaShare, FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";



const Watch = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

const handleLike = () => {

  if (!liked) {

    setLikes(likes + 1);

    if (disliked) {

      setDislikes(dislikes - 1);

      setDisliked(false);

    }

    setLiked(true);
    let likedVideos =
JSON.parse(
  localStorage.getItem(
    "likedVideos"
  )
) || [];

const alreadyLiked =
likedVideos.find(
  (item) =>
    item.id === video.id
);

if (!alreadyLiked) {

  likedVideos.unshift(video);

  localStorage.setItem(

    "likedVideos",

    JSON.stringify(
      likedVideos
    )

  );

}
  } else {

    setLikes(likes - 1);

    setLiked(false);
    let likedVideos =
JSON.parse(
  localStorage.getItem(
    "likedVideos"
  )
) || [];

likedVideos =
likedVideos.filter(
  (item) =>
    item.id !== video.id
);

localStorage.setItem(

  "likedVideos",

  JSON.stringify(
    likedVideos
  )

);

  }

};


const handleDislike = () => {

  if (!disliked) {

    setDislikes(dislikes + 1);

    if (liked) {

      setLikes(likes - 1);

      setLiked(false);

    }

    setDisliked(true);

  } else {

    setDislikes(dislikes - 1);

    setDisliked(false);

  }

};
  const { id } = useParams();
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [comments, setComments] = useState([
  "Awesome video 🔥",
  "Very helpful tutorial",
  "Waiting for next part",
  ]);
  const [commentInput, setCommentInput] = useState("");
  const addComment = () => {
  if (commentInput.trim() === "") return;

  setComments([
    ...comments,
    commentInput,
  ]);

  setCommentInput("");
};

  const video = videos.find((v) => v.id === parseInt(id, 10));
  useEffect(() => {

  let history =
    JSON.parse(
      localStorage.getItem(
        "watchHistory"
      )
    ) || [];

  history =
    history.filter(
      (item) =>
        item.id !== video.id
    );

  history.unshift(video);

  localStorage.setItem(
    "watchHistory",
    JSON.stringify(history)
  );

}, [video]);
  const relatedVideos = videos.filter(
    (item) => item.id !== video.id
  );

  if (!video) {
    return (
      <div className="watch-page">
        <div className="watch-container">
          <h2>Video not found</h2>
          <p>Please choose a valid video from the home page.</p>
        </div>
      </div>
    );
  }
const handleWatchLater = () => {
  let watchLater = JSON.parse(localStorage.getItem("watchLater")) || [];
  const alreadyExists = watchLater.some((item) => item.id === video.id);
  if (alreadyExists){
    alert("Alredy added to Watch Later");
    return;
  }
  watchLater.unshift(video);
  localStorage.setItem("watchLater", JSON.stringify(watchLater));
  alert("Added to Watch Later");
}
  return (
    <div className="watch-page">
      <div className="watch-container">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          frameBorder="0"
          allowFullScreen
        />
        <h2 className="watch-title">{video.title}</h2>
        <div className="watch-details">
          <div className="channel-section">
            <img
              src={video.channelLogo}
              alt={video.channel}
              className="watch-channel-logo"
            />
            <div>
              <h4>{video.channel}</h4>
              <p>
              {subscriberCount.toLocaleString()}
              Subscribers
              </p>
            </div>
          </div>
          <button
            className="subscribe-btn"
            onClick={() => {
            if (!subscribed) {
              setSubscribed(true);
              setSubscriberCount (subscriberCount + 1);
            } else {
              setSubscribed(false);
              setSubscriberCount(subscriberCount - 1);
            }
          }}
        
          >
            {subscribed ? "Subscribed" : "Subscribe"
            }
          </button>
        </div>
        <div className="video-actions">
          
          <button onClick={handleLike} title="Like">
              <FaThumbsUp />
                {likes}
          </button>
          <button onClick={handleDislike} title="Dislike">
            <FaThumbsDown /> 
                  {dislikes}
          </button>
          <button>
            <FaShare /> Share
          </button>
          <button onClick={handleWatchLater}><FaClock />Watch Later</button>
        </div>
        <div className="comments">
          <h3>Comments</h3>
          <input 
          type="text" 
          placeholder="Add a comment...." 
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
           />
           <button onClick={addComment}>
              Comment
            </button>
            <div className="comments-list">
            {comments.map((comment, index) => (
          <div
            className="comment"
            key={index}>
              {comment}
          </div>
        ))}

        </div>
        </div>
        
      </div>
          <div className="related-videos">
          <h3>Related Videos</h3>
          {relatedVideos.map((item) => 
          (
            <Link
            to={`/watch/${item.id}`}
            className="related-video-link"
            key={item.id}
            >
            <div className="related-video">

            <img
            src={item.thumbnail}
            alt={item.title}
            />

          <div>
            <h4>{item.title}</h4>
            <p>{item.channel}</p>
            <span>{item.views}</span>
          </div>

  </div>
</Link>
          ))}
        </div>
    </div>
  );
};
export default Watch;