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
    console.log("Mounted text message handler.");

    this.props.ws.on('stream', stream => {

      console.log("TEXTMESSAGE: receiving data stream")


      //HANDLE INCOMING DATA
      stream.on('data', data => {

        console.log(`Text message handler received data: ${data}`)
        if(data && typeof(data) == 'string'){

          let msg = JSON.parse(data);
          if(msg.type === 'message' && msg.content.inText){
            const oldMessageList = this.state.messageList;
            const newMessageList = [...oldMessageList, msg.content];
            this.setState({messageList: newMessageList})
            console.log(this.state.messageList)

          } else if(msg.type === 'notification' && msg.content.info) {

            //****************************************
            //*         EDIT HERE JERRY PLZ          *
            //****************************************

            console.log(msg.content.info)
            this.props.ws.removeAllListeners('stream');
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

  // scrollToBottom = () => {
  //   this.endOfMsg.scrollIntoView({ behavior: "instant", block: "end" });
  // }
}

export default TextMessages