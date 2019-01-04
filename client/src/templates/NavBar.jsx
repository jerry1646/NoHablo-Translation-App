import React, {Component} from 'react';

class NavBar extends React.Component{

  render(){

    return(

      <nav className="navigation main-nav">
          <div id='logo-container'>
            <img id = 'logo' src="../src/images/logo-bright.png"/>
            <div>
            <a>No Hablo</a>
            </div>
          </div>
          <div id='middle-placeholder'/>
          <div id='navbar-button-container'>
            <button onClick={this.props.parentMethods.getCreateRoomView} >Create Room</button>
            <button onClick={this.props.parentMethods.getJoinRoomView} >Join Room</button>
          </div>
      </nav>


    )
  }
}


export default NavBar