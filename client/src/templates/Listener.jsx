import AudioPlayer from '../components/audioPlayer/AudioPlayer.js'
import TextMessages from '../components/textMessages/TextMessages.js'
import ConnectionIndicator from '../components/connectionIndicator/ConnectionIndicator.js'

import React, {Component} from 'react';
class Listener extends Component {
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
      <div className='chatroom' id='listener-view'>

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

          <div className='message-list their-message-list'>
            <TextMessages ws={this.props.parentStates.ws}/>
          </div>

          <div className='room-info-container'>
          {this.state.showInfo &&
            (
            <div className='blurred-box'>
              <div className='room-info-box'>
                <div className='room-info'>
                  <p>Room ID: {this.props.parentStates.room_id}</p>
                  <p>Your Language: {this.props.parentStates.language}</p>
                </div>
              </div>
            </div>

          )}
          </div>
        </div>


        <AudioPlayer ws={this.props.parentStates.ws} methods={this.tx}/>
      </div>
    )
  }


}
export default Listener;