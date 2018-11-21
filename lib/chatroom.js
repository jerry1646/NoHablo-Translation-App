const Task = require('./Task.js')

module.exports = class Chatroom {
  constructor(id, speaker, inLang, bsClients) {
    this.id = id;
    this.speaker = speaker;
    this.inLang = inLang;
    this.clientSockets = bsClients;

    this.taskBuffer = [];
    this.clients = {};
    this.outLangs = [];

    this.active = false;
  }

  getSpeaker() {
    return this.speaker;
  }

  getRoomId() {
    return this.id;
  }

  addClient(client) {
    this.clients[client.id] = client;
    if(!this.outLangs.includes(client.language)) {
      this.outLangs.push(client.language)
    }
  }

  //Add message into the chatroom to be sent to clients
  addTask(inputAudio) {
    this.taskBuffer.push( new Task(inputAudio, this.inLang, this.outLangs, this.id).execute() )

    if(!this.active) {
      this.active = true;
      this.process()
    }

  }

  process() {
    while(this.active) {
      if(this.taskBuffer.length) {
        if(this.taskBuffer[0].done) {
          //loop over clients and send translation in correct language
          for(let client in this.clients) {
            if(clientSockets.hasOwnProperty(client.id)) {
              clientSocket = clientSockets[client.id];
              clientSocket.send(this.taskBuffer[0].translatorHash[clients[client.id].language].synthesisResult);
            }
          }
          //remove task since it is done
          this.taskBuffer.shift();
        } else {
          continue
        }
      } else {
        this.active = false;
      }
    }
  }
}