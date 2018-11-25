
import React, {Component} from 'react';
import NavBar from './NavBar.jsx'
class Welcome extends React.Component{


  getCreateRoomView = () => {
      this.props.parentMethods.changeView("CreateRoom");
    }

  getJoinRoomView = () => {
    this.props.parentMethods.changeView("JoinRoom");
  }

  render(){

    return(
      <div className="welcome_page">
        <NavBar />

        <div id="container2">
            <div id="col1">
              <h2>Create a room</h2>
              <figure><img src="../styles/images/Sample1.svg"/></figure>
              <p>It does not matter how much content is in each column, the background colours will always stretch down to the height of the tallest column.</p>
              <h2>2 Column Dimensions</h2>
              <p>Each column is 50 percent wide with 2 percent padding on each side.</p>
              <h2>No CSS hacks</h2>
              <p>The CSS used for this 2 column layout is 100% valid and hack free. To overcome Internet Explorer's broken box model, no horizontal padding or margins are used. Instead, this design uses percentage widths and clever relative positioning.</p>
              <h2>No Images</h2>
              <p>This Two column layout requires no images. Many CSS website designs need images to colour in the column backgrounds but that is not necessary with this design. Why waste bandwidth and precious HTTP requests when you can do everything in pure CSS and HTML?</p>
            </div>
            <div id="col2">
              <h2>Join a Room</h2>
              <figure><img src="../styles/images/Sample1.svg"/></figure>
              <p>This 2 column layout has been tested on the following browsers:</p>
              <h3>iPhone &amp; iPod Touch</h3>
              <ul>
                <li>Safari</li>
              </ul>
              <h3>Mac</h3>
              <ul>
                <li>Safari</li>
                <li>Firefox</li>
                <li>Opera 9</li>
                <li>Netscape 7 &amp; 9</li>
              </ul>
              <h3>Windows</h3>
              <ul>
                <li>Firefox 1.5, 2 &amp; 3</li>
                <li>Safari</li>
                <li>Opera 8 &amp; 9</li>
                <li>Explorer 5.5, 6 &amp; 7</li>
                <li>Google Chrome</li>
                <li>Netscape 8</li>
              </ul>
            </div>
          </div>

      </div>
    )
  }
}


export default Welcome