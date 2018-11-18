const fs = require('fs');

//
const express = require('express')
const app = express()

const BinaryServer = require('binaryjs').BinaryServer;

const file_name = 'output1.wav' //also output.mp3
const file_path = 'lib/translator/resources/' + file_name

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
binaryServer.on('connection', client => {
  console.log("binaryServer connection established");

  let stream = fs.createReadStream(file_path);

  // LOOP OVER ALL CLIENTS AND BROADCAST TO ALL OTHER CLIENT (NOT THE STREAMING CLIENT)
    for(let id in binaryServer.clients) {
      if(binaryServer.clients.hasOwnProperty(id)) {
        let otherClient = binaryServer.clients[id];
        // let send = otherClient.createStream(meta);
        let send = otherClient.createStream({data: 'audio', cake: 'vanilla'});
        stream.pipe(send);
      }
    }

    stream.on('end', () => {
      console.log("audio stream ended.")
    });

});