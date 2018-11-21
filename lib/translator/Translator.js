const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const {Translate} = require('@google-cloud/translate');
const textToSpeech = require('@google-cloud/text-to-speech');


//=================TRANSCRIBER============================
class Transcriber {
  constructor(inputAudio,language){
    this.inputAudio = inputAudio;
    this.language = language;
    this.transcriptionClient = new speech.SpeechClient();

    // this.transcriptionRequest;
    this.transcriptionResult;
  }
}

Transcriber.prototype.transcribe = async function(transcriptionRequest) {
  let data = await this.transcriptionClient.recognize(transcriptionRequest);
  let response = data[0];
  const transcriptionResult = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcriptionResult;
}

Transcriber.prototype.makeTranscriptionRequest = function(buffer, inLanguage) {

   // Reads a local audio file and converts it to base64
   const audioBytes = buffer.toString('base64');

   // The audio file's encoding, sample rate in hertz, and BCP-47 language code
   const audio = {
     content: audioBytes,
   };
   const audioConfig = {
     encoding: 'LINEAR16',
     sampleRateHertz: 16000, //44100,
     languageCode: inLanguage,
   };
   const transcriptionRequest = {
     audio: audio,
     config: audioConfig,
   };

 return transcriptionRequest;
}

Transcriber.prototype.speech2Text = async function() {
  console.log('TRANSCRIPTION')
  // Save results to class property
  let transcriptionRequest = this.makeTranscriptionRequest(this.inputAudio, this.language);
  this.transcriptionResult = await this.transcribe(transcriptionRequest);

  console.log('Result:', this.transcriptionResult)
  return this.transcriptionResult
}

//================TRANSLATOR=============================

class Translator {
  constructor(inText, inLang, outLang){
    this.inText = inText
    this.inLang = inLang
    this.outLang = outLang

    // this.synthesisRequest

    this.translationResult
    this.synthesisResult

    this.translateClient = new Translate();
    this.synthesisClient = new textToSpeech.TextToSpeechClient();
  }
}

Translator.prototype.makeSynthesisRequest = function(inText, outLang){
  let synthesisRequest = {
    input: {text: inText},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: outLang, ssmlGender: 'NEUTRAL'},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  return synthesisRequest;
}

Translator.prototype.translate = async function(inText, outLang) {
  // Performs Text-to-Text translation request
  let results = await this.translateClient.translate(inText, outLang)
  let translatedText = results[0];
  return translatedText;
}

Translator.prototype.synthesize = async function(synthesisRequest) {
  // Performs the Text-to-Speech request
  let results = await this.synthesisClient.synthesizeSpeech(synthesisRequest)
  let synthesisResult = results[0].audioContent;
  return synthesisResult;
}

Translator.prototype.text2TransSpeech = async function(){
    //TRANSLATION
  console.log('TRANSLATION')
  const targetLanguage = this.outLang.slice(0,2);
  this.translationResult = await this.translate(this.inText, targetLanguage);
  console.log('Result:',this.translationResult)

  //SYNTHESIS
  console.log('SYNTHESIS')
  let synthesisRequest = this.makeSynthesisRequest(this.translationResult, this.outLang)
  this.synthesisResult = await this.synthesize(synthesisRequest);
  console.log('Request:', synthesisRequest)

  return 0;
}

module.exports = { Transcriber, Translator }
