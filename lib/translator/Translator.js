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
  // console.log('This.transcribe had been called!')
  // console.log(transcriptionRequest.audio.content)
  let data;
  try {
    // console.log("try-ing to make api call for transciption")
    data = await this.transcriptionClient.recognize(transcriptionRequest);
    // console.log("data?",data)
  } catch(e) {
    console.log("Transcriber API error:", e)
    // throw(e)
  }
  // console.log("got data from google-cloud!", data[0])
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
     sampleRateHertz: 44100,
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
  // console.log(`Transcription Request = \n ${transcriptionRequest.audio.content} \n ${transcriptionRequest.config.languageCode} \n ${transcriptionRequest.config.sampleRateHertz} \n ${transcriptionRequest.config.encoding}`)

  try {
    // console.log("try-ing to get a transciption result")
    this.transcriptionResult = await this.transcribe(transcriptionRequest);
  } catch(e) {
    console.log("Transcriber error:",e)
  }


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
  let results;
  try {
    results = await this.translateClient.translate(inText, outLang)
  } catch(e) {
    console.log("Translate API error:",e)
    throw(e)
  }
  let translatedText = results[0];
  return translatedText;
}

Translator.prototype.synthesize = async function(synthesisRequest) {
  // Performs the Text-to-Speech request
  let results;
  try {
    results = await this.synthesisClient.synthesizeSpeech(synthesisRequest)
  } catch(e) {
    console.log("Synthesizer API error:",e)
    throw(e)
  }
  let synthesisResult = results[0].audioContent;
  return synthesisResult;
}

Translator.prototype.text2TransSpeech = async function(){
    //TRANSLATION
  console.log('TRANSLATION')
  const targetLanguage = this.outLang.slice(0,2);
  try {
    this.translationResult = await this.translate(this.inText, targetLanguage);
  } catch(e) {
    console.log("Translation error:",e)
  }

  console.log('Result:',this.translationResult)

  //SYNTHESIS
  console.log('SYNTHESIS')
  let synthesisRequest = this.makeSynthesisRequest(this.translationResult, this.outLang)
  console.log('Request:', synthesisRequest)
  try {
    this.synthesisResult = await this.synthesize(synthesisRequest);
  } catch(e) {
    console.log("Synthesizer error:",e)
  }


  return 0;
}

module.exports = { Transcriber, Translator }
