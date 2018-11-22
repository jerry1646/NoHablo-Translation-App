
import React, {Component} from 'react';

class Welcome extends React.Component{


  getCreateRoomView = () => {
      this.props.parentMethods.changeView("CreateRoom");
    }

  getJoinRoomView = () => {
    this.props.parentMethods.changeView("JoinRoom");
  }

  render(){

    return(
      <div className="mid">

          <h1>NoHablo</h1>
          {/*<img src='src/images/cloud.jpg'/>*/}
          <button onClick={this.getCreateRoomView} id="recordButton">Create Room</button>
          <button onClick={this.getJoinRoomView} id="recordButton">Join Room</button>

      </div>
    )
  }
}




export default Welcome