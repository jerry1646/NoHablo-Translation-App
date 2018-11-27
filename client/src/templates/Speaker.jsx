/*
    code with original record buttons
*/

// wireframe: https://wireframe.cc/Ukwx24
import React, {Component} from 'react';
import Audio from '../components/browser_audio/Audio.jsx'
import TextMessages from '../components/textMessages/textMessages.js'
import ConnectionIndicator from '../components/connectionIndicator/ConnectionIndicator.js'


class Speaker extends Component {
  constructor(){
    super();
    this.state={
      showInfo:false
    }

    this.tx={
      toggleInfo:() =>{
        let status = this.state.showInfo
        this.setState({
          showInfo:!status
        })
      }
    }
  }


  render() {
    return (
      <div className='chatroom' id='speaker-view'>
        <div className='message-container'>
          <div className='top-bar'>
            <div className='chatroom-logo'/>
            <div className='roomname-container'>
              <h2>Room: {this.props.parentStates.room_name}</h2>
            </div>
            <div className='connection-container'>
              <ConnectionIndicator ws={this.props.parentStates.ws}/>
            </div>
          </div>
          <div className='room-info-container'>
          {this.state.showInfo &&
            (
            <div className='blurred-box'>
              <div className='room-info-box'>
                <div className='room-info'>
                  <p>Room ID: {this.props.parentStates.room_id}</p>
                  <p>Speaker Language: {this.props.parentStates.language}</p>
                </div>
              </div>
            </div>
          )}
          </div>

          <div className='message-list my-message-list'>
           <TextMessages ws={this.props.parentStates.ws}/>
          </div>
        </div>
        <Audio ws={this.props.parentStates.ws} methods={this.tx}/>

      </div>
    )
  }


 }

 export default Speaker;