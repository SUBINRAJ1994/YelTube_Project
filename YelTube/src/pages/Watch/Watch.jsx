import { useParams, Link } from "react-router-dom";
import videos from "../../data/videos";
import "./Watch.css";
import { FaThumbsUp, FaThumbsDown, FaShare, FaClock, FaList, FaEdit, FaTrash, FaReply, FaFlag } from "react-icons/fa";
import { useEffect, useState } from "react";
import ShareModal from "../../components/ShareModal/ShareModal";



const Watch = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [playlists] = useState(
  JSON.parse(
    localStorage.getItem("playlists")
  ) || []
);

const [selectedPlaylist,
setSelectedPlaylist] =
useState("");

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

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
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
          avatar: "https://i.pravatar.cc/40?img=5",
          text: "Very helpful tutorial. Waiting for the next part!",
          likes: 2,
          likedBy: [],
          replies: [
            {
              id: "r_1",
              author: "Code Master",
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

  const uploadedVideos = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
  const allVideos = [...uploadedVideos, ...videos];
  const video = allVideos.find((v) => v.id === parseInt(id, 10));

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

  const relatedVideos = allVideos.filter(
    (item) => video && item.id !== video.id
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
  }
};
  return (
    <div className="watch-page">
      <div className="watch-container">
        {video.videoUrl ? (
          <video
            width="100%"
            height="400px"
            src={video.videoUrl}
            controls
            style={{ borderRadius: "15px", backgroundColor: "black" }}
            onTimeUpdate={(e) => {
              localStorage.setItem(`progress_${video.id}`, e.target.currentTime);
            }}
            onLoadedMetadata={(e) => {
              const progress = localStorage.getItem(`progress_${video.id}`);
              if (progress) {
                e.target.currentTime = parseFloat(progress);
              }
            }}
          />
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
              const isOwnComment = currentUser && currentUser.name === comment.author;

              return (
                <div className="comment-item" key={comment.id}>
                  <img src={comment.avatar || "https://i.pravatar.cc/40"} alt="" className="comment-avatar" />
                  <div className="comment-details">
                    <div className="comment-meta">
                      <strong className="comment-author">{comment.author}</strong>
                      <span className="comment-time">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
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
                            <div className="reply-avatar-placeholder">
                              {reply.author[0].toUpperCase()}
                            </div>
                            <div className="reply-details">
                              <div className="reply-meta">
                                <strong>{reply.author}</strong>
                                <span className="reply-time">
                                  {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : ""}
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