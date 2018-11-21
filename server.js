const util = require('util')
const fs = require('fs');
// var FileReader = require('filereader') , fileReader = new FileReader()
//   ;

const express = require('express')
const app = express()

const BinaryServer = require('binaryjs').BinaryServer;

// const translator = require('./lib/translator/test.js');
const translator = require('./lib/translator/test_buffer.js');


const file_name = 'BrowserAudio.wav' //also output.mp3
const file_path = './' + file_name

// const file_name = 'output1.wav' //also output.mp3
// const file_path = 'lib/translator/resources/' + file_name

app.get('/api/users', (req, res) => {
  const users = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Steve', lastName: 'Stan'},
    {id: 3, firstName: 'Marrie', lastName: 'Swanson'},
  ]
  res.json(users)
})

const port = 5000

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

//BINARY SERVER INITIALIZATION
const binaryServer = new BinaryServer({server: server, path: '/binary-endpoint'});


//HELPER FUNCTION FOR SENDING DATA TO PARTICULAR LANGUAGE GROUP
function sendMsg(bs, language, data) {
  for(let id in binaryServer.clients) {
    if(bs.clients.hasOwnProperty(id)) {
      let otherClient = bs.clients[id];
      otherClient.send(data)
    }
  }
}



//MANAGE CLIENT CONNECTIONS TO BINARY SERVER
languageGroups = {};
// rooms = {};
roomMsgBuffer = [];

binaryServer.on('connection', client => {
  console.log(`BinaryServer connection established: ${client.id}`);

  let audioBuffer = []

  client.on('stream', stream =>{

    //PROCESS RECEPTION OF STREAM DATA AS EITHER AUDIO BUFFERS OR STRING MESSAGES
    stream.on('data', data => {

      if(Buffer.isBuffer(data)){
        audioBuffer.push(data)
      } else {
        let msg = JSON.parse(data);
        switch(msg.type) {
          case 'create-room':
            console.log("Created a new room!")
            break;
          case 'registration':
            // SHOULD HAVE TO CHECK IF ROOM IS VALID
            // checkRoomId(msg.content.roomPin)
            msg.content['id'] = client.id;
            if(!languageGroups[msg.language]){
              languageGroups[msg.language] = [msg.content]
            } else {
              languageGroups[msg.language].push(msg.content)
            }
            break;
          case 'message':
            console.log("I got a message!");
            break;
          default:
            console.log("Something must have gone wrong in switch statement");
            break;
        }
      }
    });

    //PROCESS END OF STREAM BY INITIATING TRANSLATION PIPELINE
    stream.on('end', () => {
      if(audioBuffer.length) {
        let bufferComplete = Buffer.concat(audioBuffer);
        roomMsgBuffer.push(bufferComplete);
        console.log("audio stream ended...")
      }
    })
  })
});

while

// translator(bufferComplete)
  // .catch((err) => { console.log('ERROR:', err) })
  // .then(data => {
  //   translator.done = true;
  //   translator.data = data;


  //   let stream = fs.createReadStream(audioFilename);

  //   for(let id in binaryServer.clients) {
  //     if(binaryServer.clients.hasOwnProperty(id)) {
  //       let otherClient = binaryServer.clients[id];
  //       // // let send = otherClient.createStream(meta);
  //       // let send = otherClient.createStream({data: 'audio'});
  //       // stream.pipe(send);
  //       otherClient.send(data)
  //     }
  //   }
  // });


