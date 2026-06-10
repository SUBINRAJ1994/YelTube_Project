import "./LiveStream.css";
import { useState, useEffect, useRef } from "react";
import {
  FaShare,
  FaEye,
  FaBell,
  FaPaperPlane,
  FaCircle,
  FaThumbsUp,
  FaThumbsDown,
  FaUserCircle,
  FaGem,
  FaShieldAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

// Simulated chat messages with usernames, colors, and potential mod status
const MOCK_CHAT = [
  { id: 1, user: "Alex_YT",      color: "#ff6b6b", text: "Let's gooo!! 🔥🔥",                    time: "12:01", isModerator: true },
  { id: 2, user: "StreamFan99",  color: "#ffd93d", text: "First!! Amazing stream!",               time: "12:01" },
  { id: 3, user: "CodeWithMia",  color: "#6bcbff", text: "Love the content, keep it up 👏",       time: "12:02", isModerator: true },
  { id: 4, user: "DevJordan",    color: "#b388ff", text: "This is insane quality 🎮",             time: "12:02" },
  { id: 5, user: "TechTalks",    color: "#69f0ae", text: "Been waiting for this all week!",       time: "12:03" },
  { id: 6, user: "GamerXZ",      color: "#ff8a65", text: "Can you do a tutorial next?",           time: "12:03" },
  { id: 7, user: "NightOwl_22",  color: "#80cbc4", text: "Stream quality is top notch 🙌",        time: "12:04" },
  { id: 8, user: "PixelPete",    color: "#f48fb1", text: "Just subscribed! 🔔",                   time: "12:04" },
];

const STREAMER = {
  name: "YelTube Official",
  avatar: "https://i.pravatar.cc/48?img=5",
  title: "🎬 Building the Future of Video | YelTube Live Dev Session",
  category: "Science & Technology",
  viewers: 4821,
  likes: 1203,
  subscribers: "128K",
  description:
    "Welcome to the official YelTube Live Dev Session! Today we're building the YelTube Live Streaming system from scratch using React and Django. We'll cover real-time chat, video embedding, localStorage persistence, and premium UI design. Drop your questions in the chat — let's build together! 🚀",
};

const CHAT_COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcbff", "#b388ff",
  "#69f0ae", "#ff8a65", "#80cbc4", "#f48fb1", "#ffcc80",
];

const SUPERCHAT_TIERS = [
  { amount: 2, color: "#1e88e5", tier: "2", label: "$2", minChars: 10, maxChars: 50 },
  { amount: 5, color: "#00e676", tier: "5", label: "$5", minChars: 10, maxChars: 100 },
  { amount: 10, color: "#ffea00", tier: "10", label: "$10", minChars: 10, maxChars: 150 },
  { amount: 50, color: "#ff9100", tier: "50", label: "$50", minChars: 10, maxChars: 200 },
  { amount: 100, color: "#dd2c00", tier: "100", label: "$100", minChars: 10, maxChars: 250 },
];

const UPCOMING_STREAMS = [
  { id: 1, title: "🔥 React 19 Feature Deep Dive & Live Coding", time: "Friday, June 12 at 6:00 PM", key: "react19" },
  { id: 2, title: "💻 Backend API Design with Django REST Framework", time: "Monday, June 15 at 7:00 PM", key: "django" },
  { id: 3, title: "🎨 Premium CSS Animations & Glassmorphic Styling", time: "Saturday, June 20 at 5:00 PM", key: "cssanim" },
];

let msgIdCounter = 100;

const LiveStream = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ── Persistent: chat messages ──
  const [messages, setMessages] = useState(() =>
    JSON.parse(localStorage.getItem("liveChat")) || MOCK_CHAT
  );

  // ── Persistent: liked state ──
  const [liked, setLiked] = useState(() =>
    JSON.parse(localStorage.getItem("liveLiked")) || false
  );
  const [disliked, setDisliked] = useState(() =>
    JSON.parse(localStorage.getItem("liveDisliked")) || false
  );
  const [likeCount, setLikeCount] = useState(STREAMER.likes);

  // ── Persistent: subscribed state ──
  const [subscribed, setSubscribed] = useState(() =>
    JSON.parse(localStorage.getItem("liveSubscribed")) || false
  );

  // ── Persistent: follower count ──
  const [followers, setFollowers] = useState(() =>
    parseInt(localStorage.getItem("streamFollowers")) || 3240
  );

  // ── Persistent: Pinned Message ──
  const [pinnedMessage, setPinnedMessage] = useState(() =>
    JSON.parse(localStorage.getItem("livePinnedMessage")) || null
  );

  // ── Persistent: Reminders Map ──
  const [reminders, setReminders] = useState(() =>
    JSON.parse(localStorage.getItem("liveReminders")) || {}
  );

  const [viewers, setViewers]   = useState(STREAMER.viewers);
  const [input,   setInput]     = useState("");
  const [showDesc, setShowDesc] = useState(false);
  const chatEndRef = useRef(null);

  // Super Chat states
  const [showSCModal, setShowSCModal] = useState(false);
  const [scTier, setScTier] = useState(SUPERCHAT_TIERS[0]);
  const [scText, setScText] = useState("");

  // ── Persist chat ──
  useEffect(() => {
    localStorage.setItem("liveChat", JSON.stringify(messages));
  }, [messages]);

  // ── Persist liked ──
  useEffect(() => {
    localStorage.setItem("liveLiked", JSON.stringify(liked));
  }, [liked]);

  // ── Persist disliked ──
  useEffect(() => {
    localStorage.setItem("liveDisliked", JSON.stringify(disliked));
  }, [disliked]);

  // ── Persist subscribed ──
  useEffect(() => {
    localStorage.setItem("liveSubscribed", JSON.stringify(subscribed));
  }, [subscribed]);

  // ── Persist followers ──
  useEffect(() => {
    localStorage.setItem("streamFollowers", followers);
  }, [followers]);

  // ── Persist Pinned Message ──
  useEffect(() => {
    localStorage.setItem("livePinnedMessage", JSON.stringify(pinnedMessage));
  }, [pinnedMessage]);

  // ── Persist Reminders ──
  useEffect(() => {
    localStorage.setItem("liveReminders", JSON.stringify(reminders));
  }, [reminders]);

  // ── Auto-scroll chat ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Simulate live chat bots ──
  useEffect(() => {
    const bots = [
      { user: "RandomViewer", color: "#ffcc80", texts: ["This is great!", "🔥🔥🔥", "Wow amazing!", "Love it!"], isModerator: false },
      { user: "LiveFan_007",  color: "#80deea", texts: ["When is the next stream?", "Keep going!", "👏👏👏"], isModerator: false },
      { user: "YelTubeUser",  color: "#ce93d8", texts: ["Just joined!", "Hello everyone!", "Great content 🎉"], isModerator: false },
      { user: "ModeratorPro", color: "#ff8a65", texts: ["Please keep the chat respectful!", "Check out the schedule below!", "Super Chat is active! 🚀"], isModerator: true },
    ];
    const interval = setInterval(() => {
      const bot  = bots[Math.floor(Math.random() * bots.length)];
      const text = bot.texts[Math.floor(Math.random() * bot.texts.length)];
      const now  = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
      setMessages((prev) => [
        ...prev.slice(-50),
        { id: ++msgIdCounter, user: bot.user, color: bot.color, text, time, isModerator: bot.isModerator },
      ]);
      setViewers((v) => Math.max(1, v + Math.floor(Math.random() * 3 - 1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Handlers ──
  const sendMessage = () => {
    if (!currentUser) {
      alert("Please login first to send a message.");
      navigate("/login");
      return;
    }
    if (!input.trim()) return;
    const now      = new Date();
    const time     = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const username = currentUser?.name || "Guest";
    const color    = CHAT_COLORS[Math.floor(Math.random() * CHAT_COLORS.length)];
    setMessages((prev) => [
      ...prev,
      { id: ++msgIdCounter, user: username, color, text: input.trim(), time, isModerator: false },
    ]);
    setInput("");
  };

  const sendSuperChat = () => {
    if (!currentUser) {
      alert("Please login first to send a Super Chat.");
      navigate("/login");
      return;
    }
    if (!scText.trim()) return;

    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const username = currentUser.name;

    const newSC = {
      id: ++msgIdCounter,
      user: username,
      color: "#ff0000",
      text: scText.trim(),
      time,
      isSuperChat: true,
      amount: scTier.amount,
      tier: scTier.tier,
    };

    setMessages((prev) => [...prev, newSC]);
    setPinnedMessage(newSC); // Auto pin the new Super Chat!
    setScText("");
    setShowSCModal(false);
  };

  const handleLike = () => {
    if (!currentUser) {
      alert("Please login first to like the stream.");
      navigate("/login");
      return;
    }
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      if (disliked) setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (!currentUser) {
      alert("Please login first to dislike the stream.");
      navigate("/login");
      return;
    }
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      if (liked) {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }
    }
  };

  const handleSubscribe = () => {
    if (!currentUser) {
      alert("Please login first to subscribe.");
      navigate("/login");
      return;
    }
    const next = !subscribed;
    setSubscribed(next);
    setFollowers((f) => next ? f + 1 : Math.max(0, f - 1));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Stream link copied!");
  };

  const handleSuperChat = () => {
    if (!currentUser) {
      alert("Please login first to send a Super Chat.");
      return;
    }
    setShowSCModal(true);
  };

  const clearChat = () => {
    setMessages(MOCK_CHAT);
  };

  const toggleReminder = (streamKey) => {
    if (!currentUser) {
      alert("Please login first to toggle reminders.");
      navigate("/login");
      return;
    }
    setReminders((prev) => {
      const updated = { ...prev, [streamKey]: !prev[streamKey] };
      return updated;
    });
  };

  const pinMessage = (msg) => {
    setPinnedMessage(msg);
  };

  return (
    <div className="live-page">
      <div className="live-layout">

        {/* ===== LEFT: Video + Info ===== */}
        <div className="live-main">

          {/* Video Player */}
          <div className="live-player-wrapper">
            <div className="live-badge">
              <FaCircle className="live-dot" /> LIVE
            </div>
            <div className="live-viewer-count">
              <FaEye /> {viewers.toLocaleString()} watching
            </div>
            <iframe
              className="live-iframe"
              src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1"
              title="Live Stream"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>

          {/* Stream Info Bar */}
          <div className="live-info">
            <div className="live-info-top">
              <h1 className="live-title">{STREAMER.title}</h1>
              <div className="live-actions">
                <button
                  className={`action-btn like-btn ${liked ? "liked" : ""}`}
                  onClick={handleLike}
                  title="Like"
                >
                  <FaThumbsUp /> {likeCount.toLocaleString()}
                </button>
                <button
                  className={`action-btn dislike-btn ${disliked ? "disliked" : ""}`}
                  onClick={handleDislike}
                  title="Dislike"
                >
                  <FaThumbsDown /> Dislike
                </button>
                <button className="action-btn" onClick={handleShare} title="Share">
                  <FaShare /> Share
                </button>
                <button className="action-btn super-chat-btn" onClick={handleSuperChat} title="Super Chat">
                  <FaGem /> Super Chat
                </button>
              </div>
            </div>

            {/* Channel Row */}
            <div className="live-channel-row">
              <img
                src={STREAMER.avatar}
                alt={STREAMER.name}
                className="streamer-avatar"
              />
              <div className="streamer-meta">
                <span className="streamer-name">{STREAMER.name}</span>
                <span className="streamer-subs">{STREAMER.subscribers} subscribers</span>
              </div>
              <button
                className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
                onClick={handleSubscribe}
              >
                <FaBell />
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>

              {/* Follower Counter */}
              <div className="follower-counter">
                <FaBell className="follower-icon" />
                <span className="follower-count">{followers.toLocaleString()}</span>
                <span className="follower-label">Followers</span>
              </div>

              <span className="live-category">📁 {STREAMER.category}</span>
            </div>

            {/* Stream Description */}
            <div className="stream-description">
              <button
                className="desc-toggle"
                onClick={() => setShowDesc((s) => !s)}
              >
                About This Stream {showDesc ? "▲" : "▼"}
              </button>
              {showDesc && (
                <p className="desc-text">{STREAMER.description}</p>
              )}
            </div>
          </div>

          {/* Stream Schedule Card */}
          <div className="stream-schedule-container">
            <h3>📅 Live Stream Schedule</h3>
            <div className="schedule-grid">
              {UPCOMING_STREAMS.map((stream) => {
                const isReminded = reminders[stream.key];
                return (
                  <div key={stream.id} className="schedule-card">
                    <div className="schedule-card-info">
                      <h4>{stream.title}</h4>
                      <p>{stream.time}</p>
                    </div>
                    <button
                      className={`reminder-btn ${isReminded ? "reminded" : ""}`}
                      onClick={() => toggleReminder(stream.key)}
                    >
                      <FaBell />
                      {isReminded ? "Reminder Set ✓" : "Notify Me"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Live Chat ===== */}
        <div className="live-chat-panel">
          <div className="chat-header">
            <span className="chat-title">
              <FaCircle className="live-dot-small" /> Live Chat
            </span>
            <div className="chat-header-right">
              <span className="chat-count">{viewers.toLocaleString()} viewers</span>
              <button className="chat-clear-btn" onClick={clearChat} title="Clear chat">✕</button>
            </div>
          </div>

          {/* Pinned Message Sticky Banner */}
          {pinnedMessage && (
            <div className={`pinned-message-banner sc-tier-${pinnedMessage.tier || "normal"}`}>
              <div className="pinned-banner-header">
                <span className="pinned-badge">📌 PINNED MESSAGE</span>
                <span className="pinned-user-title">
                  {pinnedMessage.amount ? `Super Chat $${pinnedMessage.amount}` : "Comment"}
                </span>
                <button className="close-pinned-btn" onClick={() => setPinnedMessage(null)} title="Dismiss Pin">✕</button>
              </div>
              <div className="pinned-banner-body">
                <span className="pinned-body-username">{pinnedMessage.user}:</span>
                <span className="pinned-body-text">{pinnedMessage.text}</span>
              </div>
            </div>
          )}

          <div className="chat-messages">
            {messages.map((msg) => {
              if (msg.isSuperChat) {
                return (
                  <div key={msg.id} className={`superchat-chat-item sc-tier-${msg.tier}`}>
                    <div className="sc-header">
                      <div className="sc-user-details">
                        <FaUserCircle className="chat-avatar-icon" />
                        <span className="sc-username">{msg.user}</span>
                      </div>
                      <span className="sc-amount">${msg.amount}</span>
                    </div>
                    <div className="sc-body">
                      <span className="sc-text">{msg.text}</span>
                      <button
                        className="msg-pin-btn"
                        onClick={() => pinMessage(msg)}
                        title="Pin this message"
                      >
                        Pin
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="chat-message">
                  <FaUserCircle className="chat-avatar-icon" style={{ color: msg.color }} />
                  <div className="chat-content">
                    <div className="chat-meta">
                      <span className="chat-username" style={{ color: msg.color }}>
                        {msg.isModerator && <FaShieldAlt className="mod-shield-icon" title="Moderator" />}
                        {msg.user}
                      </span>
                      <span className="chat-time">{msg.time}</span>
                    </div>
                    <span className="chat-text">{msg.text}</span>
                  </div>
                  <button
                    className="msg-pin-btn inline"
                    onClick={() => pinMessage(msg)}
                    title="Pin comment"
                  >
                    Pin
                  </button>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input-area">
            {currentUser ? (
              <>
                <div className="chat-input-row">
                  <FaUserCircle className="chat-self-icon" />
                  <input
                    type="text"
                    className="chat-input"
                    value={input}
                    placeholder="Send a message..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    maxLength={200}
                  />
                  <button
                    className={`chat-send-btn ${input.trim() ? "active" : ""}`}
                    onClick={sendMessage}
                    disabled={!input.trim()}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
                <p className="chat-hint">{200 - input.length} chars remaining</p>
              </>
            ) : (
              <div className="chat-login-prompt">
                <Link to="/login">Login</Link> to join the chat 💬
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ===== Super Chat Modal ===== */}
      {showSCModal && (
        <div className="sc-modal-overlay">
          <div className="sc-modal-content">
            <div className="sc-modal-header">
              <h3>Send Super Chat 💰</h3>
              <button className="sc-modal-close" onClick={() => setShowSCModal(false)}>✕</button>
            </div>

            <div className="sc-modal-body">
              <label>Select Super Chat Amount:</label>
              <div className="sc-tiers-grid">
                {SUPERCHAT_TIERS.map((tier) => (
                  <button
                    key={tier.amount}
                    className={`sc-tier-select-btn sc-bg-tier-${tier.tier} ${scTier.amount === tier.amount ? "selected" : ""}`}
                    onClick={() => setScTier(tier)}
                  >
                    <span className="sc-tier-price">{tier.label}</span>
                  </button>
                ))}
              </div>

              <div className="sc-input-preview-card" style={{ borderLeft: `6px solid ${scTier.color}` }}>
                <div className="preview-header">
                  <span className="preview-user">{currentUser?.name || "You"}</span>
                  <span className="preview-amount" style={{ backgroundColor: scTier.color }}>${scTier.amount}</span>
                </div>
                <div className="preview-body">
                  <textarea
                    placeholder={`Enter your message (max ${scTier.maxChars} characters)...`}
                    value={scText}
                    onChange={(e) => setScText(e.target.value)}
                    maxLength={scTier.maxChars}
                    rows={3}
                  />
                </div>
              </div>
              <span className="sc-text-limit">{scText.length} / {scTier.maxChars} characters</span>
            </div>

            <div className="sc-modal-footer">
              <button className="sc-cancel-btn" onClick={() => setShowSCModal(false)}>Cancel</button>
              <button
                className="sc-send-action-btn"
                style={{ backgroundColor: scTier.color }}
                onClick={sendSuperChat}
                disabled={!scText.trim()}
              >
                Send Super Chat (${scTier.amount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStream;