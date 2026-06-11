import { useState, useEffect } from "react";
import "./Admin.css";
import { FaTrash, FaCheck, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../../services/api";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("reports/");
        setReports(res.data || []);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDismiss = async (reportId) => {
    try {
      await API.delete(`reports/${reportId}/`);
      setReports(reports.filter((r) => r.id !== reportId));
      alert("Report dismissed.");
    } catch (err) {
      console.error("Error dismissing report:", err);
      alert("Failed to dismiss report.");
    }
  };

  const handleDeleteContent = async (report) => {
    if (!window.confirm("Are you sure you want to delete the reported content? This action is permanent.")) return;

    try {
      if (report.content_type === "comment") {
        await API.delete(`comments/${report.object_id}/`);
      } else if (report.content_type === "video") {
        await API.delete(`admin/videos/${report.object_id}/`);
      } else {
        alert("Unsupported content type for deletion.");
        return;
      }

      // Automatically delete the report after content deletion
      await API.delete(`reports/${report.id}/`);
      setReports(reports.filter((r) => r.id !== report.id));
      alert("Content deleted and report closed.");
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("Failed to delete content: " + (err.response?.data?.detail || err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container" style={{ color: "white", textAlign: "center", paddingTop: "50px" }}>
          <h2>Loading report queue...</h2>
        </div>
      </div>
    );
  }

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
                reports.map((report) => {
                  const videoId = report.content_details?.video_id;
                  const videoTitle = report.content_details?.video_title || report.content_details?.title || "Unknown Video";
                  return (
                    <tr key={report.id} className="admin-row">
                      <td>
                        <span className={`status-badge banned`}>
                          {(report.content_type || "").toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="report-reason-cell">
                          <strong>{report.report_reason_name || "Reported Item"}</strong>
                          {report.description && (
                            <p className="report-desc-text" style={{ fontSize: "13px", color: "#aaa", margin: "4px 0" }}>
                              {report.description}
                            </p>
                          )}
                          {report.content_type === "comment" && report.content_details?.text && (
                            <div className="report-comment-preview" style={{ fontStyle: "italic", fontSize: "13px", color: "#ddd", marginTop: "4px", paddingLeft: "8px", borderLeft: "2px solid #ff4444" }}>
                              Comment: "{report.content_details.text}"
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{report.reporter_name || "Anonymous"}</td>
                      <td>
                        {videoId ? (
                          <Link to={`/watch/${videoId}`} className="report-video-link">
                            {videoTitle}
                          </Link>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

