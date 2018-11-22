const { Transcriber, Translator } = require('./translator/Translator.js')
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
    this.translatorPromises = []
    this.translatorHash = {};
  }
}

Task.prototype.transcribe = async function() {
  this.transcriber = new Transcriber(this.inputAudio, this.inLang)
  try{
    this.transcription = await this.transcriber.speech2Text();
  } catch(e) {
    console.log("Error in Task transcriber:", e);
    throw(e);
  }
}



Task.prototype.execute = async function() {
  try{
    await this.transcribe();
  } catch(e) {
    console.log("couldnt execute task - transcriber error:", e);
  }

  for(let language of this.outLangs) {
    let translator = new Translator(this.transcription, this.inLang, language)
    this.translatorPromises.push(translator.text2TransSpeech())
    this.translators.push(translator)
  }

  Promise.all(this.translatorPromises)
    .catch(error => {
      console.log("Promises Broken:", error);
      throw(error);
    })
    .then(values => {
      console.log("values:", values)
      this.done = true;
    });

  this.outLangs.forEach( (language, idx) => {
    this.translatorHash[language] = this.translators[idx];
  });
}

module.exports = Task

// const file = fs.readFileSync('lib/translator/resources/maggieKorean.wav');
// let T = new Task(file, 'ko-KR', ['en-US', 'fr-FR'], 1);
// console.log('done should be false:', T.done)
// T.execute();

// setInterval( () => {console.log("Should be done eventually..", T.done)}, 1000)






