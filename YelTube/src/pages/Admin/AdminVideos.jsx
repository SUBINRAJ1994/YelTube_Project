import { useState, useEffect } from "react";
import "./Admin.css";
import { FaTrash, FaEye, FaChevronLeft, FaPlayCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import staticVideos from "../../data/videos";

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const uploaded = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
    const all = [...uploaded, ...staticVideos];
    
    // De-duplicate by ID
    const seen = new Set();
    const unique = all.filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });

    setVideos(unique);
  }, []);

  const handleDeleteVideo = (id) => {
    if (!window.confirm("Are you sure you want to delete this video? This will remove it from all feeds permanently.")) return;

    // Filter out of local lists
    const uploaded = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
    const updatedUploaded = uploaded.filter((v) => v.id !== id);
    localStorage.setItem("uploadedVideos", JSON.stringify(updatedUploaded));

    const my = JSON.parse(localStorage.getItem("myVideos")) || [];
    const updatedMy = my.filter((v) => v.id !== id);
    localStorage.setItem("myVideos", JSON.stringify(updatedMy));

    // For static videos, we can store a list of blacklisted video IDs in localStorage
    const blacklist = JSON.parse(localStorage.getItem("deletedVideoIds")) || [];
    if (!blacklist.includes(id)) {
      blacklist.push(id);
      localStorage.setItem("deletedVideoIds", JSON.stringify(blacklist));
    }

    setVideos(videos.filter((v) => v.id !== id));
    alert("Video deleted successfully.");
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-sub-header">
          <Link to="/admin" className="back-admin-btn"><FaChevronLeft /> Back to Dashboard</Link>
          <h2>Manage Videos</h2>
        </div>

        <div className="admin-card-table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Channel</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">No videos in system.</td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video.id} className="admin-row">
                    <td>
                      {video.thumbnail ? (
                        <img src={video.thumbnail} alt="" className="admin-video-thumb" />
                      ) : (
                        <div className="admin-video-placeholder"><FaPlayCircle /></div>
                      )}
                    </td>
                    <td><span className="admin-video-title">{video.title}</span></td>
                    <td>{video.channel}</td>
                    <td>{video.views}</td>
                    <td>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDeleteVideo(video.id)}
                        title="Delete Video"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVideos;
