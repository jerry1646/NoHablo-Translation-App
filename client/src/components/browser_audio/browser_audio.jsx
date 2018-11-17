import React, {Component} from 'react';
import {startRecording, stopRecording} from './helper.js'
import recorder from './recorder.js'

class Audio extends Component {
  render(){
    return (
      <div>
       <button onClick= {startRecording} id="recordButton">Record</button>
       <button onClick= {stopRecording} id="stopButton" >Stop</button>
      </div>
    )
  }
}

export default Audio
