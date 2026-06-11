import { useState, useEffect } from "react";
import "./Playlists.css";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaPlusCircle, FaFolderOpen } from "react-icons/fa";
import playlistService from "../../services/playlistService";

const Playlists = () => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try {
      const data = await playlistService.getPlaylists();
      setPlaylists(data);
    } catch (err) {
      console.error("Error loading playlists:", err);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const createPlaylist = async () => {
    if (!playlistName.trim()) {
      return;
    }
    try {
      const newPlaylist = await playlistService.createPlaylist(playlistName);
      setPlaylists([...playlists, newPlaylist]);
      setPlaylistName("");
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  const deletePlaylist = async (e, id) => {
    e.preventDefault(); // Stop routing
    if (!window.confirm("Delete this playlist permanently?")) return;
    try {
      await playlistService.deletePlaylist(id);
      setPlaylists(playlists.filter((pl) => pl.id !== id));
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  const renamePlaylist = async (e, id, oldName) => {
    e.preventDefault(); // Stop routing
    const newName = window.prompt("Rename playlist to:", oldName);
    if (!newName || !newName.trim()) return;
    try {
      const updatedPlaylist = await playlistService.updatePlaylist(id, newName);
      setPlaylists(playlists.map((pl) => (pl.id === id ? updatedPlaylist : pl)));
    } catch (err) {
      console.error("Error renaming playlist:", err);
    }
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