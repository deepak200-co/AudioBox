// import Playlist from './Playlist';
// import NowPlaying from './NowPlaying'
// import React, { useState, useEffect, useRef } from 'react';

// const openDB = () => {
//   return new Promise((resolve, reject) => {
//     const request = window.indexedDB.open('AudioPlayerDB', 1);

//     request.onerror = (event) => {
//       reject('Failed to open the database');
//     };

//     request.onsuccess = (event) => {
//       const db = event.target.result;
//       resolve(db);
//     };

//     request.onupgradeneeded = (event) => {
//       const db = event.target.result;
//       db.createObjectStore('playlist', { autoIncrement: true });
//     };
//   });
// };

// const AudioPlayer = () => {
//   const [playlist, setPlaylist] = useState([]);
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     openDB().then((db) => {
//       const transaction = db.transaction(['playlist'], 'readonly');
//       const objectStore = transaction.objectStore('playlist');
//       const request = objectStore.getAll();

//       request.onsuccess = (event) => {
//         const tracks = event.target.result;
//         setPlaylist(tracks);
//       };

//       const lastPlaybackTime = parseFloat(localStorage.getItem('lastPlaybackTime')) || 0;
//       const storedIndex = parseInt(localStorage.getItem('currentTrackIndex')) || 0;

//       setCurrentTrackIndex(storedIndex);

//       if (audioRef.current) {
//         audioRef.current.currentTime = lastPlaybackTime;
//       }
//     });
//   }, []);

//   const updatePlaylistQueue = (index) => {
//     const updatedPlaylist = [...playlist];
//     const movedTrack = updatedPlaylist.splice(index, 1)[0];
//     updatedPlaylist.unshift(movedTrack); 
//     setPlaylist(updatedPlaylist);
//     setCurrentTrackIndex(0);
//   };
//   const clearPlaylist = () => {
//     openDB().then((db) => {
//       const transaction = db.transaction(['playlist'], 'readwrite');
//       const objectStore = transaction.objectStore('playlist');
//       const clearRequest = objectStore.clear();

//       clearRequest.onsuccess = () => {
//         setPlaylist([]);
//         setCurrentTrackIndex(0);
//       };
//     });
//   };

//   const playNextTrack = () => {
//     const nextIndex = (currentTrackIndex + 1) % playlist.length;
//     updatePlaylistQueue(nextIndex);
//   };

//   const playPreviousTrack = () => {
//     const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
//     updatePlaylistQueue(prevIndex);
//   };

//   const handleAudioEnd = () => {

//     playNextTrack();
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         openDB().then((db) => {
//           const transaction = db.transaction(['playlist'], 'readwrite');
//           const objectStore = transaction.objectStore('playlist');
//           objectStore.add({ name: file.name, url: e.target.result });

//           setPlaylist([{ name: file.name, url: e.target.result }, ...playlist]);
//           setCurrentTrackIndex(0);
//         });
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const handleTimeUpdate = () => {

//     if (audioRef.current) {
//       localStorage.setItem('lastPlaybackTime', audioRef.current.currentTime.toString());
//       localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
//     }
//   };

//   const handlePlaylistItemClick = (index) => {
//     setCurrentTrackIndex(index);
//   };

//   return (
//     <div>
//       <input type="file" accept="audio/*" onChange={handleFileUpload} />
//       <audio
//         ref={audioRef}
//         controls
//         autoPlay
//         onEnded={handleAudioEnd}
//         onTimeUpdate={handleTimeUpdate}
//         src={playlist[currentTrackIndex]?.url}
//       />
//       <button onClick={playPreviousTrack}>Previous</button>
//       <button onClick={playNextTrack}>Next</button>
//       <button onClick={clearPlaylist}>Clear Playlist</button>
//       <Playlist playlist={playlist} onPlaylistItemClick={handlePlaylistItemClick} />
//       <NowPlaying track={playlist[currentTrackIndex]} />
//     </div>
//   );
// };

// export default AudioPlayer;

// Inside AudioPlayer.jsx

import Playlist from './Playlist';
import NowPlaying from './NowPlaying';
import React, { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css'

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('AudioPlayerDB', 1);

    request.onerror = (event) => {
      reject('Failed to open the database');
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('playlist', { autoIncrement: true });
    };
  });
};

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    openDB().then((db) => {
      const transaction = db.transaction(['playlist'], 'readonly');
      const objectStore = transaction.objectStore('playlist');
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const tracks = event.target.result;
        setPlaylist(tracks);
      };

      const lastPlaybackTime = parseFloat(localStorage.getItem('lastPlaybackTime')) || 0;
      const storedIndex = parseInt(localStorage.getItem('currentTrackIndex')) || 0;

      setCurrentTrackIndex(storedIndex);

      if (audioRef.current) {
        audioRef.current.currentTime = lastPlaybackTime;
      }
    });
  }, []);

  const clearPlaylist = () => {
    openDB().then((db) => {
      const transaction = db.transaction(['playlist'], 'readwrite');
      const objectStore = transaction.objectStore('playlist');
      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = () => {
        setPlaylist([]);
        setCurrentTrackIndex(0);
      };
    });
  };

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
  };

  const playPreviousTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
  };

  const handleAudioEnd = () => {
    playNextTrack();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        openDB().then((db) => {
          const transaction = db.transaction(['playlist'], 'readwrite');
          const objectStore = transaction.objectStore('playlist');
          objectStore.add({ name: file.name, url: e.target.result });

          setPlaylist([{ name: file.name, url: e.target.result }, ...playlist]);
          setCurrentTrackIndex(0);
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      localStorage.setItem('lastPlaybackTime', audioRef.current.currentTime.toString());
      localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
    }
  };

  const handlePlaylistItemClick = (index) => {
    setCurrentTrackIndex(index);
  };

  return (
    <div className="audio-player-container">
      <div className="file-input-container">
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
      </div>
      <div className="audio-player">
        <audio
          ref={audioRef}
          controls
          autoPlay
          onEnded={handleAudioEnd}
          onTimeUpdate={handleTimeUpdate}
          src={playlist[currentTrackIndex]?.url}
        />
        <div className="audio-controls">
          <button onClick={playPreviousTrack}>Previous</button>
          <button onClick={playNextTrack}>Next</button>
          <button onClick={clearPlaylist}>Clear Playlist</button>
        </div>
      </div>
      <div className="audio-info">
        <NowPlaying track={playlist[currentTrackIndex]} />
      </div>
      <div className="playlist-container">
        <Playlist playlist={playlist} onPlaylistItemClick={handlePlaylistItemClick} />
      </div>
    </div>
  );
};

export default AudioPlayer;
