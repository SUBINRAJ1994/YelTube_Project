import { useParams, Link } from "react-router-dom";
import "./Watch.css";
import { FaThumbsUp, FaThumbsDown, FaShare, FaClock, FaList, FaEdit, FaTrash, FaReply, FaFlag, FaCog } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import ShareModal from "../../components/ShareModal/ShareModal";
import { pushNotification } from "../../utils/notifications";
import API from "../../services/api";
import videoService from "../../services/videoService";
import commentService from "../../services/commentService";
import playlistService from "../../services/playlistService";



const getAvatarSrc = (email, fallbackAvatar) => {
  if (!email) return fallbackAvatar || "https://i.pravatar.cc/40";
  const emailKey = email.replace(/[@.]/g, "_");
  return localStorage.getItem(`profileImage_${emailKey}`) || fallbackAvatar || "https://i.pravatar.cc/40";
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "min" : "mins"} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  const [ccActive, setCcActive] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [resolution, setResolution] = useState("1080p");

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
  };

  const handleResolutionChange = (res) => {
    setResolution(res);
    alert(`Video quality switched to ${res}`);
    setShowSettingsMenu(false);
  };

  const getSubtitles = (time) => {
    if (time < 3) return "Welcome to the YelTube developer session!";
    if (time >= 3 && time < 8) return "Here we are demonstrating custom playback controls.";
    if (time >= 8 && time < 14) return "You can toggle closed captions and change video resolution.";
    if (time >= 14 && time < 20) return "Select playback speeds or quality from the settings cog.";
    return "Enjoy watching this video in premium player quality!";
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
    localStorage.setItem(`progress_${video.id}`, e.target.currentTime);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
    const progress = localStorage.getItem(`progress_${video.id}`);
    if (progress) {
      e.target.currentTime = parseFloat(progress);
      setCurrentTime(parseFloat(progress));
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    videoRef.current.volume = vol;
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (amount) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + amount));
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [activeReplyBoxId, setActiveReplyBoxId] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        const videoData = await videoService.getVideoDetail(id);
        setVideo(videoData);

        const related = await videoService.getRelatedVideos(id);
        setRelatedVideos(related);

        const commentList = await commentService.getComments(id);
        setComments(commentList);

        if (currentUser) {
          await videoService.addToWatchHistory(id);

          const playlistOpts = await playlistService.getPlaylists();
          setPlaylists(playlistOpts);

          const subStatus = await videoService.getSubscriptionStatus(videoData.user);
          setSubscribed(subStatus.status === "subscribed");
          setSubscriberCount(subStatus.subscriber_count);
        } else {
          setSubscriberCount(0);
        }

        setLikes(videoData.likes || 0);
        setDislikes(videoData.dislikes || 0);
        setLiked(videoData.user_reaction === "like");
        setDisliked(videoData.user_reaction === "dislike");

      } catch (err) {
        console.error("Error loading video details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [id]);

  const handleLike = async () => {
    if (!currentUser) {
      alert("Please log in to like videos.");
      return;
    }
    try {
      const data = await videoService.toggleReaction(video.id, "like");
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setLiked(data.user_reaction === "like");
      setDisliked(data.user_reaction === "dislike");
      
      pushNotification("likes", `You liked the video: "${video.title}"`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    if (!currentUser) {
      alert("Please log in to dislike videos.");
      return;
    }
    try {
      const data = await videoService.toggleReaction(video.id, "dislike");
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setLiked(data.user_reaction === "like");
      setDisliked(data.user_reaction === "dislike");
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async () => {
    if (commentInput.trim() === "") return;
    try {
      const newComment = await commentService.addComment(video.id, commentInput);
      setComments([newComment, ...comments]);
      setCommentInput("");
      
      pushNotification("comments", `You commented on "${video.title}": "${commentInput.substring(0, 30)}..."`);
    } catch (err) {
      alert("Failed to add comment.");
    }
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map((c) => {
      if (c.id === commentId) {
        const likedBy = c.likedBy || [];
        const email = currentUser?.email || "anon";
        if (likedBy.includes(email)) {
          return {
            ...c,
            likes: Math.max(0, c.likes - 1),
            likedBy: likedBy.filter((e) => e !== email),
          };
        } else {
          return {
            ...c,
            likes: c.likes + 1,
            likedBy: [...likedBy, email],
          };
        }
      }
      return c;
    }));
  };

  const handlePostReply = (commentId) => {
    const text = replyInputs[commentId] || "";
    if (!text.trim()) return;

    setComments(comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              id: "r_" + Date.now(),
              author: currentUser ? currentUser.username : "Anonymous",
              text: text,
              createdAt: new Date().toISOString(),
            }
          ]
        };
      }
      return c;
    }));

    setReplyInputs({ ...replyInputs, [commentId]: "" });
    setActiveReplyBoxId(null);
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      const updatedComment = await commentService.updateComment(commentId, editCommentText);
      setComments(comments.map(c => c.id === commentId ? { ...c, text: updatedComment.text } : c));
      setEditingCommentId(null);
      setEditCommentText("");
    } catch (err) {
      alert("Failed to edit comment. " + (err.response?.data?.detail || ""));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert("Failed to delete comment. " + (err.response?.data?.detail || ""));
    }
  };

  const handleReportComment = async (comment) => {
    if (!window.confirm("Report this comment for spam or abuse?")) return;
    try {
      await API.post("reports/add/", {
        report_reason: 1,
        content_type: "comment",
        object_id: comment.id,
        description: "Flagged comment from Watch page."
      });
      alert("Thank you. This comment has been flagged for administrator review.");
    } catch (err) {
      alert("Report failed: " + (err.response?.data?.error || ""));
    }
  };

  useEffect(() => {
    if (!video) return;

    const subscriptions =
      JSON.parse(localStorage.getItem("subscriptions")) || [];

    if (subscriptions.includes(video.channel)) {
      setSubscribed(true);
    } else {
      setSubscribed(false);
    }

    let history =
      JSON.parse(localStorage.getItem("watchHistory")) || [];

    history = history.filter(
      (item) => item.id !== video.id
    );

    history.unshift(video);

    localStorage.setItem(
      "watchHistory",
      JSON.stringify(history)
    );
  }, [video]);

  // YouTube Player API integration for progress resume
  useEffect(() => {
    if (!video || video.videoUrl) return;

    let player;
    let intervalId;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      
      try {
        player = new window.YT.Player('youtube-player-iframe', {
          events: {
            'onStateChange': (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                intervalId = setInterval(() => {
                  if (player && player.getCurrentTime) {
                    localStorage.setItem(`progress_${video.id}`, player.getCurrentTime());
                  }
                }, 1000);
              } else {
                clearInterval(intervalId);
                if (player && player.getCurrentTime) {
                  localStorage.setItem(`progress_${video.id}`, player.getCurrentTime());
                }
              }
            }
          }
        });
      } catch (err) {
        console.error("Error creating YouTube player:", err);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      clearInterval(intervalId);
      if (player && player.destroy) {
        try {
          player.destroy();
        } catch (e) {}
      }
    };
  }, [video]);

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
  const handleWatchLater = async () => {
    if (!currentUser) {
      alert("Please log in to use Watch Later.");
      return;
    }
    try {
      await videoService.toggleWatchLater(video.id);
      alert("Watch Later list updated!");
    } catch (err) {
      alert("Failed to update Watch Later.");
    }
  };

  const [showShareModal, setShowShareModal] = useState(false);
  const handleShare = () => {
    setShowShareModal(true);
  };

  const addToPlaylist = async () => {
    if (!selectedPlaylist) {
      alert("Select a Playlist");
      return;
    }
    try {
      await playlistService.addVideoToPlaylist(selectedPlaylist, video.id);
      alert("Added to Playlist!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to playlist.");
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) {
      alert("Please log in to subscribe.");
      return;
    }
    try {
      const data = await videoService.toggleSubscription(video.user);
      setSubscribed(data.status === "subscribed");
      setSubscriberCount(data.subscriber_count);
      pushNotification("subscriptions", data.status === "subscribed" ? `You subscribed to ${video.channel}!` : `You unsubscribed from ${video.channel}.`);
    } catch (err) {
      alert("Failed to toggle subscription.");
    }
  };
  return (
    <div className="watch-page">
      <div className="watch-container">
        {video.videoUrl ? (
          <div className="custom-player-container" ref={playerContainerRef}>
            <video
              ref={videoRef}
              width="100%"
              src={video.videoUrl}
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              style={{ borderRadius: "15px", backgroundColor: "black", display: "block" }}
            />
            <div className="custom-player-controls">
              <input
                type="range"
                className="custom-seek-bar"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
              />
              <div className="controls-row">
                <div className="controls-left">
                  <button className="control-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? "⏸" : "▶"}
                  </button>
                  <button className="control-btn" onClick={() => skip(-10)} title="Rewind 10s">
                    ⏪ 10s
                  </button>
                  <button className="control-btn" onClick={() => skip(10)} title="Fast Forward 10s">
                    ⏩ 10s
                  </button>
                  <span className="control-time">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="controls-right">
                  <button
                    className={`control-btn cc-btn ${ccActive ? "active" : ""}`}
                    onClick={() => setCcActive(!ccActive)}
                    title="Closed Captions"
                    style={{ fontWeight: "bold", fontSize: "10px", border: "1.5px solid", borderRadius: "4px", padding: "1px 4px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    CC
                  </button>
                  <button
                    className={`control-btn settings-btn ${showSettingsMenu ? "active" : ""}`}
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    title="Settings"
                  >
                    <FaCog />
                  </button>
                  <button className="control-btn" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                    {isMuted || volume === 0 ? "🔇" : "🔊"}
                  </button>
                  <input
                    type="range"
                    className="custom-volume-bar"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                  />
                  <button className="control-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                    ⛶
                  </button>
                </div>
              </div>
            </div>

            {/* Subtitle Overlay */}
            {ccActive && (
              <div className="video-subtitle-overlay">
                {getSubtitles(currentTime)}
              </div>
            )}

            {/* Settings Dropdown Popover */}
            {showSettingsMenu && (
              <div className="video-settings-menu">
                <div className="settings-menu-item">
                  <span>Speed</span>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  >
                    <option value="0.5">0.5x</option>
                    <option value="1">Normal</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
                <div className="settings-menu-item">
                  <span>Quality</span>
                  <select
                    value={resolution}
                    onChange={(e) => handleResolutionChange(e.target.value)}
                  >
                    <option value="1080p">1080p (HD)</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                    <option value="Auto">Auto</option>
                  </select>
                </div>
                <div className="settings-menu-item">
                  <span>Subtitles/CC</span>
                  <select
                    value={ccActive ? "on" : "off"}
                    onChange={(e) => setCcActive(e.target.value === "on")}
                  >
                    <option value="off">Off</option>
                    <option value="on">On (English)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ) : (
          <iframe
            id="youtube-player-iframe"
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.youtubeId}?start=${Math.floor(parseFloat(localStorage.getItem(`progress_${video.id}`)) || 0)}&enablejsapi=1`}
            title={video.title}
            frameBorder="0"
            allowFullScreen
          />
        )}
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
            onClick={handleSubscribe}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
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
          <button onClick={handleShare}>
            <FaShare /> Share
          </button>
          <button onClick={handleWatchLater}><FaClock />Watch Later</button>
          <button onClick={addToPlaylist}>
            <FaList /> Add To Playlist
          </button>
        </div>
        <div className="playlist-section">

  <select
    value={selectedPlaylist}
    onChange={(e) =>
      setSelectedPlaylist(
        e.target.value
      )
    }
  >

    <option value="">
      Select Playlist
    </option>

    {
      playlists.map(
        (playlist) => (

        <option
          key={playlist.id}
          value={playlist.id}
        >
          {playlist.name}
        </option>

      ))
    }

  </select>

  

</div>
        <div className="comments">
          <h3>{comments.filter(c => !c.reported).length} Comments</h3>
          <div className="add-comment-form">
            <input 
              type="text" 
              placeholder={currentUser ? "Add a public comment..." : "Login to write a comment..."} 
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              disabled={!currentUser}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
            />
            {currentUser && (
              <button className="submit-comment-btn" onClick={addComment}>
                Comment
              </button>
            )}
          </div>
          
          <div className="comments-list">
            {comments.filter(c => !c.reported).map((comment) => {
              const hasLiked = currentUser && comment.likedBy?.includes(currentUser.email);
              const isOwnComment = currentUser && comment.email === currentUser.email;

              return (
                <div className="comment-item" key={comment.id}>
                  <img src={getAvatarSrc(comment.email, comment.avatar)} alt="" className="comment-avatar" />
                  <div className="comment-details">
                    <div className="comment-meta">
                      <strong className="comment-author">{comment.author}</strong>
                      <span className="comment-time">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>

                    {editingCommentId === comment.id ? (
                      <div className="comment-edit-form">
                        <textarea
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          rows={2}
                        />
                        <div className="comment-edit-actions">
                          <button className="save" onClick={() => handleSaveEdit(comment.id)}>Save</button>
                          <button className="cancel" onClick={() => setEditingCommentId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="comment-text">{comment.text}</p>
                    )}

                    <div className="comment-actions">
                      <button className={`comment-action-btn ${hasLiked ? "liked" : ""}`} onClick={() => handleLikeComment(comment.id)}>
                        <FaThumbsUp /> <span>{comment.likes || 0}</span>
                      </button>
                      
                      <button className="comment-action-btn" onClick={() => setActiveReplyBoxId(activeReplyBoxId === comment.id ? null : comment.id)}>
                        <FaReply /> <span>Reply</span>
                      </button>

                      {isOwnComment ? (
                        <>
                          <button className="comment-action-btn edit" onClick={() => handleStartEdit(comment)} title="Edit comment">
                            <FaEdit /> <span>Edit</span>
                          </button>
                          <button className="comment-action-btn delete" onClick={() => handleDeleteComment(comment.id)} title="Delete comment">
                            <FaTrash /> <span>Delete</span>
                          </button>
                        </>
                      ) : (
                        <button className="comment-action-btn report" onClick={() => handleReportComment(comment)} title="Report comment">
                          <FaFlag /> <span>Report</span>
                        </button>
                      )}
                    </div>

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="comment-replies-list">
                        {comment.replies.map((reply) => (
                          <div className="reply-item" key={reply.id}>
                            {reply.email || reply.avatar ? (
                              <img
                                src={getAvatarSrc(reply.email, reply.avatar)}
                                alt=""
                                className="comment-avatar"
                                style={{ width: "28px", height: "28px" }}
                              />
                            ) : (
                              <div className="reply-avatar-placeholder">
                                {reply.author ? reply.author[0].toUpperCase() : "A"}
                              </div>
                            )}
                            <div className="reply-details">
                              <div className="reply-meta">
                                <strong>{reply.author}</strong>
                                <span className="reply-time">
                                  {formatRelativeTime(reply.createdAt)}
                                </span>
                              </div>
                              <p className="reply-text">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input Box */}
                    {activeReplyBoxId === comment.id && (
                      <div className="reply-input-box">
                        <input
                          type="text"
                          placeholder="Add a reply..."
                          value={replyInputs[comment.id] || ""}
                          onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                          onKeyDown={(e) => e.key === "Enter" && handlePostReply(comment.id)}
                        />
                        <div className="reply-input-actions">
                          <button className="reply" onClick={() => handlePostReply(comment.id)}>Reply</button>
                          <button className="cancel" onClick={() => setActiveReplyBoxId(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          videoUrl={window.location.href}
        />
    </div>
  );
};
export default Watch;