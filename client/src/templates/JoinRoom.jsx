
import React, {Component} from 'react';

class JoinRoom extends React.Component{



 backToWelcome=()=>{
    this.props.parentMethods.changeView("Welcome");
  }

  render(){

    return(
      <div>
        <h1> Join an existing room!</h1>
          <form>
          <label>
          Room ID:
          <input type="text" name="room_id" />
          Listener Language:
          <input type="text" name="listener_language" />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <button onClick= {this.backToWelcome} id="GoBack">Back</button>
      </div>
    )
  }


}




export default JoinRoom