import { useParams, Link } from "react-router-dom";
import videos from "../../data/videos";
import "./Watch.css";
import { FaThumbsUp, FaThumbsDown, FaShare, FaClock, FaList, FaEdit, FaTrash, FaReply, FaFlag, FaCog } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import ShareModal from "../../components/ShareModal/ShareModal";
import { pushNotification } from "../../utils/notifications";



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
  const uploadedVideos = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
  const allVideos = [...uploadedVideos, ...videos];
  const video = allVideos.find((v) => v.id === parseInt(id, 10));
  const relatedVideos = allVideos.filter(
    (item) => video && item.id !== video.id
  );

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [likes, setLikes] = useState(() => {
    if (!video) return 0;
    const stored = localStorage.getItem(`video_likes_${video.id}`);
    if (stored !== null) return parseInt(stored, 10);
    return video.likes || Math.floor(Math.random() * 200) + 12;
  });

  const [dislikes, setDislikes] = useState(() => {
    if (!video) return 0;
    const stored = localStorage.getItem(`video_dislikes_${video.id}`);
    if (stored !== null) return parseInt(stored, 10);
    return video.dislikes || Math.floor(Math.random() * 15) + 2;
  });

  const [liked, setLiked] = useState(() => {
    if (!currentUser || !video) return false;
    return localStorage.getItem(`liked_${currentUser.email}_${video.id}`) === "true";
  });

  const [disliked, setDisliked] = useState(() => {
    if (!currentUser || !video) return false;
    return localStorage.getItem(`disliked_${currentUser.email}_${video.id}`) === "true";
  });

  const [playlists] = useState(
    JSON.parse(localStorage.getItem("playlists")) || []
  );

  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  const handleLike = () => {
    if (!currentUser) {
      alert("Please log in to like videos.");
      return;
    }

    let newLikes = likes;
    let newDislikes = dislikes;
    let newLiked = !liked;
    let newDisliked = disliked;

    if (newLiked) {
      newLikes += 1;
      localStorage.setItem(`liked_${currentUser.email}_${video.id}`, "true");
      
      pushNotification("likes", `You liked the video: "${video.title}"`);
      
      if (disliked) {
        newDislikes = Math.max(0, newDislikes - 1);
        newDisliked = false;
        localStorage.setItem(`disliked_${currentUser.email}_${video.id}`, "false");
      }
      
      // Save to liked videos list
      let likedList = JSON.parse(localStorage.getItem("likedVideos")) || [];
      if (!likedList.some(item => item.id === video.id)) {
        likedList.unshift(video);
        localStorage.setItem("likedVideos", JSON.stringify(likedList));
      }
    } else {
      newLikes = Math.max(0, newLikes - 1);
      localStorage.setItem(`liked_${currentUser.email}_${video.id}`, "false");
      
      let likedList = JSON.parse(localStorage.getItem("likedVideos")) || [];
      likedList = likedList.filter(item => item.id !== video.id);
      localStorage.setItem("likedVideos", JSON.stringify(likedList));
    }

    setLikes(newLikes);
    setDislikes(newDislikes);
    setLiked(newLiked);
    setDisliked(newDisliked);

    localStorage.setItem(`video_likes_${video.id}`, newLikes);
    localStorage.setItem(`video_dislikes_${video.id}`, newDislikes);
  };

  const handleDislike = () => {
    if (!currentUser) {
      alert("Please log in to dislike videos.");
      return;
    }

    let newLikes = likes;
    let newDislikes = dislikes;
    let newLiked = liked;
    let newDisliked = !disliked;

    if (newDisliked) {
      newDislikes += 1;
      localStorage.setItem(`disliked_${currentUser.email}_${video.id}`, "true");
      
      if (liked) {
        newLikes = Math.max(0, newLikes - 1);
        newLiked = false;
        localStorage.setItem(`liked_${currentUser.email}_${video.id}`, "false");
        
        let likedList = JSON.parse(localStorage.getItem("likedVideos")) || [];
        likedList = likedList.filter(item => item.id !== video.id);
        localStorage.setItem("likedVideos", JSON.stringify(likedList));
      }
    } else {
      newDislikes = Math.max(0, newDislikes - 1);
      localStorage.setItem(`disliked_${currentUser.email}_${video.id}`, "false");
    }

    setLikes(newLikes);
    setDislikes(newDislikes);
    setLiked(newLiked);
    setDisliked(newDisliked);

    localStorage.setItem(`video_likes_${video.id}`, newLikes);
    localStorage.setItem(`video_dislikes_${video.id}`, newDislikes);
  };
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [activeReplyBoxId, setActiveReplyBoxId] = useState(null);

  useEffect(() => {
    if (!video) return;
    const key = `comments_${video.id}`;
    let loaded = JSON.parse(localStorage.getItem(key));
    if (!loaded || loaded.length === 0) {
      const defaults = [
        {
          id: "c_1",
          author: "Jane Miller",
          email: "jane@yeltube.com",
          avatar: "https://i.pravatar.cc/40?img=5",
          text: "Very helpful tutorial. Waiting for the next part!",
          likes: 2,
          likedBy: [],
          replies: [
            {
              id: "r_1",
              author: "Code Master",
              email: "codemaster@yeltube.com",
              text: "Next part is dropping this Friday!",
              createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
            }
          ],
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          reported: false
        },
        {
          id: "c_2",
          author: "Subin Tech",
          email: "subin@yeltube.com",
          avatar: "https://i.pravatar.cc/40?img=11",
          text: "Awesome video 🔥 Thanks for the share!",
          likes: 5,
          likedBy: [],
          replies: [],
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          reported: false
        }
      ];
      localStorage.setItem(key, JSON.stringify(defaults));
      loaded = defaults;
    }
    setComments(loaded);
  }, [id, video]);

  const saveComments = (updated) => {
    setComments(updated);
    localStorage.setItem(`comments_${video.id}`, JSON.stringify(updated));
  };

  const addComment = () => {
    if (commentInput.trim() === "") return;
    
    const emailKey = currentUser ? currentUser.email.replace(/[@.]/g, "_") : "";
    const avatar = currentUser ? (localStorage.getItem(`profileImage_${emailKey}`) || "https://i.pravatar.cc/40") : "https://i.pravatar.cc/40";
    
    const newComment = {
      id: "c_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      author: currentUser ? currentUser.name : "Anonymous",
      email: currentUser ? currentUser.email : "",
      avatar: avatar,
      text: commentInput,
      likes: 0,
      likedBy: [],
      replies: [],
      createdAt: new Date().toISOString(),
      reported: false
    };

    const updated = [newComment, ...comments];
    saveComments(updated);
    
    pushNotification("comments", `You commented on "${video.title}": "${commentInput.substring(0, 30)}..."`);
    
    // Simulate creator reaction after a short delay
    setTimeout(() => {
      pushNotification("likes", `${video.channel} liked your comment on "${video.title}"!`);
    }, 4000);

    setCommentInput("");
  };

  const handleLikeComment = (commentId) => {
    if (!currentUser) {
      alert("Please login to like comments.");
      return;
    }
    const email = currentUser.email;
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        const likedBy = c.likedBy || [];
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
    });
    saveComments(updated);
  };

  const handlePostReply = (commentId) => {
    const text = replyInputs[commentId] || "";
    if (!text.trim()) return;

    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              id: "r_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
              author: currentUser ? currentUser.name : "Anonymous",
              email: currentUser ? currentUser.email : "",
              text: text,
              createdAt: new Date().toISOString(),
            }
          ]
        };
      }
      return c;
    });

    saveComments(updated);
    setReplyInputs({ ...replyInputs, [commentId]: "" });
    setActiveReplyBoxId(null);
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const handleSaveEdit = (commentId) => {
    if (!editCommentText.trim()) return;
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return { ...c, text: editCommentText };
      }
      return c;
    });
    saveComments(updated);
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    const updated = comments.filter((c) => c.id !== commentId);
    saveComments(updated);
  };

  const handleReportComment = (comment) => {
    if (!window.confirm("Report this comment for spam or abuse?")) return;
    const updated = comments.map((c) => {
      if (c.id === comment.id) {
        return { ...c, reported: true };
      }
      return c;
    });
    saveComments(updated);

    // Log to adminReports
    const reports = JSON.parse(localStorage.getItem("adminReports")) || [];
    const newReport = {
      id: Date.now(),
      type: "comment",
      content: comment.text,
      reporter: currentUser ? currentUser.name : "Anonymous",
      targetId: comment.id,
      videoId: video.id,
      videoTitle: video.title,
      createdAt: new Date().toISOString(),
    };
    reports.push(newReport);
    localStorage.setItem("adminReports", JSON.stringify(reports));
    alert("Thank you. This comment has been flagged for administrator review.");
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
const handleWatchLater = () => {
  let watchLater = JSON.parse(localStorage.getItem("watchLater")) || [];
  const alreadyExists = watchLater.some((item) => item.id === video.id);
  if (alreadyExists){
    alert("Already added to Watch Later");
    return;
  }
  watchLater.unshift(video);
  localStorage.setItem("watchLater", JSON.stringify(watchLater));
  alert("Added to Watch Later");
}
  const [showShareModal, setShowShareModal] = useState(false);
  const handleShare = () => {
    setShowShareModal(true);
  };
const addToPlaylist = () => {

  if (!selectedPlaylist) {

    alert("Select a Playlist");

    return;

  }

  let allPlaylists =
    JSON.parse(
      localStorage.getItem(
        "playlists"
      )
    ) || [];

  allPlaylists =
    allPlaylists.map(
      (playlist) => {

        if (
          playlist.id ===
          Number(selectedPlaylist)
        ) {

          const exists =
            playlist.videos.some(
              (item) =>
                item.id === video.id
            );

          if (!exists) {
            playlist.videos.push(video);
          } else {
            alert("Video already in playlist");
          }

        }

        return playlist;

      }
    );

  localStorage.setItem(
    "playlists",
    JSON.stringify(
      allPlaylists
    )
  );

  alert(
    "Added to Playlist"
  );

};
const handleSubscribe = () => {
  let subscriptions =
    JSON.parse(
      localStorage.getItem("subscriptions")
    ) || [];

  if (!subscribed) {
    if (!subscriptions.includes(video.channel)) {
      subscriptions.push(video.channel);

      localStorage.setItem(
        "subscriptions",
        JSON.stringify(subscriptions)
      );
    }

    setSubscribed(true);
    setSubscriberCount((prev) => prev + 1);
    pushNotification("subscriptions", `You subscribed to ${video.channel}!`);
  } else {
    subscriptions = subscriptions.filter(
      (channel) => channel !== video.channel
    );

    localStorage.setItem(
      "subscriptions",
      JSON.stringify(subscriptions)
    );

    setSubscribed(false);
    setSubscriberCount((prev) => prev - 1);
    pushNotification("subscriptions", `You unsubscribed from ${video.channel}.`);
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