console.time('pipeline')

const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const {Translate} = require('@google-cloud/translate');
const textToSpeech = require('@google-cloud/text-to-speech');

//  ***************************************
//  *     Transcription Audio Config      *
//  ***************************************

function makeTranscriptionRequest(filename, inLanguage) {

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(filename);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const audioConfig = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: inLanguage,
  };
  const transcriptionRequest = {
    audio: audio,
    config: audioConfig,
  };

  return transcriptionRequest;

}


//  ***************************************
//  *          Synthesis Config           *
//  ***************************************
function makeSynthesisRequest(text, outLanguage) {

  const synthesisRequest = {
    input: {text: text},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: outLanguage, ssmlGender: 'NEUTRAL'},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  return synthesisRequest;

}


//Confidence for transcription exists
async function transcription(transcriptionRequest) {
  let data = await transcriptionClient.recognize(transcriptionRequest);
  let response = data[0];
  const transcriptionResult = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcriptionResult;
}

async function translation(transcription, targetLanguage) {
  let results = await translate.translate(transcription, targetLanguage)
  const translation = results[0];
  return translation;
}

async function synthesis(synthesisRequest) {
  // Performs the Text-to-Speech request
  synthesisRequest.input.text = translation;
  let results = await synthesisClient.synthesizeSpeech(synthesisRequest)
  return results[0].audioContent;
}


async function speech2Speech(filename, inLanguage = 'ko-KR', outLanguage = 'en-US') {

  //TRANSCRIPTION
  const transcriptionRequest = makeTranscriptionRequest(filename, inLanguage);
  const transcriptionResult = await transcription(transcriptionRequest);

  //TRANSLATION
  const targetLanguage = outLanguage.slice(0,2);
  const translationResult = await translation(transcriptionResult, targetLanguage);

  //SYNTHESIS
  const synthesisRequest = makeSynthesisRequest(translationResult, outLanguage)
  let synthesisResult = await synthesis(synthesisRequest);

  return synthesisResult;

}

module.exports speech2Speech

// The name of the audio file to transcribe
// // const fileName = '../resources/speak.wav';
// const fileName = './resources/maggieKorean.wav';

// let array;

// let S2SPromise = speech2Speech;
// S2SPromise(fileName)
//   .catch(() => {})
//   .then(data => {
//     S2SPromise.done = true;
//     S2SPromise.data = data;
//   });

// console.log("Should be not done", S2SPromise.done)


// setInterval( () => {console.log("Should be done", S2SPromise.data)}, 1000)














