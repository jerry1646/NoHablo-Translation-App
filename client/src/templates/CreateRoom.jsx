
import React, {Component} from 'react';

class CreateRoom extends React.Component{

  backToWelcome=()=>{
    this.props.parentMethods.changeView("Welcome");
  }

  handleChange=(event)=>{
    event.preventDefault();
    //change App.jsx state.view to <Speaker/>
    //generate random room id
    //add room name, room id and speaker language to App.jsx state
    this.props.parentMethods.changeView("Speaker");
    this.props.parentMethods.changeRoomID("123");
    this.props.parentMethods.changeRoomName(event.target.room_name.value);
    this.props.parentMethods.changeSpeakerLanguage(event.target.speaker_language.value);
    console.log(event.target.room_name.value);
    // this.props.parentMethods.changeRoomName()

  }

  render(){

    return(
      <div>
        <h1> Create your own room!</h1>
        <form onSubmit={this.handleChange}>
          <label>
          Room Name:
          <input type="text" name="room_name" id='room_name'/>
          Speaker Language:
          <input type="text" name="speaker_language" />
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <button onClick= {this.backToWelcome} id="GoBack">Back</button>
    </div>
    )
  }
}


export default CreateRoom;