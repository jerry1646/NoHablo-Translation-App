import React, {Component} from 'react';

class ConnectionIndicator extends Component {

  constructor(){
    super();
    this.state = {
      connected: true
    }
  }

  componentDidMount(){

    this.props.ws.on('stream', stream => {

      stream.on('data', data =>{
        if(data && typeof(data) == 'string'){
          let msg = JSON.parse(data)

          if(msg.type === 'notification' && msg.content.text === 'room-closed'){
            this.setState({connected: false})
          }
        }
      })

    })
  }

  render(){
    if(this.state.connected){
      return (
        <i className="material-icons" id="connected">
          check_circle
        </i>
      )
    } else{
      return(
        <i className="material-icons" id="disconnected">
          voice_over_off
        </i>
      )
    }
  }

}

export default ConnectionIndicator;
