
import React, {Component} from 'react';

class CreateRoom extends React.Component{

  constructor(){
    super()
  }

  backToWelcome = () => {
    this.props.parentMethods.changeView("Welcome");
  }

  handleChange = event => {
    event.preventDefault();
    event.persist();

    console.log(event.target.speakerLanguage)
    //change App.jsx state.view to <Speaker/>
    //generate random room id
    //add room name, room id and speaker language to App.jsx state
    let msg = {
      type: 'create-room',
      content: {
        name: event.target.roomName.value,
        language: event.target.speakerLanguage.value
      }
    }
    console.log(`Attempting to create room.`)
    this.props.parentStates.ws.send(JSON.stringify(msg));

    this.props.parentStates.ws.on('stream', this.handleStream);
  }

  handleStream = stream => {
      console.log("Receiving response stream")

      //HANDLE INCOMING DATA
      stream.on('data', data => {
        console.log("Receiving data")
        if(!Buffer.isBuffer(data)) {
          let msg = JSON.parse(data);
          if(msg.content.text === 'success') {

            this.props.parentMethods.changeRoomID(msg.content.id);
            this.props.parentMethods.changeRoomName('RoomSession - '+msg.content.id);
            this.props.parentMethods.changeLanguage(msg.content.language);

            this.props.parentStates.ws.removeAllListeners('stream');

            this.props.parentMethods.changeView("Speaker");
          } else {
            console.log("Create room request denied - reason unknown")
          }
        } else {
          console.log("Create room request returned buffer wtf?")
        }
      });
  }

  render(){
    return(
      <div>
        <h1> Create your own room!</h1>
        <form onSubmit={this.handleChange}>
          <label>Room Name:</label>
          <input type="text" name="roomName" id='roomName'/>
          <label>Speaker Language:</label>
          <input type="text" name="speakerLanguage"/>
          <input type="submit" value="Submit"/>
        </form>
        <button onClick= {this.backToWelcome} id="GoBack">Back</button>
    </div>
    )
  }
}


export default CreateRoom;