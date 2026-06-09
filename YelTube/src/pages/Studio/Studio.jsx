import "./Studio.css";
import { useState, useRef } from "react";
import {
  FaVideo,
  FaEye,
  FaThumbsUp,
  FaUsers,
  FaClock,
  FaEdit,
  FaTrash,
  FaUpload,
  FaChartBar,
  FaBell,
  FaPlayCircle,
  FaCommentAlt,
  FaDollarSign,
  FaCheckCircle,
  FaImage,
  FaTachometerAlt,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

/* ─── helpers ─── */
const loadVideos = () => {
  const a = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
  const b = JSON.parse(localStorage.getItem("myVideos")) || [];
  const seen = new Set();
  return [...a, ...b].filter((v) => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });
};

const saveVideos = (arr) => {
  localStorage.setItem("uploadedVideos", JSON.stringify(arr));
  localStorage.setItem("myVideos", JSON.stringify(arr));
};

const loadAllComments = (videos) => {
  const all = [];
  videos.forEach((v) => {
    const c = JSON.parse(localStorage.getItem(`comments_${v.id}`)) || [];
    c.forEach((cm) => all.push({ ...cm, videoTitle: v.title, videoId: v.id }));
  });
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/* ─── fake analytics data ─── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const VIEWS_DATA = [1200, 3400, 2800, 5100, 4300, 6800];
const WATCH_DATA = [40, 95, 72, 130, 110, 175];

const TABS = [
  { id: "dashboard", label: "Dashboard",  icon: <FaTachometerAlt /> },
  { id: "videos",    label: "My Videos",  icon: <FaVideo /> },
  { id: "analytics", label: "Analytics",  icon: <FaChartBar /> },
  { id: "comments",  label: "Comments",   icon: <FaCommentAlt /> },
  { id: "revenue",   label: "Revenue",    icon: <FaDollarSign /> },
];

/* ═══════════════════════════════════════════════════════════ */
const Studio = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [videos, setVideos]       = useState(loadVideos);

  /* ── stats ── */
  const totalViews  = videos.reduce((s, v) => s + (v.views  || 0), 0);
  const totalLikes  = videos.reduce((s, v) => s + (v.likes  || 0), 0);
  const subscribers = parseInt(localStorage.getItem("streamFollowers")) || 0;
  const watchMins   = videos.reduce((s, v) => s + (v.duration || 0), 0);

  const statsCards = [
    { icon: <FaVideo />,    label: "Total Videos", value: videos.length,               color: "#6c63ff" },
    { icon: <FaEye />,      label: "Total Views",  value: totalViews.toLocaleString(), color: "#00bcd4" },
    { icon: <FaThumbsUp />, label: "Total Likes",  value: totalLikes.toLocaleString(), color: "#ff4081" },
    { icon: <FaUsers />,    label: "Subscribers",  value: subscribers.toLocaleString(),color: "#4caf50" },
    { icon: <FaClock />,    label: "Watch Time",   value: `${watchMins} min`,          color: "#ff9800" },
  ];

  /* ── My Videos state ── */
  const [editingId,   setEditingId]   = useState(null);
  const [editTitle,   setEditTitle]   = useState("");
  const [editDesc,    setEditDesc]    = useState("");
  const [editingDesc, setEditingDesc] = useState(null);
  const thumbInputRef                 = useRef(null);
  const [thumbTarget, setThumbTarget] = useState(null);

  const startEditTitle = (v) => { setEditingId(v.id);   setEditTitle(v.title); };
  const startEditDesc  = (v) => { setEditingDesc(v.id); setEditDesc(v.description || ""); };

  const saveTitle = (id) => {
    const updated = videos.map((v) => v.id === id ? { ...v, title: editTitle } : v);
    setVideos(updated); saveVideos(updated); setEditingId(null);
  };

  const saveDesc = (id) => {
    const updated = videos.map((v) => v.id === id ? { ...v, description: editDesc } : v);
    setVideos(updated); saveVideos(updated); setEditingDesc(null);
  };

  const deleteVideo = (id) => {
    if (!window.confirm("Delete this video? This cannot be undone.")) return;
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated); saveVideos(updated);
  };

  const handleThumbClick = (id) => {
    setThumbTarget(id);
    thumbInputRef.current?.click();
  };

  const handleThumbChange = (e) => {
    const file = e.target.files[0];
    if (!file || !thumbTarget) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = videos.map((v) =>
        v.id === thumbTarget ? { ...v, thumbnail: ev.target.result } : v
      );
      setVideos(updated); saveVideos(updated);
      setThumbTarget(null);
    };
    reader.readAsDataURL(file);
  };

  /* ── Comments ── */
  const allComments = loadAllComments(videos);

  const deleteComment = (videoId, commentId) => {
    const key  = `comments_${videoId}`;
    const curr = JSON.parse(localStorage.getItem(key)) || [];
    localStorage.setItem(key, JSON.stringify(curr.filter((c) => c.id !== commentId)));
    setVideos([...videos]); // trigger re-render
  };

  /* ── Revenue (demo) ── */
  const estRevenue  = ((totalViews / 1000) * 2.5).toFixed(2);
  const cpm         = "2.50";
  const rpm         = "1.80";

  /* ══════════ RENDER ══════════ */
  return (
    <div className="studio-page">

      {/* ── Page Header ── */}
      <div className="studio-header">
        <div className="studio-logo">
          <FaPlayCircle className="studio-logo-icon" />
          <div>
            <h1 className="studio-title">Creator Studio</h1>
            <p className="studio-subtitle">
              {currentUser ? `Welcome back, ${currentUser.name}!` : "Manage your YelTube channel"}
            </p>
          </div>
        </div>
        <div className="studio-header-right">
          <Link to="/upload">
            <button className="studio-upload-btn"><FaUpload /> Upload Video</button>
          </Link>
          <Link to="/livestream">
            <button className="studio-live-btn"><FaBell /> Go Live</button>
          </Link>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="studio-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`studio-tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          TAB 1 — DASHBOARD
      ══════════════════════════════════════════════ */}
      {activeTab === "dashboard" && (
        <div className="tab-content">
          <div className="studio-cards">
            {statsCards.map((c, i) => (
              <div className="studio-card" key={i} style={{ "--card-color": c.color }}>
                <div className="card-icon-wrap" style={{ background: c.color + "22" }}>
                  <span className="card-icon" style={{ color: c.color }}>{c.icon}</span>
                </div>
                <div className="card-body">
                  <span className="card-value">{c.value}</span>
                  <span className="card-label">{c.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick stats summary */}
          <div className="dashboard-summary">
            <div className="summary-card">
              <h3>📈 Performance This Month</h3>
              <div className="summary-row"><span>New Views</span><strong>{(totalViews || 0).toLocaleString()}</strong></div>
              <div className="summary-row"><span>New Likes</span><strong>{(totalLikes || 0).toLocaleString()}</strong></div>
              <div className="summary-row"><span>New Subscribers</span><strong>+{Math.floor(subscribers * 0.04)}</strong></div>
              <div className="summary-row"><span>Est. Revenue</span><strong className="green">${estRevenue}</strong></div>
            </div>
            <div className="summary-card">
              <h3>🎬 Top Video</h3>
              {videos.length > 0 ? (
                <>
                  {videos[0].thumbnail
                    ? <img src={videos[0].thumbnail} alt="top" className="top-video-thumb" />
                    : <div className="top-video-placeholder"><FaPlayCircle /></div>
                  }
                  <p className="top-video-title">{videos[0].title}</p>
                  <div className="summary-row"><span>Views</span><strong>{videos[0].views || 0}</strong></div>
                  <div className="summary-row"><span>Likes</span><strong>{videos[0].likes || 0}</strong></div>
                </>
              ) : (
                <p className="muted-text">No videos uploaded yet.</p>
              )}
            </div>
            <div className="summary-card">
              <h3>💡 Tips for Growth</h3>
              {[
                "Upload consistently (3–5 videos/week)",
                "Add end screens to boost watch time",
                "Reply to comments to boost engagement",
                "Use trending topics in your titles",
                "Optimise your thumbnail for CTR",
              ].map((tip, i) => (
                <div key={i} className="tip-row">
                  <FaCheckCircle className="tip-icon" /> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 2 — MY VIDEOS
      ══════════════════════════════════════════════ */}
      {activeTab === "videos" && (
        <div className="tab-content">
          {/* hidden file input for thumbnail */}
          <input
            type="file" accept="image/*"
            ref={thumbInputRef}
            style={{ display: "none" }}
            onChange={handleThumbChange}
          />

          <div className="studio-section">
            <div className="studio-section-header">
              <h2 className="studio-section-title"><FaVideo className="section-icon" /> My Videos</h2>
              <span className="video-count-badge">{videos.length} videos</span>
            </div>

            {videos.length === 0 ? (
              <div className="studio-empty">
                <FaVideo className="empty-icon" />
                <h3>No videos yet</h3>
                <p>Upload your first video to get started.</p>
                <Link to="/upload"><button className="studio-upload-btn"><FaUpload /> Upload Now</button></Link>
              </div>
            ) : (
              <div className="studio-table-wrapper">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>Video</th>
                      <th>Description</th>
                      <th>Visibility</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video) => (
                      <tr key={video.id} className="studio-row">

                        {/* Thumbnail + Title */}
                        <td className="video-cell">
                          <div className="video-thumb-wrap">
                            <div className="thumb-container">
                              {video.thumbnail
                                ? <img src={video.thumbnail} alt={video.title} className="video-thumb" />
                                : <div className="video-thumb-placeholder"><FaPlayCircle /></div>
                              }
                              <button
                                className="thumb-update-btn"
                                onClick={() => handleThumbClick(video.id)}
                                title="Update thumbnail"
                              >
                                <FaImage />
                              </button>
                            </div>
                            <div className="video-info">
                              {editingId === video.id ? (
                                <div className="edit-row">
                                  <input className="edit-input" value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && saveTitle(video.id)}
                                    autoFocus />
                                  <button className="save-btn" onClick={() => saveTitle(video.id)}>Save</button>
                                  <button className="cancel-btn" onClick={() => setEditingId(null)}>✕</button>
                                </div>
                              ) : (
                                <span className="video-title-cell">{video.title}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="desc-td">
                          {editingDesc === video.id ? (
                            <div className="desc-edit-wrap">
                              <textarea className="desc-textarea" value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)} rows={3} />
                              <div className="desc-edit-actions">
                                <button className="save-btn" onClick={() => saveDesc(video.id)}>Save</button>
                                <button className="cancel-btn" onClick={() => setEditingDesc(null)}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <span className="desc-cell-text">
                              {video.description?.slice(0, 60) || <em className="muted-text">No description</em>}
                            </span>
                          )}
                        </td>

                        <td><span className="visibility-badge public">Public</span></td>
                        <td className="stat-cell"><FaEye className="stat-icon" /> {(video.views || 0).toLocaleString()}</td>
                        <td className="stat-cell"><FaThumbsUp className="stat-icon likes-icon" /> {(video.likes || 0).toLocaleString()}</td>
                        <td className="date-cell">
                          {video.uploadedAt
                            ? new Date(video.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </td>

                        {/* Actions */}
                        <td className="actions-cell">
                          <div className="actions-wrap">
                            <button className="action-icon-btn edit"   title="Edit title"       onClick={() => startEditTitle(video)}><FaEdit /></button>
                            <button className="action-icon-btn desc"   title="Edit description" onClick={() => startEditDesc(video)}><FaCommentAlt /></button>
                            <button className="action-icon-btn thumb"  title="Update thumbnail" onClick={() => handleThumbClick(video.id)}><FaImage /></button>
                            <button className="action-icon-btn delete" title="Delete video"     onClick={() => deleteVideo(video.id)}><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 3 — ANALYTICS
      ══════════════════════════════════════════════ */}
      {activeTab === "analytics" && (
        <div className="tab-content">
          <div className="analytics-grid">

            {/* Views chart */}
            <div className="analytics-card wide">
              <h3 className="analytics-card-title"><FaEye /> Views — Last 6 Months</h3>
              <div className="bar-chart">
                {VIEWS_DATA.map((val, i) => (
                  <div key={i} className="bar-group">
                    <div
                      className="bar"
                      style={{ height: `${(val / Math.max(...VIEWS_DATA)) * 100}%`, background: "#6c63ff" }}
                      title={`${val} views`}
                    >
                      <span className="bar-val">{val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}</span>
                    </div>
                    <span className="bar-label">{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Watch time chart */}
            <div className="analytics-card wide">
              <h3 className="analytics-card-title"><FaClock /> Watch Time (mins) — Last 6 Months</h3>
              <div className="bar-chart">
                {WATCH_DATA.map((val, i) => (
                  <div key={i} className="bar-group">
                    <div
                      className="bar"
                      style={{ height: `${(val / Math.max(...WATCH_DATA)) * 100}%`, background: "#ff9800" }}
                      title={`${val} mins`}
                    >
                      <span className="bar-val">{val}</span>
                    </div>
                    <span className="bar-label">{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience card */}
            <div className="analytics-card">
              <h3 className="analytics-card-title"><FaUsers /> Audience</h3>
              <div className="analytics-stat-row"><span>Subscribers</span><strong>{subscribers.toLocaleString()}</strong></div>
              <div className="analytics-stat-row"><span>New this month</span><strong className="green">+{Math.floor(subscribers * 0.04)}</strong></div>
              <div className="analytics-stat-row"><span>Avg. View Duration</span><strong>4:32</strong></div>
              <div className="analytics-stat-row"><span>Click-through Rate</span><strong>5.8%</strong></div>
              <div className="audience-bar-wrap">
                <span className="audience-bar-label">Returning</span>
                <div className="audience-bar"><div className="audience-fill" style={{ width: "68%", background: "#6c63ff" }} /></div>
                <span>68%</span>
              </div>
              <div className="audience-bar-wrap">
                <span className="audience-bar-label">New</span>
                <div className="audience-bar"><div className="audience-fill" style={{ width: "32%", background: "#00bcd4" }} /></div>
                <span>32%</span>
              </div>
            </div>

            {/* Top videos */}
            <div className="analytics-card">
              <h3 className="analytics-card-title"><FaStar /> Top Videos</h3>
              {videos.length === 0
                ? <p className="muted-text">No videos yet.</p>
                : videos.slice(0, 5).map((v, i) => (
                  <div key={v.id} className="top-video-row">
                    <span className="top-rank">#{i + 1}</span>
                    {v.thumbnail
                      ? <img src={v.thumbnail} alt="" className="top-row-thumb" />
                      : <div className="top-row-placeholder"><FaPlayCircle /></div>
                    }
                    <div className="top-row-info">
                      <span className="top-row-title">{v.title}</span>
                      <span className="top-row-views"><FaEye /> {v.views || 0} views</span>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Traffic sources */}
            <div className="analytics-card">
              <h3 className="analytics-card-title"><FaChartBar /> Traffic Sources</h3>
              {[
                { label: "YelTube Search", pct: 42, color: "#ff0000" },
                { label: "Suggested Videos", pct: 28, color: "#6c63ff" },
                { label: "Direct / Other", pct: 18, color: "#ff9800" },
                { label: "External", pct: 12, color: "#4caf50" },
              ].map((s) => (
                <div key={s.label} className="audience-bar-wrap">
                  <span className="audience-bar-label">{s.label}</span>
                  <div className="audience-bar">
                    <div className="audience-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                  <span>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 4 — COMMENTS
      ══════════════════════════════════════════════ */}
      {activeTab === "comments" && (
        <div className="tab-content">
          <div className="studio-section">
            <div className="studio-section-header">
              <h2 className="studio-section-title"><FaCommentAlt className="section-icon" /> All Comments</h2>
              <span className="video-count-badge">{allComments.length} comments</span>
            </div>

            {allComments.length === 0 ? (
              <div className="studio-empty">
                <FaCommentAlt className="empty-icon" />
                <h3>No comments yet</h3>
                <p>Comments on your videos will appear here.</p>
              </div>
            ) : (
              <div className="comments-list">
                {allComments.map((cm) => (
                  <div key={cm.id} className="studio-comment-row">
                    <div className="cm-avatar">{(cm.user || cm.author || "U")[0].toUpperCase()}</div>
                    <div className="cm-body">
                      <div className="cm-meta">
                        <strong className="cm-author">{cm.user || cm.author || "Anonymous"}</strong>
                        <span className="cm-video">on: {cm.videoTitle}</span>
                        <span className="cm-time">{cm.createdAt ? new Date(cm.createdAt).toLocaleDateString() : ""}</span>
                      </div>
                      <p className="cm-text">{cm.text || cm.comment}</p>
                    </div>
                    <button
                      className="action-icon-btn delete cm-delete"
                      title="Delete comment"
                      onClick={() => deleteComment(cm.videoId, cm.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 5 — REVENUE
      ══════════════════════════════════════════════ */}
      {activeTab === "revenue" && (
        <div className="tab-content">
          <div className="revenue-banner">
            <FaDollarSign className="revenue-banner-icon" />
            <div>
              <h2 className="revenue-banner-title">Estimated Revenue</h2>
              <p className="revenue-banner-sub">Demo mode — figures are illustrative</p>
            </div>
            <span className="revenue-big">${estRevenue}</span>
          </div>

          <div className="revenue-cards">
            {[
              { label: "RPM (Revenue per 1K views)", value: `$${rpm}`,  color: "#4caf50", icon: <FaChartBar /> },
              { label: "CPM (Cost per 1K views)",    value: `$${cpm}`,  color: "#00bcd4", icon: <FaEye /> },
              { label: "Total Views Monetised",       value: totalViews.toLocaleString(), color: "#6c63ff", icon: <FaVideo /> },
              { label: "Ad Impressions",              value: Math.floor(totalViews * 1.4).toLocaleString(), color: "#ff9800", icon: <FaStar /> },
            ].map((c, i) => (
              <div className="revenue-card" key={i} style={{ "--rc": c.color }}>
                <div className="rc-icon" style={{ color: c.color }}>{c.icon}</div>
                <span className="rc-value" style={{ color: c.color }}>{c.value}</span>
                <span className="rc-label">{c.label}</span>
              </div>
            ))}
          </div>

          {/* Monthly breakdown table */}
          <div className="studio-section" style={{ marginTop: 24 }}>
            <div className="studio-section-header">
              <h2 className="studio-section-title"><FaDollarSign className="section-icon" /> Monthly Breakdown</h2>
            </div>
            <div className="studio-table-wrapper">
              <table className="studio-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Views</th>
                    <th>Watch Time</th>
                    <th>Est. Revenue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHS.map((m, i) => (
                    <tr key={m} className="studio-row">
                      <td><strong>{m} 2025</strong></td>
                      <td className="stat-cell"><FaEye className="stat-icon" /> {VIEWS_DATA[i].toLocaleString()}</td>
                      <td className="stat-cell"><FaClock className="stat-icon" /> {WATCH_DATA[i]} min</td>
                      <td className="stat-cell green"><strong>${((VIEWS_DATA[i] / 1000) * 2.5).toFixed(2)}</strong></td>
                      <td>
                        <span className={`visibility-badge ${i < 5 ? "public" : "pending"}`}>
                          {i < 5 ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="revenue-disclaimer">
            ⚠️ <strong>Demo Mode:</strong> This is a simulated revenue dashboard for UI demonstration purposes only.
            Actual monetisation requires meeting YelTube Partner Programme requirements.
          </p>
        </div>
      )}

    </div>
  );
};

export default Studio;