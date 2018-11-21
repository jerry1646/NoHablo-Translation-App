// const util = require('util')
// const fs = require('fs');

//Create simple express server
const express = require('express')
const app = express()

//Binary server = abstraction layer on top of socket.io to facilitate sending/receiving binary data.
const BinaryServer = require('binaryjs').BinaryServer;

// const translator = require('./lib/translator/test.js');
// const translator = require('./lib/translator/test_buffer.js');

//IMPORT CHATROOM CLASS
const Chatroom = require('./lib/chatroom.js');


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

//MANAGE CLIENT CONNECTIONS TO BINARY SERVER
rooms = {};

function checkRoomId(roomPin) {
 return rooms.hasOwnProperty(roomPin);
}

currentRoomId = 0;

binaryServer.on('connection', client => {
  console.log(`BinaryServer connection established: ${client.id}`);

  client.on('stream', stream =>{
    console.log(`Receiving stream from client: ${client.id}`);
    let audioBuffer = []

    //PROCESS RECEPTION OF STREAM DATA AS EITHER AUDIO BUFFERS OR STRING MESSAGES
    stream.on('data', data => {

      if(Buffer.isBuffer(data)){

        audioBuffer.push(data)

      } else {

        let msg = JSON.parse(data);
        switch(msg.type) {

          case 'create-room':
            rooms[currentRoomId] = new Chatroom(currentRoomId, client.id, msg.content.language, binaryServer.clients);
            console.log(`Created a new room with id: ${currentRoomId}`)
            //Send room information to client to be shared
            let response = JSON.stringify({
              type: 'notification',
              content: {
                text: 'Room created successfully',
                id: currentRoomId
              }
            });
            client.send(response);
            currentRoomId++;
            break;

          case 'registration':
            msg.content['id'] = client.id;

            //CHECK IF ROOM IS VALID
            if(!checkRoomId(msg.content.roomPin)) {
              let response = JSON.stringify({
                type: 'error',
                content: {
                  text: "Room invalid."
                }
              });
              client.send(response);
              console.log(`Client id:${msg.content.id} name:${msg.content.name} submitted invalid roomPin:${msg.content.roomPin}`);
            } else {
              rooms[msg.content.roomPin].addClient(msg.content)
              console.log(`Added client id:${msg.content.id} name:${msg.content.name} to Room id:${msg.content.roomPin}`)
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

        let streamTargetRoom;
        for(let room in rooms) {
          if(room.getSpeaker == client.id) {
            streamTargetRoom = room;
          }
        }

        if(streamTargetRoom){
          streamTargetRoom.addTask(bufferComplete);
        } else {
          console.log(`Trying to stream to undefined room`);
        }

        console.log("audio stream ended...");
      }
    })
  })
});


