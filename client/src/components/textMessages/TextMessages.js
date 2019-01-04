import React, {Component} from 'react';
import MessageList from "./MessageList.js";


class TextMessages extends Component {

  constructor(){
    super()
    this.state = {
      messageList: []
    }
  }

  componentDidMount(){

    this.props.ws.on('stream', stream => {

      //HANDLE INCOMING DATA
      stream.on('data', data => {

        console.log(`Text message handler received data: ${data}`)

        //Only responsible for string messages
        if(data && typeof(data) == 'string'){
          let msg = JSON.parse(data);
          if(msg.type === 'message' && msg.content.inText){
            const oldMessageList = this.state.messageList;
            const newMessageList = [...oldMessageList, msg.content];
            this.setState({messageList: newMessageList})
          } else {
            console.log('expect message to be type "message" or content is empty')
          }

        } else{
          console.log('datatype of the text message is not right')
        }
      });

      //HANDLE STREAM CLOSING
      stream.on('end', () => {
        console.log('end of data stream...')
      });
    });
  }

  render(){
    return (
      <div className="messageList">
        <MessageList messages = {this.state.messageList}/>
      </div>
    )
  }
}

export default TextMessages