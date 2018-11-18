console.time('pipeline')

const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const {Translate} = require('@google-cloud/translate');
const textToSpeech = require('@google-cloud/text-to-speech');

// Creates clients
const transcriptionClient = new speech.SpeechClient();
const translate = new Translate();
const synthesisClient = new textToSpeech.TextToSpeechClient();


//  ***************************************
//  *     Transcription Audio Config      *
//  ***************************************

// The name of the audio file to transcribe
// const fileName = '../resources/speak.wav';
const fileName = './resources/maggieKorean.wav';

// Reads a local audio file and converts it to base64
const file = fs .readFileSync(fileName);
const audioBytes = file.toString('base64');


// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
  content: audioBytes,
};
const audioConfig = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'ko-KR',
};
const transcriptionRequest = {
  audio: audio,
  config: audioConfig,
};


//  ***************************************
//  *          Translate Config           *
//  ***************************************

const targetLanguage = 'en-US'.slice(0,2);


//  ***************************************
//  *          Synthesis Config           *
//  ***************************************

// Construct the request
const synthesisRequest = {
  input: {text: ''},
  // Select the language and SSML Voice Gender (optional)
  // voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
  voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
  // Select the type of audio encoding
  audioConfig: {audioEncoding: 'MP3'},
};

//  ***************************************
//  *       Speech 2 Speech Pipeline      *
//  ***************************************

console.time('transcription')
console.time('translation')
console.time('synthesis')

// DETECTS SPEECH IN AUDIO FILE AND GENERATES TRANSCRIPTION
transcriptionClient
  .recognize(transcriptionRequest)
  .then(data => {
    //end timing
    console.timeEnd('transcription')

    let response = data[0];
    // console.log("response:", response)

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);

    // TRANSLATE TRANSCRIPTION INTO TARGET LANGUAGE
    translate
      .translate(transcription, targetLanguage)
      .then(results => {
        //end timing
        console.timeEnd('translation')

        const translation = results[0];
        console.log(`Translation: ${translation}`);

        // Performs the Text-to-Speech request
        synthesisRequest.input.text = translation;
        synthesisClient.synthesizeSpeech(synthesisRequest, (err, response) => {
          if (err) {
            console.error('ERROR:', err);
            return;
          }
          //end timing
          console.timeEnd('synthesis')

          // Write the binary audio content to a local file
          fs.writeFile('./resources/output.mp3', response.audioContent, 'binary', err => {
            if (err) {
              console.error('ERROR:', err);
              return;
            }
            console.log('Audio content written to file: output.mp3');

            //end timing
            console.timeEnd('pipeline');
          });

        });

      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });












