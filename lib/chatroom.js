const Task = require('./Task.js')
const uuidv4 = require('uuid/v4')


module.exports = class Chatroom {
  constructor(id, roomName, speaker, inLang, bsClients) {
    this.id = id;
    this.roomName = roomName;
    this.speaker = speaker;
    this.inLang = inLang;
    this.clientSockets = bsClients;

    this.taskBuffer = [];
    this.clients = {};
    this.outLangs = [];

    this.active = false;

    this.processInterval;
    this.processTasks = this.processTasks.bind(this)
    this.killInterval = this.killInterval.bind(this)
  }

  getSpeaker() {
    return this.speaker;
  }

  getRoomId() {
    return this.id;
  }

  getRoomName() {
    return this.roomName;
  }

  getClients() {
    return this.clients;
  }

  hasClient(clientId) {
    return this.clients.hasOwnProperty(clientId);
  }

  removeClient(clientId) {
    try{
      delete this.clients[clientId];
    } catch (e) {
      console.log("Could not delete client:",clientId);
    }

  }

  addClient(client) {
    this.clients[client.id] = client;
    if(!this.outLangs.includes(client.language)) {
      this.outLangs.push(client.language)
    }
  }

  broadcastMessage(msg) {
    console.log(`Speaker id: ${this.speaker}`)
    for(let id in this.clients) {
      console.log(id);
      let clientSocket = this.clientSockets[id];
      clientSocket.send(JSON.stringify(msg))
      }
  }

  //Add message into the chatroom to be sent to clients
  addTask(inputAudio) {
    console.log(inputAudio)

    let T = new Task(inputAudio, this.inLang, this.outLangs, this.id)
    T.execute()
    this.taskBuffer.push(T)

    this.processInterval = setInterval(this.processTasks, 200)
  }

  killInterval() {
    clearInterval(this.processInterval);
  }


  processTasks() {
    if(this.taskBuffer.length) {

      if(this.taskBuffer[0].done) {
        //loop over clients and send translation in correct language
        for(let id in this.clients) {

          //JUST TO TEST SOCKET
          this.clientSockets[id].send('this is a test')

          console.log(`Processing tasks for client with language: ${this.clients[id].language}`)
          console.log(`clientSockets: ${Object.keys(this.clientSockets)[1]}`)

          if(this.clientSockets.hasOwnProperty(id)) {
            console.log(`client socket has own property: ${this.clients[id].name}`)
            let clientSocket = this.clientSockets[id];
            console.log(`tanslator instance: ${this.taskBuffer[0].translatorHash[this.clients[id].language]}`)
            let textMessage = {
              type: 'message', //?
              content:{
                id: uuidv4(),
                inText: this.taskBuffer[0].translatorHash[this.clients[id].language].inText,
                resultText: this.taskBuffer[0].translatorHash[this.clients[id].language].translationResult
              }
            }
            console.log(JSON.stringify(textMessage))
            // console.log('TRYING TO SEND TO CLIENT, SOCKET IS:',clientSocket)
            // console.log('SOCKET.SEND SHOULD BE A FUNCTION:', clientSocket.send)
            clientSocket.send(JSON.stringify(textMessage))

            let send = clientSocket.createStream({content: 'audio'});
            send.write(this.taskBuffer[0].translatorHash[this.clients[id].language].synthesisResult)
          }
        }

        // Send transcription to speaker
        let textMessage = {
          type: 'message', //?
          content:{
            id: uuidv4(),
            inText: this.taskBuffer[0].translatorHash[this.inLang].inText,
            resultText: ""
          }
        }

        this.clientSockets[this.speaker].send(JSON.stringify(textMessage))





        //remove task since it is done
        this.taskBuffer.shift();
        console.log(`shifted the array - length ${this.taskBuffer.length}`)

      }
    } else {
      this.killInterval();
    }
  }

}