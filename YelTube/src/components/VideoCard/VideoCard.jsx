import { Link } from "react-router-dom";
import "./VideoCard.css";

const VideoCard = ({ video }) =>{
  return (
    <Link to={`/watch/${video.id}`} className="video-link">
    <div className="video-card">
      <img 
      src={video.thumbnail} 
      alt={video.title}
      className="thumbnail" 
      />
      <div className="video-info">
        <img 
        src={video.channelLogo} 
        alt={video.channel}
        className="channel-logo"/>
        <div className="video-text">
          <h4>{video.title}</h4>
          <p>{video.channel}</p>
          <span>
            {video.views} • {video.time} • {video.duration}
          </span>
        </div>
      </div>
    </div>
    </Link>
  );
};
export default VideoCard;