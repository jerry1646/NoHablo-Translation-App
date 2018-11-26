/*
    code with original record buttons
*/

// wireframe: https://wireframe.cc/Ukwx24
import React, {Component} from 'react';
import Audio from '../components/browser_audio/Audio.jsx'
import TextMessages from '../components/textMessages/textMessages.js'


class Speaker extends Component {

  render() {
    return (
      <div className='chatroom' id='speaker-view'>
        <nav>

        </nav>
        <div className='message-container'>
          <div className='room-info'>
            <p>Speaker</p>
            <p>Room Name:{this.props.parentStates.room_name}</p>
            <p>Room ID:{this.props.parentStates.room_id}</p>
            <p>Speaker Language:{this.props.parentStates.language}</p>
          </div>
          <div className='message-list my-message-list'>
           <TextMessages ws={this.props.parentStates.ws}/>
          </div>
        </div>
        <div id='audio-visualizer'>
          <h2>Audio Visualizer Goes Here</h2>
        </div>
        <div className='bottom-bar'>
          <div className='speaker-button record'>
          </div>
          <div className='speaker-button stop'>
          </div>
        </div>
        <Audio ws={this.props.parentStates.ws}/>

      </div>
    )
  }


 }

 export default Speaker;