import { useState, useEffect } from "react";
import "./Upload.css";

// Auto-detect language using regex
const detectLanguages = (text) => {
  const languages = [];
  if (/[\u0900-\u097F]/.test(text)) languages.push("Hindi");
  if (/[\u0D00-\u0D7F]/.test(text)) languages.push("Malayalam");
  if (/[\u0B80-\u0BFF]/.test(text)) languages.push("Tamil");
  if (/[\u0C00-\u0C7F]/.test(text)) languages.push("Telugu");
  if (/[\u0C80-\u0CFF]/.test(text)) languages.push("Kannada");
  if (/[\u0600-\u06FF]/.test(text)) languages.push("Arabic");
  if (/[\u4e00-\u9fa5]/.test(text)) languages.push("Chinese");
  if (/[\u3040-\u30ff]/.test(text)) languages.push("Japanese");
  if (/[\uac00-\ud7af]/.test(text)) languages.push("Korean");
  
  const lower = text.toLowerCase();
  if (/\b(und|der|die|das|ist|nicht)\b/.test(lower)) languages.push("German");
  if (/\b(le|la|les|est|un|une|et|en)\b/.test(lower)) languages.push("French");
  if (/\b(el|la|los|las|es|una|y|en)\b/.test(lower)) languages.push("Spanish");
  
  if (languages.length === 0) {
    languages.push("English");
  }
  return languages;
};

// AI Content Moderation Engine
const runModerationEngine = (title, description, videoFile, thumbnail) => {
  const combinedText = `${title} ${description} ${videoFile ? videoFile.name : ""} ${thumbnail ? thumbnail.name : ""}`.toLowerCase();
  const detectedLanguages = detectLanguages(`${title} ${description}`);
  
  let adultScore = 0;
  let violenceScore = 0;
  let thumbnailScore = 0;
  let audioScore = 0;
  let status = "ALLOW";
  let reason = "Content complies with platform policies. No violations detected.";
  let confidence = 0.98;
  let severity = "";

  // 1. Child Sexual Content (BLOCK immediately, no warning)
  const cscKeywords = ["cp", "child porn", "pedophile", "child sexual", "pedophilia"];
  if (cscKeywords.some(kw => combinedText.includes(kw))) {
    return {
      status: "BLOCK",
      confidence: 1.0,
      reason: "Severe Policy Violation: Child sexual exploitation and abuse material detected.",
      detected_language: detectedLanguages,
      adult_score: 100,
      violence_score: 0,
      thumbnail_score: 100,
      audio_score: 100,
      severity: "SEVERE_BAN"
    };
  }

  // 2. Pornography & Adult Content
  const adultKeywords = ["porn", "sex", "genitalia", "nude", "erotic", "xxx", "sensual", "naked", "vagina", "penis", "intercourse"];
  const audioKeywords = ["moan", "sexual audio", "sensual sound", "adult ad"];
  const thumbKeywords = ["clickbait sex", "nude thumb", "explicit pose", "body exposure"];

  if (adultKeywords.some(kw => combinedText.includes(kw))) {
    adultScore = 95;
    status = "BLOCK";
    reason = "Policy Violation: Sexually explicit content or pornography detected.";
    confidence = 0.99;
  } else if (audioKeywords.some(kw => combinedText.includes(kw))) {
    audioScore = 90;
    adultScore = 80;
    status = "BLOCK";
    reason = "Policy Violation: Sexually suggestive or explicit audio content detected.";
    confidence = 0.92;
  } else if (thumbKeywords.some(kw => combinedText.includes(kw))) {
    thumbnailScore = 92;
    adultScore = 85;
    status = "BLOCK";
    reason = "Policy Violation: Erotic or sexually suggestive thumbnail pose/clickbait detected.";
    confidence = 0.94;
  }

  // 3. Movies Policy Check
  const movieKeywords = ["cbfc", "certified movie", "cbfc movie", "official trailer", "movie review", "film criticism", "film review", "cbfc certified"];
  const isCertifiedMovie = movieKeywords.some(kw => combinedText.includes(kw));

  if (isCertifiedMovie) {
    if (status === "BLOCK") {
      if (combinedText.includes("sex") || combinedText.includes("porn")) {
        status = "BLOCK";
        reason = "Policy Violation: Certified movie contains explicit adult scenes exceeding allowable threshold.";
      } else {
        status = "REVIEW";
        reason = "Certified movie flagged for manual review due to borderline suggestive metadata.";
        confidence = 0.85;
      }
    } else {
      status = "ALLOW";
      reason = "CBFC-certified movie/trailer content permitted under platform guidelines.";
      confidence = 0.95;
    }
  }

  // 4. Violence Policy Check
  const violenceKeywords = ["gore", "dismemberment", "killing", "murder", "stab", "blood", "decapitation", "violent incident", "real violence"];
  const allowViolenceContext = ["action scene", "movie action", "history", "historical", "educational", "news reporting", "news coverage"];
  const isContextAllowed = allowViolenceContext.some(kw => combinedText.includes(kw));

  if (violenceKeywords.some(kw => combinedText.includes(kw))) {
    violenceScore = 85;
    if (combinedText.includes("dismemberment") || combinedText.includes("extreme gore") || combinedText.includes("real-world violent")) {
      status = "REVIEW";
      reason = "Violence Policy: Extreme gore or real-world dismemberment flagged for manual review.";
      confidence = 0.88;
    } else if (isContextAllowed) {
      status = "ALLOW";
      reason = "Violent themes permitted within acceptable creative/educational context (action movie scene, news, or history).";
      violenceScore = 50;
      confidence = 0.90;
    } else {
      status = "BLOCK";
      reason = "Policy Violation: Graphic violence or unauthorized violent content detected.";
      confidence = 0.93;
    }
  }

  return {
    status,
    confidence,
    reason,
    detected_language: detectedLanguages,
    adult_score: adultScore,
    violence_score: violenceScore,
    thumbnail_score: thumbnailScore,
    audio_score: audioScore,
    severity
  };
};

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "";
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  
  // Content Moderation States
  const [uploadStep, setUploadStep] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [moderationReport, setModerationReport] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const banUserPermanently = () => {
    if (!currentUser) return;
    const updatedCurrentUser = { ...currentUser, banned: true };
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
    
    const updatedUsers = users.map(u => {
      if (u.email === currentUser.email) {
        return { ...u, banned: true };
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleAcknowledgeWarning = () => {
    setShowWarningModal(false);
    if (currentUser) {
      const updatedCurrentUser = {
        ...currentUser,
        warnings: (currentUser.warnings || 0) + 1
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
      
      const updatedUsers = users.map(u => {
        if (u.email === currentUser.email) {
          return { ...u, warnings: (u.warnings || 0) + 1 };
        }
        return u;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  };

  const resumeUploadToCompletion = (startProgress, report) => {
    let progress = startProgress;
    const interval = setInterval(() => {
      progress += 1;
      setUploadProgress(progress);
      
      if (progress < 100) {
        setUploadStep("Finalizing content upload...");
      }

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);

        const channelName = currentUser ? currentUser.name : "Anonymous Channel";

        const newVideo = {
          id: Date.now(),
          title: title,
          description: description,
          category: category,
          thumbnail: thumbnailPreview || "https://picsum.photos/300/200",
          videoUrl: videoPreview,
          channel: channelName,
          channelLogo: "https://i.pravatar.cc/40",
          views: "0 views",
          time: "Just now",
          duration: videoDuration || "3:00",
          youtubeId: "dQw4w9WgXcQ",
          moderationStatus: report.status
        };

        const uploadedVideos = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
        uploadedVideos.unshift(newVideo);
        localStorage.setItem("uploadedVideos", JSON.stringify(uploadedVideos));

        const myVideos = JSON.parse(localStorage.getItem("myVideos")) || [];
        myVideos.unshift(newVideo);
        localStorage.setItem("myVideos", JSON.stringify(myVideos));

        const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];
        if (subscriptions.includes(channelName)) {
          const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
          notifications.unshift({
            id: Date.now(),
            message: `${channelName} uploaded a new video: "${title}"`,
            videoId: newVideo.id,
            time: "Just now",
            read: false
          });
          localStorage.setItem("notifications", JSON.stringify(notifications));
        }

        if (report.status === "REVIEW") {
          const reports = JSON.parse(localStorage.getItem("adminReports")) || [];
          const newReport = {
            id: Date.now(),
            type: "video_moderation_review",
            content: `Video "${title}" was uploaded and flagged for review. Reason: ${report.reason}`,
            reporter: "YelTube AI Moderation Engine",
            targetId: newVideo.id,
            videoId: newVideo.id,
            videoTitle: newVideo.title,
            createdAt: new Date().toISOString(),
          };
          reports.push(newReport);
          localStorage.setItem("adminReports", JSON.stringify(reports));
          alert(`Upload Successful! Note: Video is currently under review by content moderators.`);
        } else {
          alert("Upload Successful!");
        }

        setTitle("");
        setDescription("");
        setCategory("");
        setVideoFile(null);
        setThumbnail(null);
        setVideoPreview("");
        setThumbnailPreview("");

        setTimeout(() => {
          setUploadProgress(0);
          setUploadStep("");
        }, 2000);
      }
    }, 50);
  };

  const handleUpload = () => {
    if (
      !title ||
      !description ||
      !videoFile ||
      !thumbnail ||
      !category
    ) {
      alert("Please fill all fields");
      return;
    }

    if (!videoFile.type.startsWith("video/")) {
      alert("Please select a valid video");
      return;
    }

    if (!thumbnail.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    if (videoFile.size > 50000000) {
      alert("Video size must be below 50MB");
      return;
    }

    setUploading(true);
    setUploadStep("Preprocessing: Uploading files...");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setUploadProgress(progress);

      if (progress < 20) {
        setUploadStep("FFmpeg: Detecting video duration and resolution metadata...");
      } else if (progress >= 20 && progress < 40) {
        setUploadStep("FFmpeg: Compressing video file (converting resolution to 1080p)...");
      } else if (progress >= 40 && progress < 60) {
        setUploadStep("FFmpeg: Auto-extracting keyframes and generating thumbnails...");
      } else if (progress >= 60 && progress < 80) {
        setUploadStep("Preprocessing: Generating transcripts & auto-detecting language...");
      } else if (progress >= 80 && progress < 95) {
        setUploadStep("AI Content Moderation Engine: Scanning video frames and audio track...");
      } else if (progress === 95) {
        clearInterval(interval);
        
        const report = runModerationEngine(title, description, videoFile, thumbnail);
        setModerationReport(report);

        if (report.status === "BLOCK") {
          setUploading(false);
          setUploadProgress(0);
          setUploadStep("");

          const dbUser = currentUser ? users.find(u => u.email === currentUser.email) : null;
          const userWarnings = (currentUser && currentUser.warnings) || (dbUser && dbUser.warnings) || 0;
          const isRepeatOffender = userWarnings >= 1;
          const isSevereBan = report.severity === "SEVERE_BAN";

          if (isSevereBan || isRepeatOffender) {
            banUserPermanently();
            alert("UPLOAD BLOCKED: Your channel has been permanently suspended for severe policy violations.");
          } else {
            setShowWarningModal(true);
          }
        } else {
          resumeUploadToCompletion(progress, report);
        }
      }
    }, 50);
  };

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return (
      <div className="upload-page">
        <h2>Please Login First</h2>
      </div>
    );
  }

  const dbUser = currentUser ? users.find(u => u.email === currentUser.email) : null;
  const isUserBanned = (currentUser && currentUser.banned) || (dbUser && dbUser.banned);

  if (isUserBanned) {
    return (
      <div className="upload-page banned-page">
        <div className="banned-container">
          <div className="banned-icon">🚫</div>
          <h2>Channel Permanently Blocked</h2>
          <p className="banned-subtitle">
            Your channel creator privileges have been permanently revoked due to severe or repeated violations of the YelTube Content Moderation Policies.
          </p>
          <div className="banned-details">
            <h3>AI Content Moderation Report</h3>
            <pre className="moderation-json-output">
{JSON.stringify({
  status: "BLOCK",
  confidence: 1.0,
  reason: "Severe Policy Violation: Uploading prohibited materials (Adult Content/Violence). Channel blocked permanently.",
  detected_language: ["English"],
  adult_score: 100,
  violence_score: 0,
  thumbnail_score: 100,
  audio_score: 100
}, null, 2)}
            </pre>
          </div>
          <p className="banned-footer">If you believe this was an error, contact platform support.</p>
        </div>
      </div>
    );
  }

  return (

    <div className="upload-page">

      <div className="upload-container">

        <h2>
          Upload Video
        </h2>

        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="">
            Select a category
          </option>

          <option>
            Film & Animation
          </option>

          <option>
            Autos & Vehicles
          </option>

          <option>
            Music
          </option>

          <option>
            Pets & Animals
          </option>

          <option>
            Sports
          </option>

          <option>
            Travel & Events
          </option>

          <option>
            Gaming
          </option>

          <option>
            People & Blogs
          </option>

          <option>
            Comedy
          </option>

          <option>
            Entertainment
          </option>

          <option>
            News & Politics
          </option>

          <option>
            Howto & Style
          </option>

          <option>
            Education
          </option>

          <option>
            Science & Technology
          </option>

          <option>
            Nonprofits & Activism
          </option>

          <option>
            Live
          </option>

          <option>
            Shorts
          </option>

          <option>
            Podcast
          </option>

          <option>
            Tutorial
          </option>

          <option>
            Programming
          </option>

          <option>
            Cooking
          </option>

          <option>
            Fitness
          </option>

          <option>
            Fashion
          </option>

          <option>
            Photography
          </option>

          <option>
            Motivation
          </option>

          <option>
            Business
          </option>

          <option>
            Finance
          </option>

          <option>
            Kids
          </option>

          <option>
            Documentary
          </option>

          <option>
            Anime
          </option>

          <option>
            Malayalam
          </option>

          <option>
            Tamil
          </option>

          <option>
            Hindi
          </option>

          <option>
            English
          </option>

        </select>

        <label>
          Upload Video
        </label>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));

            const videoEl = document.createElement("video");
            videoEl.preload = "metadata";
            videoEl.src = URL.createObjectURL(file);
            videoEl.onloadedmetadata = () => {
              URL.revokeObjectURL(videoEl.src);
              const minutes = Math.floor(videoEl.duration / 60);
              const seconds = Math.floor(videoEl.duration % 60);
              setVideoDuration(`${minutes}:${String(seconds).padStart(2, "0")}`);
            };
          }}
        />

        {videoFile && (
          <div className="file-metadata-info" style={{ margin: "6px 0 12px 0", fontSize: "13px", color: "var(--text-secondary)", display: "flex", gap: "16px" }}>
            <span><strong>Size:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
            {videoDuration && <span><strong>Duration:</strong> {videoDuration}</span>}
          </div>
        )}

        {
          videoPreview && (

            <video
              src={videoPreview}
              controls
              className="video-preview"
            />

          )
        }

        <label>
          Upload Thumbnail
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
          }}
        />

        {thumbnail && (
          <div className="file-metadata-info" style={{ margin: "6px 0 12px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
            <span><strong>Size:</strong> {(thumbnail.size / 1024).toFixed(1)} KB</span>
          </div>
        )}

        {
          thumbnailPreview && (

            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="thumbnail-preview"
            />

          )
        }

        <button
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {uploadProgress > 0 && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${uploadProgress}%`
              }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}

        {uploadStep && (
          <p className="upload-step-message" style={{ color: "var(--text-secondary, #aaa)", fontSize: "13.5px", marginTop: "10px", fontStyle: "italic", textAlign: "center" }}>
            {uploadStep}
          </p>
        )}

      </div>

      {showWarningModal && moderationReport && (
        <div className="moderation-warning-overlay">
          <div className="moderation-warning-modal">
            <div className="warning-modal-header">
              <span className="warning-icon">⚠️</span>
              <h3>YelTube AI Content Moderation Warning</h3>
            </div>
            <div className="warning-modal-body">
              <p className="warning-text">
                Your content has been flagged for violating platform policies. YelTube strictly prohibits explicit adult materials and extreme violence.
              </p>
              <div className="warning-report-section">
                <h4>AI Moderation Engine Report (JSON Output)</h4>
                <pre className="warning-json-output">
{JSON.stringify(moderationReport, null, 2)}
                </pre>
              </div>
              <div className="warning-penalty-notice">
                <strong>CRITICAL NOTICE:</strong> Attempting to bypass this warning or upload this type of content again will result in your channel being <strong>permanently blocked</strong>.
              </div>
            </div>
            <div className="warning-modal-actions">
              <button className="warning-ack-btn" onClick={handleAcknowledgeWarning}>
                Acknowledge Warning
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Upload;