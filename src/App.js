import React from 'react';
import AudioPlayer from './Audio/AudioPlayer';
import './App.css';

const App = () => {
  return (
    <div className='App'>
      <h1 style={{color:'white', textAlign:'right' }} >AudioBox<sub style={{ fontSize:'15px'  }} >By Deepak</sub></h1>
      <AudioPlayer />
    </div>
  );
};

export default App;
