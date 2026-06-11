import "./Shorts.css";
<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
import shortsData from "../../data/shortsData";
import {
  FaHeart,
  FaHeartBroken,
  FaComment,
  FaTrash,
  FaClock,
  FaMusic,
  FaPlusCircle,
} from "react-icons/fa";

const Shorts = () => {
<<<<<<< HEAD
  // Initialize state from localStorage or defaults
=======
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef([]);
  const videoRefs = useRef({});

  // Initialize state with correct 'commentsList' key to avoid undefined bugs
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
  const [shortsState, setShortsState] = useState(() => {
    const saved = localStorage.getItem("shortsData");
    return saved
      ? JSON.parse(saved)
      : shortsData.map((video) => ({
          ...video,
          likes: video.like || Math.floor(Math.random() * 200) + 12,
          dislikes: Math.floor(Math.random() * 10),
          liked: false,
          disliked: false,
          commentsList: [
            { id: 1, user: "Alex_YT", text: "Wow, this is so smooth! 🔥" },
            { id: 2, user: "Jane_Dev", text: "TikTok layout on YelTube? Yes please!" }
          ],
          showComments: false,
          commentInput: "",
        }));
  });

  const videoRefs = useRef({});
  const containerRef = useRef(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("shortsData", JSON.stringify(shortsState));
  }, [shortsState]);

<<<<<<< HEAD
  // Setup IntersectionObserver for play/pause states on visible items
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            // Pause all other videos first
            Object.values(videoRefs.current).forEach((v) => {
              if (v && v !== video) {
                try { v.pause(); } catch (e) {}
              }
            });
            // Play target video
            video.play().catch((err) => {
              console.log("Autoplay blocked: ", err);
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    const currentRefs = videoRefs.current;
    Object.values(currentRefs).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      Object.values(currentRefs).forEach((video) => {
        if (video) observer.unobserve(video);
      });
      observer.disconnect();
    };
  }, [shortsState]);

  // Keyboard Navigation: ArrowUp / ArrowDown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;

        const cardHeight = container.clientHeight;
        const currentScroll = container.scrollTop;
        let targetScroll = currentScroll;

        if (e.key === "ArrowDown") {
          targetScroll = currentScroll + cardHeight;
        } else {
          targetScroll = currentScroll - cardHeight;
        }

        container.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Floating button scroll handler
  const scrollShort = (direction) => {
    const container = containerRef.current;
    if (!container) return;
    const cardHeight = container.clientHeight;
    const currentScroll = container.scrollTop;

    container.scrollTo({
      top: direction === "down" ? currentScroll + cardHeight : currentScroll - cardHeight,
      behavior: "smooth",
    });
  };

  // Infinite Scroll Trigger
  const handleScroll = (e) => {
    const container = e.target;
    const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 300;
    
    if (isNearBottom) {
      // Append a randomized/cloned copy of base data to create infinite feed
      setShortsState((prev) => {
        const cloned = shortsData.map((video) => ({
          ...video,
          id: `clone_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          likes: video.like || Math.floor(Math.random() * 200) + 12,
          dislikes: Math.floor(Math.random() * 10),
          liked: false,
          disliked: false,
          commentsList: [
            { id: 1, user: "Viewer_" + Math.floor(Math.random() * 900), text: "Awesome content! 🚀" }
          ],
          showComments: false,
          commentInput: "",
        }));
        return [...prev, ...cloned];
      });
    }
  };
=======
  // Keyboard navigation & scroll snapping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, shortsState.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortsState.length]);

  // Scroll active card into view
  useEffect(() => {
    cardRefs.current[activeIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeIndex]);

  // Play only active video, pause others
  useEffect(() => {
    shortsState.forEach((s, idx) => {
      const vid = videoRefs.current[s.id];
      if (vid) {
        if (idx === activeIndex) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      }
    });
  }, [activeIndex, shortsState]);
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

  const handleLike = (id) => {
    if (!currentUser) {
      alert("Please login to like this short.");
      navigate("/login");
      return;
    }
    setShortsState((prev) =>
      prev.map((short) => {
        if (short.id !== id) return short;

        let updatedShort;
        if (!short.liked) {
          updatedShort = {
            ...short,
            likes: short.likes + 1,
            dislikes: short.disliked ? Math.max(0, short.dislikes - 1) : short.dislikes,
            liked: true,
            disliked: false,
          };

          let likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || [];
          if (!likedVideos.some((item) => item.id === short.id)) {
            likedVideos.unshift(updatedShort);
            localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
          }
        } else {
          updatedShort = {
            ...short,
            likes: Math.max(0, short.likes - 1),
            liked: false,
          };

          let likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || [];
          likedVideos = likedVideos.filter((item) => item.id !== short.id);
          localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
        }

        return updatedShort;
      })
    );
  };

  const handleDislike = (id) => {
    if (!currentUser) {
      alert("Please login to dislike this short.");
      navigate("/login");
      return;
    }
    setShortsState((prev) =>
      prev.map((short) => {
        if (short.id !== id) return short;

        if (!short.disliked) {
          let updatedShort = {
            ...short,
            dislikes: short.dislikes + 1,
            likes: short.liked ? Math.max(0, short.likes - 1) : short.likes,
            liked: false,
            disliked: true,
          };

          let likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || [];
          likedVideos = likedVideos.filter((item) => item.id !== short.id);
          localStorage.setItem("likedVideos", JSON.stringify(likedVideos));

          return updatedShort;
        } else {
          return {
            ...short,
            dislikes: Math.max(0, short.dislikes - 1),
            disliked: false,
          };
        }
      })
    );
  };

  const handleWatchLater = (short) => {
    if (!currentUser) {
      alert("Please login to save shorts to Watch Later.");
      navigate("/login");
      return;
    }
    let watchLater = JSON.parse(localStorage.getItem("watchLater")) || [];
    if (watchLater.some((item) => item.id === short.id)) {
      alert("Already added to Watch Later");
      return;
    }
    watchLater.unshift(short);
    localStorage.setItem("watchLater", JSON.stringify(watchLater));
    alert("Added to Watch Later");
  };

  const toggleComments = (id) => {
    setShortsState((prev) =>
      prev.map((short) =>
        short.id === id
          ? { ...short, showComments: !short.showComments }
          : short
      )
    );
  };

  const handleCommentChange = (id, value) => {
    setShortsState((prev) =>
      prev.map((short) =>
        short.id === id ? { ...short, commentInput: value } : short
      )
    );
  };

  const addComment = (id) => {
    if (!currentUser) {
      alert("Please login to write comments.");
      navigate("/login");
      return;
    }
    setShortsState((prev) =>
      prev.map((short) => {
        if (short.id !== id) return short;
        if (!short.commentInput.trim()) return short;

        return {
          ...short,
          commentsList: [
            ...(short.commentsList || []),
            {
              id: Date.now(),
              user: currentUser ? currentUser.name : "You",
              text: short.commentInput,
              likes: 0,
              dislikes: 0,
              liked: false,
              disliked: false,
            },
          ],
          commentInput: "",
        };
      })
    );
  };

  const deleteComment = (shortId, commentId) => {
    setShortsState((prev) =>
      prev.map((short) =>
        short.id === shortId
          ? {
              ...short,
              commentsList: (short.commentsList || []).filter(
                (comment) => comment.id !== commentId
              ),
            }
          : short
      )
    );
  };

  const likeComment = (shortId, commentId) => {
    if (!currentUser) {
      alert("Please login to like comments.");
      navigate("/login");
      return;
    }
    setShortsState((prev) =>
      prev.map((short) => {
        if (short.id !== shortId) return short;

        return {
          ...short,
          commentsList: (short.commentsList || []).map((comment) => {
            if (comment.id !== commentId) return comment;

            if (!comment.liked) {
              return {
                ...comment,
                likes: comment.likes + 1,
                dislikes: comment.disliked ? Math.max(0, comment.dislikes - 1) : comment.dislikes,
                liked: true,
                disliked: false,
              };
            } else {
              return {
                ...comment,
                likes: Math.max(0, comment.likes - 1),
                liked: false,
              };
            }
          }),
        };
      })
    );
  };

  const dislikeComment = (shortId, commentId) => {
    if (!currentUser) {
      alert("Please login to dislike comments.");
      navigate("/login");
      return;
    }
    setShortsState((prev) =>
      prev.map((short) => {
        if (short.id !== shortId) return short;

        return {
          ...short,
          commentsList: (short.commentsList || []).map((comment) => {
            if (comment.id !== commentId) return comment;

            if (!comment.disliked) {
              return {
                ...comment,
                dislikes: comment.dislikes + 1,
                likes: comment.liked ? Math.max(0, comment.likes - 1) : comment.likes,
                disliked: true,
                liked: false,
              };
            } else {
              return {
                ...comment,
                dislikes: Math.max(0, comment.dislikes - 1),
                disliked: false,
              };
            }
          }),
        };
      })
    );
  };

  const togglePlayVideo = (e) => {
    const video = e.target;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div className="shorts-page">
<<<<<<< HEAD
      {/* Floating Create Short button */}
      <Link to="/upload?category=Shorts" className="create-short-btn-floating" title="Create Short">
        <FaPlusCircle />
        <span>Create Short</span>
      </Link>

      {/* Floating Up/Down snap scroll hover buttons */}
      <div className="shorts-navigation-buttons">
        <button className="nav-btn up" onClick={() => scrollShort("up")} title="Previous Short">▲</button>
        <button className="nav-btn down" onClick={() => scrollShort("down")} title="Next Short">▼</button>
      </div>

      <div className="shorts-scroll-container" ref={containerRef} onScroll={handleScroll}>
        {shortsState.map((short) => {
          const channelHandle = `@creator_${short.id.toString().substring(0, 5)}`;
          const avatarUrl = `https://ui-avatars.com/api/?name=C${short.id.toString().substring(0,1)}&background=ff0000&color=ffffff&bold=true`;
=======
      <div className="shorts-scroll-container">
        {shortsState.map((short, idx) => {
          const channelHandle = `@creator_${short.id}`;
          const avatarUrl = `https://ui-avatars.com/api/?name=C${short.id}&background=ff0000&color=ffffff&bold=true`;
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

          return (
            <div 
              className={`short-card ${idx === activeIndex ? "active-card" : ""}`} 
              key={short.id}
              ref={(el) => { cardRefs.current[idx] = el; }}
            >
              <div className="short-video-container">
                <video
<<<<<<< HEAD
                  ref={(el) => {
                    if (el) {
                      videoRefs.current[short.id] = el;
                    } else {
                      delete videoRefs.current[short.id];
                    }
                  }}
=======
                  ref={(el) => { videoRefs.current[short.id] = el; }}
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
                  src={short.video}
                  className="short-video"
                  muted
                  loop
                  onClick={togglePlayVideo}
                />

                {/* Bottom-left metadata overlays */}
                <div className="short-info-overlay">
                  <h4 className="short-creator-name">{channelHandle}</h4>
                  <p className="short-description">{short.title}</p>
                  <div className="short-music-scroller">
                    <FaMusic className="music-icon-scroller" />
                    <div className="scrolling-text-container">
                      <span className="scrolling-text">
                        Original Sound - {channelHandle} • Original Sound - {channelHandle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right vertical action column overlays */}
                <div className="short-actions">
                  <div className="action-avatar-group">
                    <img src={avatarUrl} alt="Creator" className="action-avatar-img" />
                    <div className="avatar-plus-btn">+</div>
                  </div>

                  {/* LIKE */}
                  <div className="action-btn-group">
                    <button
                      className={`action-btn like ${short.liked ? "active" : ""}`}
                      onClick={() => handleLike(short.id)}
                      title="Like"
                    >
                      <FaHeart />
                    </button>
                    <p className="counter">{short.likes}</p>
                  </div>

                  {/* DISLIKE */}
                  <div className="action-btn-group">
                    <button
                      className={`action-btn dislike ${short.disliked ? "active" : ""}`}
                      onClick={() => handleDislike(short.id)}
                      title="Dislike"
                    >
                      <FaHeartBroken />
                    </button>
                    <p className="counter">{short.dislikes}</p>
                  </div>

                  {/* COMMENT */}
                  <div className="action-btn-group">
                    <button
                      className={`action-btn comment ${short.showComments ? "active" : ""}`}
                      onClick={() => toggleComments(short.id)}
                      title="Comments"
                    >
                      <FaComment />
                    </button>
                    <p className="counter">{(short.commentsList || []).length}</p>
                  </div>

                  {/* SAVE / WATCH LATER */}
                  <div className="action-btn-group">
                    <button
                      className="action-btn watch-later"
                      onClick={() => handleWatchLater(short)}
                      title="Save"
                    >
                      <FaClock />
                    </button>
                    <p className="counter">Save</p>
                  </div>

                  {/* Rotating Record Disc */}
                  <div className="action-music-record">
                    <img src={avatarUrl} alt="Music Track Logo" className="record-disc-img" />
                  </div>
                </div>

                {/* Glassmorphic sliding comments panel */}
                {short.showComments && (
                  <div className="comments-overlay-panel">
                    <div className="comments-overlay-header">
                      <h3>Comments ({(short.commentsList || []).length})</h3>
                      <button className="close-comments-btn" onClick={() => toggleComments(short.id)}>✕</button>
                    </div>

                    <div className="comments-overlay-list">
                      {(!short.commentsList || short.commentsList.length === 0) ? (
                        <p className="no-comments">No comments yet. Be the first to reply!</p>
                      ) : (
                        short.commentsList.map((comment) => (
                          <div key={comment.id} className="comment-overlay-item">
                            <div className="comment-overlay-user-logo">
                              {comment.user[0].toUpperCase()}
                            </div>
                            <div className="comment-overlay-body">
                              <div className="comment-overlay-user-row">
                                <strong>{comment.user}</strong>
                              </div>
                              <p className="comment-overlay-text">{comment.text}</p>
                              <div className="comment-overlay-actions">
                                <button onClick={() => likeComment(short.id, comment.id)} className={comment.liked ? "liked" : ""}>
                                  ❤️ {comment.likes}
                                </button>
                                <button onClick={() => dislikeComment(short.id, comment.id)} className={comment.disliked ? "disliked" : ""}>
                                  💔 {comment.dislikes}
                                </button>
                                <button
                                  className="delete-comment"
                                  onClick={() => deleteComment(short.id, comment.id)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="comment-overlay-input-area">
                      <input
                        type="text"
                        placeholder="Add comment..."
                        value={short.commentInput || ""}
                        onChange={(e) => handleCommentChange(short.id, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addComment(short.id)}
                      />
                      <button onClick={() => addComment(short.id)}>Post</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shorts;