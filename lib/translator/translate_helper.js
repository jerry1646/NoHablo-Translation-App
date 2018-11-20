const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const {Translate} = require('@google-cloud/translate');
const textToSpeech = require('@google-cloud/text-to-speech');



// Creates clients
    this.transcriptionClient = new speech.SpeechClient();
    this.translate = new Translate();
    this.synthesisClient = new textToSpeech.TextToSpeechClient();




class transcriber {
  constructor(){
    this.audioBuffer = [];
    this.transcribing = false;
  }

  addFile(filename) {
    this.audioBuffer.push(filename);

    if(!this.transcribing) {
      this.transcribing = true;
      this.init();
    }
  }

  init() {
    while(!this.audioBuffer.length) {

    }
    this.transcribing = false
  }

}