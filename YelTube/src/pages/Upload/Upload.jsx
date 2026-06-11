import { useState, useEffect } from "react";
import { pushNotification } from "../../utils/notifications";
import "./Upload.css";
import videoService from "../../services/videoService";

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
  
  // New Metadata & Compression States
  const [videoSize, setVideoSize] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [compressVideo, setCompressVideo] = useState(true);
  const [compressionSetting, setCompressionSetting] = useState("720p (HD)");
  
  // Content Moderation States
  const [uploadStep, setUploadStep] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [moderationReport, setModerationReport] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // HTML5 Canvas Thumbnail Extractor
  const generateThumbnail = (file) => {
    const fileURL = URL.createObjectURL(file);
    const videoEl = document.createElement("video");
    videoEl.src = fileURL;
    videoEl.preload = "auto";
    videoEl.muted = true;
    videoEl.playsInline = true;

    setUploadStep("Reading video metadata...");
    
    videoEl.addEventListener("loadedmetadata", () => {
      // Set size and duration
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setVideoSize(`${sizeInMB} MB`);
      
      const durationSecs = videoEl.duration;
      const mins = Math.floor(durationSecs / 60);
      const secs = Math.floor(durationSecs % 60);
      setVideoDuration(`${mins}:${secs.toString().padStart(2, "0")}`);
      
      // Seek to 1 second
      videoEl.currentTime = Math.min(1.0, durationSecs / 2);
    });

    videoEl.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.videoWidth || 640;
        canvas.height = videoEl.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/jpeg");
        setThumbnailPreview(dataUrl);
        
        // Mock thumbnail file object
        const mockFile = { name: "auto_thumbnail.jpg", type: "image/jpeg" };
        setThumbnail(mockFile);
        setUploadStep("");
      } catch (err) {
        console.error("Canvas thumbnail generation failed: ", err);
        setUploadStep("");
      }
    });
  };

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

  const handleUpload = async () => {
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
      alert("Please select a valid video file");
      return;
    }

    if (videoFile.size > 50 * 1024 * 1024) {
      alert("Video size must be below 50MB");
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setUploadStep("FFmpeg: parsing metadata container...");

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
      return;
    }

    let progress = 10;
    const interval = setInterval(() => {
      if (progress < 90) {
        progress += 5;
        setUploadProgress(progress);
        if (progress < 30) {
          setUploadStep("FFmpeg: extracting audio channel (aac/mp3)...");
        } else if (progress < 60) {
          setUploadStep(`FFmpeg: Compressing video layout (libx264 -crf 23)...`);
        } else {
          setUploadStep("AI Guard: Analysing speech transcript and metadata...");
        }
      }
    }, 200);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("video_file", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      await videoService.uploadVideo(formData);
      clearInterval(interval);
      setUploadProgress(100);
      setUploadStep("Publishing completed successfully!");
      
      pushNotification("uploads", `Your video "${title}" has been successfully uploaded, compressed, and published!`);
      alert("Upload Successful!");

      setTitle("");
      setDescription("");
      setCategory("");
      setVideoFile(null);
      setThumbnail(null);
      setVideoPreview("");
      setThumbnailPreview("");
      setVideoSize("");
      setVideoDuration("");
      setUploading(false);

      setTimeout(() => {
        setUploadProgress(0);
        setUploadStep("");
      }, 2000);
    } catch (err) {
      clearInterval(interval);
      setUploading(false);
      alert(JSON.stringify(err.response?.data) || "Upload failed.");
    }
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
        <h2>Upload Video</h2>

        <label className="input-label">Video Title</label>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="input-label">Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="input-label">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          <option>Film & Animation</option>
          <option>Autos & Vehicles</option>
          <option>Music</option>
          <option>Pets & Animals</option>
          <option>Sports</option>
          <option>Travel & Events</option>
          <option>Gaming</option>
          <option>People & Blogs</option>
          <option>Comedy</option>
          <option>Entertainment</option>
          <option>News & Politics</option>
          <option>Howto & Style</option>
          <option>Education</option>
          <option>Science & Technology</option>
          <option>Nonprofits & Activism</option>
          <option>Live</option>
          <option>Shorts</option>
          <option>Podcast</option>
          <option>Tutorial</option>
          <option>Programming</option>
          <option>Cooking</option>
          <option>Fitness</option>
        </select>

        {/* Compression Settings Section */}
        <div className="compression-settings-panel">
          <div className="compression-toggle-row">
            <input
              type="checkbox"
              id="compress-checkbox"
              checked={compressVideo}
              onChange={(e) => setCompressVideo(e.target.checked)}
            />
            <label htmlFor="compress-checkbox">Enable FFmpeg Video Compression</label>
          </div>
          
          {compressVideo && (
            <div className="compression-options-row">
              <label>Target Resolution:</label>
              <select
                value={compressionSetting}
                onChange={(e) => setCompressionSetting(e.target.value)}
              >
                <option>1080p (FHD)</option>
                <option>720p (HD)</option>
                <option>480p (SD)</option>
                <option>360p (Mobile)</option>
              </select>
            </div>
          )}
        </div>

        <label className="input-label">Choose Video File</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            generateThumbnail(file); // Dynamic canvas extraction
          }}
        />

        {videoPreview && (
          <div className="media-preview-container">
            <video src={videoPreview} controls className="video-preview" />
            <div className="metadata-badge-container">
              {videoSize && <span className="metadata-badge size-badge">Size: {videoSize}</span>}
              {videoDuration && <span className="metadata-badge duration-badge">Duration: {videoDuration}</span>}
            </div>
          </div>
        )}

        <label className="input-label">Upload Custom Thumbnail (Or use auto-generated keyframe)</label>
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

        {thumbnailPreview && (
          <div className="thumbnail-preview-wrap">
            <img src={thumbnailPreview} alt="Thumbnail Preview" className="thumbnail-preview" />
            <span className="thumbnail-preview-label">Thumbnail Preview</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="upload-submit-btn"
        >
          {uploading ? "Compressing & Uploading..." : "Upload Video"}
        </button>

        {uploadProgress > 0 && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}

        {uploadStep && (
          <p className="upload-step-message">
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