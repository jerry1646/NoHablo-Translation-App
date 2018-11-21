import React, {Component} from 'react';

class MessageTest extends Component {
  constructor(){
    super()
    this.state = {
    }
  }

  componentDidMount(){
    var host = 'ws:localhost:5000/binary-endpoint';
    var client = new BinaryClient(host);

    client.on('stream', stream => {

      stream.on('data', data => {
        if(!Buffer.isBuffer(data)) {
          let msg = JSON.parse(data);
          switch(msg.type) {
            case 'notification':
              console.log(msg.content)
              break;
            case 'error':
              console.log(msg.content)
              break;
          }
        }
      });

      stream.on('end', () => {
        console.log('audio stream ended..')
      });

    });

    //send join Room message but room doesnt exist
    // var msg = {
    //   type: 'registration',
    //   content: {
    //     name: 'JerryBear',
    //     language: 'ko-KR',
    //     roomPin: '0'
    //   }
    // };
    // setTimeout(()=>{
    //   client.send(JSON.stringify(msg));
    // }, 3000);


    //send create room message
    var msg = {
      type: 'create-room',
      content: {
        name: 'JerryBear',
        language: 'en-US'
      }
    };
    setTimeout(()=>{
      client.send(JSON.stringify(msg));

      //send join Room message
      msg = {
        type: 'registration',
        content: {
          name: 'JerryBear',
          language: 'ko-KR',
          roomPin: 0
        }
      }
      setTimeout(()=>{
        client.send(JSON.stringify(msg));
      }, 3000);
    }, 3000);

  }

  render(){
    return (
      <div>
      </div>
    )
  }

}

export default MessageTest;
