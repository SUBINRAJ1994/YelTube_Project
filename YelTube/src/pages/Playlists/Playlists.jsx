import { useState } from "react";
import "./Playlists.css";

const Playlists = () => {

  const [playlistName,
  setPlaylistName] =
  useState("");

  const [playlists,
  setPlaylists] =
  useState(
    JSON.parse(
      localStorage.getItem(
        "playlists"
      )
    ) || []
  );

  const createPlaylist = () => {

    if (!playlistName.trim()) {
      return;
    }

    const newPlaylist = {
      id: Date.now(),
      name: playlistName,
      videos: []
    };

    const updatedPlaylists = [
      ...playlists,
      newPlaylist
    ];

    setPlaylists(
      updatedPlaylists
    );

    localStorage.setItem(
      "playlists",
      JSON.stringify(
        updatedPlaylists
      )
    );

    setPlaylistName("");

  };

  return (

    <div className="playlists-page">

      <h2>My Playlists</h2>

      <div className="playlist-create">

        <input
          type="text"
          placeholder="Playlist Name"
          value={playlistName}
          onChange={(e)=>
            setPlaylistName(
              e.target.value
            )
          }
        />

        <button
          onClick={
            createPlaylist
          }
        >
          Create
        </button>
        

      </div>

      {
        playlists.map(
          (playlist) => (

          <div
            key={playlist.id}
            className="playlist-card"
          >

            <h3>
              {playlist.name}
            </h3>

            <p>
              {playlist.videos.length}
              {" "}Videos
            </p>

          </div>

        ))
      }

    </div>

  );

};

export default Playlists;