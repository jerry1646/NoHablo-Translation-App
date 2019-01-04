
//Create simple express server
const express = require('express')
const app = express()

//Binary server = abstraction layer on top of socket.io to facilitate sending/receiving binary data.
const BinaryServer = require('binaryjs').BinaryServer;

//IMPORT CHATROOM CLASS
const Chatroom = require('./lib/Chatroom.js');

const port = 5000

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

//BINARY SERVER INITIALIZATION
const binaryServer = new BinaryServer({server: server, path: '/binary-endpoint'});

//MANAGE CLIENT CONNECTIONS TO BINARY SERVER
rooms = {};

function checkRoomId(roomId) {
 return rooms.hasOwnProperty(roomId);
}

currentRoomId = 0;

binaryServer.on('connection', client => {
  console.log(`BinaryServer connection established: ${client.id}`);

  client.on('stream', stream =>{

    let audioBuffer = []

    //PROCESS RECEPTION OF STREAM DATA AS EITHER AUDIO BUFFERS OR STRING MESSAGES
    stream.on('data', data => {

      if(Buffer.isBuffer(data)){
        console.log(`Received stream from client: ${client.id}`);

        audioBuffer.push(data)

      } else {
        console.log(`Received msg from client: ${client.id}`);
        let msg = JSON.parse(data);

        switch(msg.type) {

          case 'create-room':
            rooms[currentRoomId] = new Chatroom(currentRoomId, msg.content.name, client.id, msg.content.language, binaryServer.clients);
            console.log(`Created a new room with id: ${currentRoomId}`)

            //Send room information to client to be shared
            let response = JSON.stringify({
              type: 'notification',
              content: {
                text: 'success',
                name: msg.content.name,
                id: currentRoomId,
                language: msg.content.language
              }
            });
            client.send(response);
            currentRoomId++;
            break;

          case 'registration':
            msg.content['id'] = client.id;

            //CHECK IF ROOM IS VALID
            if(!checkRoomId(msg.content.roomId)) {

              let response = JSON.stringify({
                type: 'notification',
                content: {
                  text: "error",
                  info: 'Invalid Room Pin'
                }
              });
              client.send(response);
              console.log(`Client id:${msg.content.id} name:${msg.content.name} submitted invalid roomId:${msg.content.roomId}`);

            } else {

              rooms[msg.content.roomId].addClient(msg.content)
              let response = JSON.stringify({
                type: 'notification',
                content: {
                  text: "success",
                  name: rooms[msg.content.roomId].getRoomName(),
                  id: msg.content.roomId,
                  language: msg.content.language
                }
              });
              client.send(response);
              console.log(`Added client id:${msg.content.id} name:${msg.content.name} to Room id:${msg.content.roomId}`)
            }
            break;
          case 'message':
            console.log("I got a message but I don't know what to do with it!");
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

        for(let roomId in rooms) {
          if(rooms[roomId].getSpeaker() === client.id) {
            streamTargetRoom = rooms[roomId];
          }
        }

        if(streamTargetRoom){
          streamTargetRoom.addTask(bufferComplete);
        } else {
          console.log(`Trying to stream to undefined room`);
        }
      }
    });

  });

  client.on('close', () => {
    console.log(`${client.id} disconnected.`)
    for(let id in rooms){
      if (rooms[id].hasClient(client.id)) {
        rooms[id].removeClient(client.id);
      }
      if(rooms[id].getSpeaker() === client.id) {
        console.log(`Room Id: ${id} has shut down.`)
        let msg = {
          type: 'notification',
          content: {
            text: 'room-closed',
            info: 'Speaker has left the room'
          }
        }
        rooms[id].broadcastMessage(msg);

        //WAIT FOR 10 SECONDS TO ENSURE ROOM-CLOSING MESSAGE IS SENT OUT
        setTimeout(() => {delete rooms[id]}, 10000);
      }
    }
  });

});


