import React, {Component} from 'react';

import Users from "./components/users/users";
import AudioPlayer from "./components/audioPlayer/audioPlayer";
import Audio from './components/browser_audio/Audio.jsx'
import Welcome from './templates/Welcome.jsx'
import CreateRoom from './templates/CreateRoom.jsx'
import JoinRoom from './templates/JoinRoom.jsx'
import Speaker from './templates/Speaker.jsx'
import Listener from './templates/Listener.jsx'


class App extends Component {

  constructor(props){
    super(props);
    this.state={
      view: "Welcome",
      speaker_language: "",
      room_id: "",
      room_name: ""
    }
    this.tx={};
  }

  componentDidMount(){
    const changeView=(newView)=>{
      this.setState({view: newView})
    }
    const changeSpeakerLanguage=(language)=>{
      this.setState({speaker_language: language})
    }
    const changeRoomID=(id)=>{
      this.setState({room_id: id})
    }
    const changeRoomName=(roomname)=>{
      this.setState({room_name: roomname})
    }

    this.tx.changeView=changeView;
    this.tx.changeSpeakerLanguage = changeSpeakerLanguage;
    this.tx.changeRoomID = changeRoomID;
    this.tx.changeRoomName = changeRoomName;
  }

  render() {
    if(this.state.view==="Welcome")
    {
      console.log(this.state.view);
      return <Welcome parentStates={this.state} parentMethods={this.tx}/>
    }else if (this.state.view==="CreateRoom") {
      console.log(this.state.view);
      return <CreateRoom parentStates={this.state} parentMethods={this.tx}/>
    }else if(this.state.view === "JoinRoom"){
      return <JoinRoom parentStates={this.state} parentMethods={this.tx}/>
    }else if (this.state.view === "Speaker") {
      return <Speaker parentStates={this.state} parentMethods={this.tx}/>
    }else if(this.state.view === "Listener"){
      return <Listener parentStates={this.state} parentMethods={this.tx}/>
    }

  }

}


export default App;

