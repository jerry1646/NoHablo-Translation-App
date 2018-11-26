
import React, {Component} from 'react';

class JoinRoom extends React.Component{

  constructor(){
    super()

    this.state = {
      errorMessage: "",
      displayError: false
    }
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
        language: event.target.listenerLanguage.options[event.target.listenerLanguage.selectedIndex].value,
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
          let errorMsg = `Join room request denied - ${msg.content.type}: ${msg.content.text}`
          this.setState({errorMessage: errorMsg, displayError: true})
          console.log(errorMsg);
        }
      } else {
        console.log("Expect response from server to be a stringified JSON")
      }
    });
  }

  render(){
    return(
      <div id='join-room'>
        {this.state.displayError &&
          (
            <div className='error-bar'>
              <p>{this.state.errorMessage}</p>
            </div>
          )
        }

        <div className="blurred-box">
          <h1>Join a room!</h1>
          <div className="user-info-box">
            <form onSubmit={this.handleChange} className="user-info-form">

              <input type="text" name="name" placeholder="Your Name" />

              <input type="text" name="roomId" placeholder="Room Pin" />

              <select name="listenerLanguage" id="language-list">
                <option value="en-US">English (US)</option>
                <option value="nl-NL">Dutch (Netherlands)</option>
                <option value="en-AU">English (Australia)</option>
                <option value="en-GB">English (UK)</option>
                <option value="fr-FR">French</option>
                <option value="fr-CA">French (Canada)</option>
                <option value="de-DE">German</option>
                <option value="it-IT">Italian</option>
                <option value="ja-JP">Japanese</option>
                <option value="ko-KR">Korean</option>
                <option value="pt-BR">Portugese (Brazil)</option>
                <option value="es-ES">Spanish</option>
                <option value="sv-SE">Swedish</option>
                <option value="tr-TR">Turkish</option>
              </select>

              <input type="submit" value="Submit" />

              <button onClick= {this.backToWelcome} id="go-back-button">Back</button>

            </form>
          </div>
        </div>
      </div>
    )
  }


}




export default JoinRoom