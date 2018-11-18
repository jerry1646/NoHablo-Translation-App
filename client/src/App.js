import React, {Component} from 'react';
import Users from "./components/users/users";
import AudioPlayer from "./components/audioPlayer/audioPlayer";

class App extends Component {
  render() {
    return (
      <div>
        <h1>Welcome to React App</h1>
        <Users/>
        <AudioPlayer/>
      </div>
    );
  }
}
export default App;
