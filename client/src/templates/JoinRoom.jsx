
import React, {Component} from 'react';

class JoinRoom extends React.Component{

  constructor(){
    super()
  }

  backToWelcome = () => {
    this.props.parentMethods.changeView("Welcome");
  }

  handleChange = event => {
    event.preventDefault();
    event.persist();

    //change App.jsx state.view to <Speaker/>
    //generate random room id
    //add room name, room id and speaker language to App.jsx state
    let msg = {
      type: 'registration',
      content: {
        name: event.target.name.value,
        language: event.target.listenerLanguage.value,
        roomId: event.target.roomId.value
      }
    }
    console.log(`Attempting registration to room ${event.target.roomId.value}`)
    this.props.parentStates.ws.send(JSON.stringify(msg));

    this.props.parentStates.ws.on('stream', this.handleStream);
  }

  handleStream = stream => {
    console.log("Receiving response stream")

    //HANDLE INCOMING DATA
    stream.on('data', data => {

      console.log(data)

      if(data && typeof(data) == 'string') {
        let msg = JSON.parse(data);

        if(msg.type === 'notification' && msg.content.text === 'success') {

          this.props.parentMethods.changeRoomID(msg.content.id);
          this.props.parentMethods.changeRoomName('RoomSession'+msg.content.id);
          this.props.parentMethods.changeLanguage(msg.content.language);

          this.props.parentStates.ws.removeAllListeners('stream');

          this.props.parentMethods.changeView("Listener");

        } else {
          console.log(`Join room request denied - ${msg.content.type}: ${msg.content.text}`);
        }
      } else {
        console.log("Expect response from server to be a stringified JSON")
      }
    });
  }

  render(){
    return(
      <div id='join-room'>
        <h1> Join an existing room!</h1>
          <div className="blurred-box">
            <div className="user-info-box">
              <form onSubmit={this.handleChange} className="user-info-form">
                <label>Name:</label>
                <input type="text" name="name" />
                <label>PIN:</label>
                <input type="text" name="roomId" />
                <label>Language:</label>
                <input type="text" name="listenerLanguage" />
                <input type="submit" value="Submit" />
              </form>
            </div>
          </div>
        <button onClick= {this.backToWelcome} id="GoBack">Back</button>
      </div>
    )
  }


}




export default JoinRoom