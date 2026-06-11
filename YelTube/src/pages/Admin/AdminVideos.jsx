import { useState, useEffect } from "react";
import "./Admin.css";
import { FaTrash, FaChevronLeft, FaPlayCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../../services/api";

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("admin/videos/");
        setVideos(res.data || []);
      } catch (err) {
        console.error("Error loading admin videos:", err);
      }
    };
    fetchVideos();
  }, []);

  const handleDeleteVideo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video? This will remove it from all feeds permanently.")) return;
    try {
      await API.delete(`admin/videos/${id}/`);
      setVideos(videos.filter((v) => v.id !== id));
      alert("Video deleted successfully.");
    } catch (err) {
      alert("Failed to delete video: " + (err.response?.data?.error || ""));
    }
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
