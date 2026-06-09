import { useState, useEffect } from "react";
import "./Community.css";
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaPlus, FaCheck, FaShare } from "react-icons/fa";
import { Link } from "react-router-dom";

const DEFAULT_POSTS = [
  {
    id: 1,
    author: "YelTube Tech",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    text: "What framework should we cover in our next deep-dive tutorial series?",
    isPoll: true,
    options: ["React JS", "Django REST", "Python Automation", "NextJS App Router"],
    votes: [42, 28, 15, 64],
    likes: 12,
    likedBy: [],
    comments: [
      { id: 1, author: "Subin", text: "Definitely NextJS!", createdAt: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  },
  {
    id: 2,
    author: "Subin Tech",
    avatar: "https://i.pravatar.cc/150?img=12",
    text: "Building the YelTube React app has been amazing! Thanks to everyone who checked out the stream and supported the channels.",
    isPoll: false,
    likes: 8,
    likedBy: [],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
  }
];

const Community = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [posts, setPosts] = useState([]);
  const [postType, setPostType] = useState("text"); // "text" or "poll"
  
  // New post states
  const [postText, setPostText] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  // Comments inputs mapping (post.id -> comment text)
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentBox, setActiveCommentBox] = useState({});

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem("communityPosts"));
    if (!stored || stored.length === 0) {
      localStorage.setItem("communityPosts", JSON.stringify(DEFAULT_POSTS));
      stored = DEFAULT_POSTS;
    }
    setPosts(stored);
  }, []);

  const savePosts = (updated) => {
    setPosts(updated);
    localStorage.setItem("communityPosts", JSON.stringify(updated));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to create a post.");
      return;
    }
    if (!postText.trim()) {
      alert("Post content cannot be empty.");
      return;
    }

    let newPost = {
      id: Date.now(),
      author: currentUser.name,
      avatar: localStorage.getItem(`profileImage_${currentUser.email.replace(/[@.]/g, "_")}`) || "https://i.pravatar.cc/150",
      text: postText,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    if (postType === "poll") {
      const filteredOptions = pollOptions.filter((o) => o.trim() !== "");
      if (filteredOptions.length < 2) {
        alert("A poll requires at least 2 options.");
        return;
      }
      newPost.isPoll = true;
      newPost.options = filteredOptions;
      newPost.votes = new Array(filteredOptions.length).fill(0);
    }

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Reset inputs
    setPostText("");
    setPollOptions(["", ""]);
    setPostType("text");
  };

  const handleAddOption = () => {
    if (pollOptions.length >= 5) {
      alert("Maximum 5 options permitted.");
      return;
    }
    setPollOptions([...pollOptions, ""]);
  };

  const handleOptionChange = (index, value) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleRemoveOption = (index) => {
    if (pollOptions.length <= 2) return;
    const updated = pollOptions.filter((_, i) => i !== index);
    setPollOptions(updated);
  };

  const handleLikePost = (postId) => {
    if (!currentUser) {
      alert("Please login to like posts.");
      return;
    }
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const likedBy = post.likedBy || [];
        const userEmail = currentUser.email;
        if (likedBy.includes(userEmail)) {
          return {
            ...post,
            likes: Math.max(0, post.likes - 1),
            likedBy: likedBy.filter((e) => e !== userEmail),
          };
        } else {
          return {
            ...post,
            likes: post.likes + 1,
            likedBy: [...likedBy, userEmail],
          };
        }
      }
      return post;
    });
    savePosts(updated);
  };

  const handleVotePoll = (postId, optionIndex) => {
    if (!currentUser) {
      alert("Please login to vote on polls.");
      return;
    }
    
    const voteKey = `poll_voted_${currentUser.email.replace(/[@.]/g, "_")}_${postId}`;
    const alreadyVoted = localStorage.getItem(voteKey);
    
    if (alreadyVoted !== null) {
      alert("You have already voted on this poll.");
      return;
    }

    const updated = posts.map((post) => {
      if (post.id === postId) {
        const currentVotes = [...(post.votes || [])];
        currentVotes[optionIndex] = (currentVotes[optionIndex] || 0) + 1;
        return { ...post, votes: currentVotes };
      }
      return post;
    });

    savePosts(updated);
    localStorage.setItem(voteKey, optionIndex.toString());
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const updated = posts.filter((p) => p.id !== postId);
    savePosts(updated);
  };

  const toggleCommentBox = (postId) => {
    setActiveCommentBox((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentTextChange = (postId, val) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: val }));
  };

  const handleAddComment = (e, postId) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to comment.");
      return;
    }
    const commentText = commentInputs[postId] || "";
    if (!commentText.trim()) return;

    const updated = posts.map((post) => {
      if (post.id === postId) {
        const postComments = post.comments || [];
        return {
          ...post,
          comments: [
            ...postComments,
            {
              id: Date.now(),
              author: currentUser.name,
              text: commentText,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return post;
    });

    savePosts(updated);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="community-page">
      <div className="community-container">
        {/* Create Post Card */}
        {currentUser ? (
          <div className="create-post-card">
            <div className="create-post-tabs">
              <button
                className={`post-tab-btn ${postType === "text" ? "active" : ""}`}
                onClick={() => setPostType("text")}
              >
                Text Post
              </button>
              <button
                className={`post-tab-btn ${postType === "poll" ? "active" : ""}`}
                onClick={() => setPostType("poll")}
              >
                Create Poll
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              <textarea
                placeholder={postType === "text" ? "What's on your mind?" : "Ask a question..."}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                required
                rows={3}
              />

              {postType === "poll" && (
                <div className="poll-options-builder">
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="poll-opt-row">
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        required={i < 2}
                      />
                      {pollOptions.length > 2 && (
                        <button type="button" className="remove-opt-btn" onClick={() => handleRemoveOption(i)}>
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 5 && (
                    <button type="button" className="add-opt-btn" onClick={handleAddOption}>
                      <FaPlus /> Add Option
                    </button>
                  )}
                </div>
              )}

              <div className="create-post-footer">
                <button type="submit" className="post-submit-btn">
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="create-post-card placeholder-card">
            <p>You must be logged in to create posts or interact with the community feed.</p>
            <Link to="/login"><button className="login-redirect-btn">Login to Post</button></Link>
          </div>
        )}

        {/* Feed List */}
        <div className="community-feed">
          {posts.map((post) => {
            const hasLiked = currentUser && post.likedBy?.includes(currentUser.email);
            const userVoteIndex = currentUser
              ? localStorage.getItem(`poll_voted_${currentUser.email.replace(/[@.]/g, "_")}_${post.id}`)
              : null;

            return (
              <div key={post.id} className="feed-card">
                {/* Header */}
                <div className="feed-card-header">
                  <div className="feed-header-left">
                    <img src={post.avatar || "https://i.pravatar.cc/150"} alt="" className="feed-avatar" />
                    <div>
                      <h4>{post.author}</h4>
                      <span className="feed-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {currentUser && (currentUser.name === post.author) && (
                    <button className="delete-post-btn" onClick={() => handleDeletePost(post.id)} title="Delete post">
                      <FaTrash />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="feed-card-body">
                  <p className="feed-text">{post.text}</p>

                  {post.isPoll && (
                    <div className="feed-poll-container">
                      {post.options.map((opt, i) => {
                        const totalVotes = post.votes?.reduce((s, v) => s + v, 0) || 0;
                        const votes = post.votes?.[i] || 0;
                        const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                        const votedForThis = userVoteIndex !== null && parseInt(userVoteIndex) === i;

                        return (
                          <div
                            key={opt}
                            className={`poll-option-row ${userVoteIndex !== null ? "voted-state" : ""} ${votedForThis ? "selected-vote" : ""}`}
                            onClick={() => userVoteIndex === null && handleVotePoll(post.id, i)}
                          >
                            <div className="poll-bg-fill" style={{ width: userVoteIndex !== null ? `${pct}%` : "0%" }}></div>
                            <span className="poll-opt-text">
                              {opt} {votedForThis && <FaCheck className="voted-check" />}
                            </span>
                            {userVoteIndex !== null && <span className="poll-opt-pct">{pct}% ({votes})</span>}
                          </div>
                        );
                      })}
                      {userVoteIndex !== null && (
                        <p className="poll-total-votes">Total: {post.votes?.reduce((s, v) => s + v, 0) || 0} votes</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div className="feed-card-actions">
                  <button className={`feed-action-btn ${hasLiked ? "liked" : ""}`} onClick={() => handleLikePost(post.id)}>
                    {hasLiked ? <FaHeart className="liked-heart" /> : <FaRegHeart />}
                    <span>{post.likes || 0}</span>
                  </button>
                  <button className="feed-action-btn" onClick={() => toggleCommentBox(post.id)}>
                    <FaComment />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>

                {/* Comments Expand Area */}
                {activeCommentBox[post.id] && (
                  <div className="feed-comments-panel">
                    <form onSubmit={(e) => handleAddComment(e, post.id)} className="panel-comment-form">
                      <input
                        type="text"
                        placeholder="Add a public comment..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => handleCommentTextChange(post.id, e.target.value)}
                        required
                      />
                      <button type="submit">Reply</button>
                    </form>

                    <div className="panel-comments-list">
                      {post.comments && post.comments.map((cm) => (
                        <div key={cm.id} className="panel-comment-row">
                          <div className="panel-cm-avatar">{cm.author[0].toUpperCase()}</div>
                          <div className="panel-cm-details">
                            <div className="panel-cm-meta">
                              <strong>{cm.author}</strong>
                              <span>{new Date(cm.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="panel-cm-text">{cm.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Community;
