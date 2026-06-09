import { useState, useEffect } from "react";
import "./ShareModal.css";
import { FaWhatsapp, FaFacebook, FaTwitter, FaReddit, FaCopy, FaTimes } from "react-icons/fa";

const ShareModal = ({ isOpen, onClose, videoUrl }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
  };

  const encodedUrl = encodeURIComponent(videoUrl);
  const text = encodeURIComponent("Check out this amazing video on YelTube!");

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${text}`,
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>Share Video</h3>
          <button className="close-share-btn" onClick={onClose} title="Close Share Modal">
            <FaTimes />
          </button>
        </div>

        {/* Social Icons Grid */}
        <div className="share-social-grid">
          <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="share-social-item whatsapp">
            <div className="social-icon-wrap"><FaWhatsapp /></div>
            <span>WhatsApp</span>
          </a>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="share-social-item facebook">
            <div className="social-icon-wrap"><FaFacebook /></div>
            <span>Facebook</span>
          </a>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="share-social-item twitter">
            <div className="social-icon-wrap"><FaTwitter /></div>
            <span>Twitter / X</span>
          </a>
          <a href={shareLinks.reddit} target="_blank" rel="noopener noreferrer" className="share-social-item reddit">
            <div className="social-icon-wrap"><FaReddit /></div>
            <span>Reddit</span>
          </a>
        </div>

        {/* Copy Box */}
        <div className="share-copy-box">
          <input type="text" readOnly value={videoUrl} />
          <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopyLink}>
            {copied ? "Copied!" : <><FaCopy /> Copy</>}
          </button>
        </div>

        {/* Custom Toast Notification inside modal */}
        {copied && <div className="share-toast-notification">Link copied to clipboard!</div>}
      </div>
    </div>
  );
};

export default ShareModal;
