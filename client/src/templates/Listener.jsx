/*
    code with original record buttons
*/
import AudioPlayer from '../components/audioPlayer/audioPlayer.js'
import TextMessages from '../components/textMessages/textMessages.js'

import React, {Component} from 'react';
class Listener extends Component {

  render() {
     return (
       <div>
         <h1>Hi There, you are the listener, be quiet</h1>

         <AudioPlayer ws={this.props.parentStates.ws}/>

       </div>
     )
   }


 }
 export default Listener;