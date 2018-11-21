import React, {Component} from 'react';

import AudioPlayer from "./components/audioPlayer/audioPlayer";
import Audio from './components/browser_audio/Audio.jsx'

import MessageTest from './components/MessageTest/messageTest.js'

class App extends Component {

  render() {
    return (
      <div>
        <h1>Welcome to React App</h1>
        <MessageTest/>
        <AudioPlayer/>
        <Audio/>
      </div>
    );
  }
}
export default App;