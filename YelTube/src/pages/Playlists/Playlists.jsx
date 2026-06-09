import { useState } from "react";
import "./Playlists.css";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaPlusCircle, FaFolderOpen } from "react-icons/fa";

const Playlists = () => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem("playlists")) || []
  );

  const createPlaylist = () => {
    if (!playlistName.trim()) {
      return;
    }

    const newPlaylist = {
      id: Date.now(),
      name: playlistName,
      videos: [],
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    setPlaylistName("");
  };

  const deletePlaylist = (e, id) => {
    e.preventDefault(); // Stop routing
    if (!window.confirm("Delete this playlist permanently?")) return;
    const updated = playlists.filter((pl) => pl.id !== id);
    setPlaylists(updated);
    localStorage.setItem("playlists", JSON.stringify(updated));
  };

  const renamePlaylist = (e, id, oldName) => {
    e.preventDefault(); // Stop routing
    const newName = window.prompt("Rename playlist to:", oldName);
    if (!newName || !newName.trim()) return;
    const updated = playlists.map((pl) => (pl.id === id ? { ...pl, name: newName } : pl));
    setPlaylists(updated);
    localStorage.setItem("playlists", JSON.stringify(updated));
  };

  return (
    <div className="playlists-page">
      <div className="playlists-container">
        <h2>My Playlists</h2>
        <p className="playlists-lead">Organize and watch your curated video collections.</p>

        <div className="playlist-create">
          <input
            type="text"
            placeholder="New Playlist Name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createPlaylist()}
          />
          <button onClick={createPlaylist}>
            <FaPlusCircle /> Create Playlist
          </button>
        </div>

        <div className="playlists-grid-list">
          {playlists.length === 0 ? (
            <div className="empty-playlists">
              <FaFolderOpen className="empty-playlists-icon" />
              <h3>No playlists found</h3>
              <p>Type a name above to create your first collection.</p>
            </div>
          ) : (
            playlists.map((playlist) => (
              <Link
                to={`/playlists/${playlist.id}`}
                key={playlist.id}
                className="playlist-link-card"
              >
                <div className="pl-card-preview-strip">
                  {playlist.videos && playlist.videos[0] ? (
                    <img src={playlist.videos[0].thumbnail} alt="" className="pl-preview-img" />
                  ) : (
                    <div className="pl-preview-placeholder">Empty</div>
                  )}
                  <span className="pl-count-badge">{playlist.videos?.length || 0} videos</span>
                </div>
                <div className="playlist-info-row">
                  <div className="playlist-title-wrap">
                    <h3>{playlist.name}</h3>
                  </div>
                  <div className="playlist-actions-wrap">
                    <button
                      className="pl-action-btn edit"
                      onClick={(e) => renamePlaylist(e, playlist.id, playlist.name)}
                      title="Rename Playlist"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="pl-action-btn delete"
                      onClick={(e) => deletePlaylist(e, playlist.id)}
                      title="Delete Playlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlists;