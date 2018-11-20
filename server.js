const util = require('util')
const fs = require('fs');
// var FileReader = require('filereader') , fileReader = new FileReader()
//   ;

const express = require('express')
const app = express()

const BinaryServer = require('binaryjs').BinaryServer;

const translator = require('./lib/translator/test.js');


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


languageGroups = {};

//MANAGE CLIENT CONNECTIONS TO BINARY SERVER
binaryServer.on('connection', client => {
  console.log("binaryServer connection established");

  let audioBuffer = []

  client.on('stream', stream =>{
    stream.on('data', data => {
      audioBuffer.push(data)
    })

    stream.on('end', () => {
      let bufferComplete = Buffer.concat(audioBuffer);

      //CREATE FILENAME FOR REFERENCE
      let audioFilename = './myVoice.wav'

      fs.writeFile(audioFilename, bufferComplete, err => {
        if (err) {
          console.error('ERROR:', err);
          return;
        }
        console.log('Audio content written to file');

        //WHEN FILE IS WRITTEN WE CAN PROCESS IT
        console.log(translator)

        translator(audioFilename)
          .catch((err) => { console.log('ERROR:', err) })
          .then(data => {
            translator.done = true;
            translator.data = data;

            //CREATE FILENAME FOR REFERENCE
            let audioFilenameTranslated = './myVoiceTranslated.mp3'


            fs.writeFile(audioFilenameTranslated, data, 'binary', err => {
              if (err) {
                console.error('ERROR:', err);
                return;
              }
              console.log('Audio content written to file');

              let stream = fs.createReadStream(audioFilename);

              for(let id in binaryServer.clients) {
                if(binaryServer.clients.hasOwnProperty(id)) {
                  let otherClient = binaryServer.clients[id];
                  // // let send = otherClient.createStream(meta);
                  // let send = otherClient.createStream({data: 'audio'});
                  // stream.pipe(send);
                  otherClient.send(data)
                }
              }
            });
          });

      });
      console.log("audio stream ended...")
    })

  })

  // let stream = fs.createReadStream(file_path);

  // // LOOP OVER ALL CLIENTS AND BROADCAST TO ALL OTHER CLIENT (NOT THE STREAMING CLIENT)
  //   for(let id in binaryServer.clients) {
  //     if(binaryServer.clients.hasOwnProperty(id)) {
  //       let otherClient = binaryServer.clients[id];
  //       // let send = otherClient.createStream(meta);
  //       let send = otherClient.createStream({data: 'audio', cake: 'vanilla'});
  //       stream.pipe(send);
  //     }
  //   }

  //   stream.on('end', () => {
  //     console.log("audio stream ended.")
  //   });

});


