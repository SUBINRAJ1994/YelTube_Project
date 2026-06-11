import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./PlaylistsDetails.css";
import { FaTrash, FaChevronLeft, FaPlayCircle, FaArrowUp, FaArrowDown, FaEdit } from "react-icons/fa";
import playlistService from "../../services/playlistService";

const PlaylistsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylistDetails = async () => {
    try {
      setLoading(true);
      const data = await playlistService.getPlaylistDetail(id);
      setPlaylist(data);
    } catch (err) {
      console.error("Error loading playlist details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="playlist-details-page">
        <div className="playlist-details-container">
          <Link to="/playlists" className="back-playlists-btn"><FaChevronLeft /> Playlists</Link>
          <h2>Loading playlist...</h2>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="playlist-details-page">
        <div className="playlist-details-container">
          <Link to="/playlists" className="back-playlists-btn"><FaChevronLeft /> Playlists</Link>
          <h2>Playlist Not Found</h2>
        </div>
      </div>
    );
  }

  const handleRemoveVideo = async (videoId) => {
    if (!window.confirm("Remove this video from the playlist?")) return;
    try {
      await playlistService.removeVideoFromPlaylist(playlist.id, videoId);
      setPlaylist({
        ...playlist,
        videos: playlist.videos.filter((v) => v.id !== videoId),
      });
    } catch (err) {
      console.error("Error removing video:", err);
    }
  };

  const renamePlaylist = async () => {
    const newName = window.prompt("Rename playlist to:", playlist.name);
    if (!newName || !newName.trim()) return;
    try {
      const updated = await playlistService.updatePlaylist(playlist.id, newName);
      setPlaylist(updated);
    } catch (err) {
      console.error("Error renaming playlist:", err);
    }
  };

  const deletePlaylist = async () => {
    if (!window.confirm("Delete this playlist permanently?")) return;
    try {
      await playlistService.deletePlaylist(playlist.id);
      navigate("/playlists");
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  const moveVideo = (index, direction) => {
    const newVideos = [...playlist.videos];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newVideos.length) return;

    // Swap elements
    const temp = newVideos[index];
    newVideos[index] = newVideos[targetIndex];
    newVideos[targetIndex] = temp;

    setPlaylist({
      ...playlist,
      videos: newVideos,
    });
  };

  return (
    <div className="playlist-details-page">
      <div className="playlist-details-container">
        <div className="playlist-details-header">
          <Link to="/playlists" className="back-playlists-btn">
            <FaChevronLeft /> Back to Playlists
          </Link>
          <div className="playlist-title-action-row">
            <h2>{playlist.name}</h2>
            <div className="playlist-header-actions">
              <button className="pl-header-btn edit" onClick={renamePlaylist} title="Rename Playlist">
                <FaEdit /> Rename
              </button>
              <button className="pl-header-btn delete" onClick={deletePlaylist} title="Delete Playlist">
                <FaTrash /> Delete Playlist
              </button>
            </div>
          </div>
          <p className="playlist-subtitle">{playlist.videos.length} Videos</p>
        </div>

        <div className="playlist-videos">
          {playlist.videos.length === 0 ? (
            <div className="empty-playlist-detail">
              <FaPlayCircle className="empty-pl-icon" />
              <h3>No videos in this playlist</h3>
              <p>Search for videos and click "Add to Playlist" to populate this collection.</p>
            </div>
          ) : (
            playlist.videos.map((video, idx) => (
              <div key={video.id} className="playlist-video-row-wrapper">
                <div className="playlist-reorder-controls">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveVideo(idx, -1)}
                    className="reorder-btn"
                    title="Move Up"
                  >
                    <FaChevronLeft className="rotate-up" style={{ transform: "rotate(90deg)" }} />
                  </button>
                  <button
                    disabled={idx === playlist.videos.length - 1}
                    onClick={() => moveVideo(idx, 1)}
                    className="reorder-btn"
                    title="Move Down"
                  >
                    <FaChevronLeft className="rotate-down" style={{ transform: "rotate(-90deg)" }} />
                  </button>
                </div>
                <Link
                  to={`/watch/${video.id}`}
                  className="playlist-video-link"
                >
                  <div className="playlist-video-card">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                    />
                    <div className="playlist-video-info">
                      <h3>{video.title}</h3>
                      <p>{video.channel}</p>
                      <span>{video.views}</span>
                    </div>
                  </div>
                </Link>
                <button
                  className="remove-video-pl-btn"
                  onClick={() => handleRemoveVideo(video.id)}
                  title="Remove from playlist"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistsDetails;