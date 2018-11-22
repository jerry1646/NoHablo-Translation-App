/*
    code with original record buttons
*/
import React, {Component} from 'react';
import Audio from '../components/browser_audio/Audio.jsx'

class Speaker extends Component {

  render() {
     return (
       <div>
         <h1>Hi There, you are the speaker, say something </h1>
         <h1>Room Name:{this.props.parentStates.room_name}</h1>
         <h1>Room ID:{this.props.parentStates.room_id}</h1>
         <h1>Speaker Language:{this.props.parentStates.language}</h1>
         <Audio ws={this.props.parentStates.ws}/>
       </div>
     )
   }


 }

 export default Speaker;