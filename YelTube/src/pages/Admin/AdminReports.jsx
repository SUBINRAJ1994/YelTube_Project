import { useState, useEffect } from "react";
import "./Admin.css";
import { FaTrash, FaCheck, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const MOCK_REPORTS = [
  {
    id: 1,
    type: "comment",
    content: "Spam comment advertising free gift cards on the watch page.",
    reporter: "Alex",
    targetId: "comment_101",
    videoId: 1,
    videoTitle: "React JS Full Course",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 2,
    type: "comment",
    content: "Inappropriate language and harassment.",
    reporter: "Emma",
    targetId: "comment_102",
    videoId: 2,
    videoTitle: "Build YouTube Clone",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  }
];

const AdminReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem("adminReports"));
    if (!stored) {
      localStorage.setItem("adminReports", JSON.stringify(MOCK_REPORTS));
      stored = MOCK_REPORTS;
    }
    setReports(stored);
  }, []);

  const saveReports = (updated) => {
    setReports(updated);
    localStorage.setItem("adminReports", JSON.stringify(updated));
  };

  const handleDismiss = (reportId) => {
    const updated = reports.filter((r) => r.id !== reportId);
    saveReports(updated);
    alert("Report dismissed.");
  };

  const handleDeleteContent = (report) => {
    if (!window.confirm("Are you sure you want to delete the reported content? This action is permanent.")) return;

    if (report.type === "comment") {
      // Find comment in comments list for this video and delete it
      const key = `comments_${report.videoId}`;
      const comments = JSON.parse(localStorage.getItem(key)) || [];
      const updatedComments = comments.filter((c) => c.id !== report.targetId);
      localStorage.setItem(key, JSON.stringify(updatedComments));
    } else if (report.type === "video") {
      // Deleting a video
      const uploaded = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
      const updatedUploaded = uploaded.filter((v) => v.id !== report.videoId);
      localStorage.setItem("uploadedVideos", JSON.stringify(updatedUploaded));

      const my = JSON.parse(localStorage.getItem("myVideos")) || [];
      const updatedMy = my.filter((v) => v.id !== report.videoId);
      localStorage.setItem("myVideos", JSON.stringify(updatedMy));

      const blacklist = JSON.parse(localStorage.getItem("deletedVideoIds")) || [];
      if (!blacklist.includes(report.videoId)) {
        blacklist.push(report.videoId);
        localStorage.setItem("deletedVideoIds", JSON.stringify(blacklist));
      }
    }

    // Remove report
    const updated = reports.filter((r) => r.id !== report.id);
    saveReports(updated);
    alert("Content deleted and report closed.");
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-sub-header">
          <Link to="/admin" className="back-admin-btn"><FaChevronLeft /> Back to Dashboard</Link>
          <h2>Report Queue</h2>
        </div>

        <div className="admin-card-table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Reason / Content</th>
                <th>Reporter</th>
                <th>Source Video</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">All reports resolved! Excellent work.</td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="admin-row">
                    <td>
                      <span className={`status-badge banned`}>
                        {report.type.toUpperCase()}
                      </span>
                    </td>
                    <td><span className="report-content">"{report.content}"</span></td>
                    <td>{report.reporter}</td>
                    <td>
                      <Link to={`/watch/${report.videoId}`} className="report-video-link">
                        {report.videoTitle}
                      </Link>
                    </td>
                    <td>
                      <div className="actions-wrap">
                        <button
                          className="admin-action-btn activate"
                          onClick={() => handleDismiss(report.id)}
                          title="Dismiss Report"
                        >
                          <FaCheck /> Dismiss
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDeleteContent(report)}
                          title="Delete content and close report"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
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

export default AdminReports;
