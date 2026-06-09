import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./PlaylistsDetails.css";
import { FaTrash, FaChevronLeft, FaPlayCircle, FaArrowUp, FaArrowDown, FaEdit } from "react-icons/fa";

const PlaylistsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem("playlists")) || []
  );

  const playlistIndex = playlists.findIndex((item) => item.id === Number(id));
  const playlist = playlists[playlistIndex];

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

  const handleRemoveVideo = (videoId) => {
    if (!window.confirm("Remove this video from the playlist?")) return;

    const updatedPlaylists = playlists.map((pl) => {
      if (pl.id === Number(id)) {
        return {
          ...pl,
          videos: pl.videos.filter((v) => v.id !== videoId),
        };
      }
      return pl;
    });

    setPlaylists(updatedPlaylists);
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
  };

  const renamePlaylist = () => {
    const newName = window.prompt("Rename playlist to:", playlist.name);
    if (!newName || !newName.trim()) return;

    const updatedPlaylists = playlists.map((pl) => {
      if (pl.id === Number(id)) {
        return { ...pl, name: newName };
      }
      return pl;
    });

    setPlaylists(updatedPlaylists);
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
  };

  const deletePlaylist = () => {
    if (!window.confirm("Delete this playlist permanently?")) return;

    const updatedPlaylists = playlists.filter((pl) => pl.id !== Number(id));
    setPlaylists(updatedPlaylists);
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    navigate("/playlists");
  };

  const moveVideo = (index, direction) => {
    const newVideos = [...playlist.videos];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newVideos.length) return;

    // Swap elements
    const temp = newVideos[index];
    newVideos[index] = newVideos[targetIndex];
    newVideos[targetIndex] = temp;

    const updatedPlaylists = playlists.map((pl) => {
      if (pl.id === Number(id)) {
        return {
          ...pl,
          videos: newVideos,
        };
      }
      return pl;
    });

    setPlaylists(updatedPlaylists);
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
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