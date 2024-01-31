import React from 'react';
import './AudioPlayer.css';

const NowPlaying = ({ track }) => {
  return (
    <div>
      <h3>Now Playing</h3>
      <marquee>
        <div className="now-playing-text">
        {track ? <p>{track.name}</p> : <p>No track playing</p>}
      </div>
      </marquee>
    </div>
  );
};

export default NowPlaying;
