
import React, {Component} from 'react';
import NavBar from './NavBar.jsx'

class Welcome extends React.Component{
  constructor(props){
    super(props);
    this.tx={};
    const getCreateRoomView = () => {
      this.props.parentMethods.changeView("CreateRoom");
    }

    const getJoinRoomView = () => {
    this.props.parentMethods.changeView("JoinRoom");
  }
    this.tx.getCreateRoomView=getCreateRoomView;
    this.tx.getJoinRoomView=getJoinRoomView;
  }


  render(){
    console.log(this.tx.getCreateRoomView);
    return(
      <div className="welcome-page">
        <NavBar parentMethods={this.tx}/>
        <div id="container2">
            <div id="col1" onClick={this.tx.getCreateRoomView}>
              <h2>Create a room</h2>
              <figure><img src="../styles/images/speaker2.png" id="speaker"/></figure>
              <div className="info">
                <p>
                  Create a room so that others can listen to you!
                </p>
                <p>
                  Select a language, name the room, and share the room pin with your listeners!
                </p>
              </div>
            </div>
            <div id="col2" onClick={this.tx.getJoinRoomView}>
              <h2>Join a Room</h2>
              <figure><img src="../styles/images/headphones2.png" id="listener"/></figure>
              <div className="info">
                <p>
                  Join a room and listener in your native tongue!
                </p>
                <p>
                  Select a language, set your name, input the speaker's Pin and you're all set!
                </p>
              </div>
            </div>
          </div>

      </div>
    )
  }
}


export default Welcome