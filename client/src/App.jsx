import React, {Component} from 'react';

import Users from "./components/users/users";
import AudioPlayer from "./components/audioPlayer/audioPlayer";
import Audio from './components/browser_audio/Audio.jsx'


class App extends Component {

  render() {
    return (
      <div>
        <h1>Welcome to React App</h1>
        <Users/>
        <AudioPlayer/>
        <Audio/>

      </div>
    );
  }
}
export default App;