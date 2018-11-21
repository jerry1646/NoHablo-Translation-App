class chatroom {
  constructor(id, speaker, inLang, bsClients) {
    this.id = id;
    this.speaker = speaker;
    this.taskBuffer = [];
    this.clients = {};
    this.inLang = inLang;

    this.active = true;
    this.clientSockets = bsClients;
  }

  addClient(client) {
    this.clients[client.id] = client;
  }

  //Add message into the chatroom to be sent to clients
  addTask(inputAudio, outLangs) {
    this.taskBuffer.push( new Task(inputAudio, this.inLang, outLangs, this.id).execute() )

    this.active = true;
  }

  execute() {
    while(this.active) {
      if(this.taskBuffer.length) {
        if(this.taskBuffer[0].done) {

          //loop over clients and send translation in correct language
          for(let client in this.clients) {
            if(clientSockets.hasOwnProperty(client.id) {
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