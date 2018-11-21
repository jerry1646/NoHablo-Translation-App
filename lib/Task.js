const {Transcriber, Translator} = require('./translator/Translator.js')
const fs = require('fs');

class Task {
  constructor(inputAudio, inLang, outLangs, roomId){
    this.inputAudio = inputAudio;
    this.roomId = roomId;
    this.inLang = inLang;
    this.outLangs = outLangs;
    this.transcription;

    this.done = false;

    this.transcriber;
    this.translators = [];
    this.translatorHash = {};
  }


}

Task.prototype.transcribe = async function() {
  this.transcriber = new Transcriber(this.inputAudio, this.inLang)
  this.transcription = await this.transcriber.speech2Text();
}



Task.prototype.execute = async function() {
  await this.transcribe();

  for(let language of this.outLangs) {
   this.translators.push(new Translator(this.transcription, this.inLang, language).text2TransSpeech())
  }

  Promise.all(this.translators).then( values => {
    console.log("in the promised land")
    this.done = true;
  });

  outLangs.forEach( (language, idx) => {
    this.translatorHash[language] = translators[idx];
  });
}

module.exports = { Task }


// const file = fs.readFileSync('lib/translator/resources/maggieKorean.wav');
// let T = new Task(file, 'ko-KR', ['en-US', 'fr-FR'], 1);
// T.execute();

// setInterval( () => {console.log("Should be done eventually..", T.done)}, 1000)






