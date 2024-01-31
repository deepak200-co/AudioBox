import React from 'react';
import './AudioPlayer.css';

const Playlist = ({ playlist, onPlaylistItemClick }) => {
  return (
    <div className="playlist-container">
      <h3>Playlist</h3>
      <div className="song-boxes">
        {playlist.map((track, index) => (
          <div key={index} className="song-box" onClick={() => onPlaylistItemClick(index)}>
            {track.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
