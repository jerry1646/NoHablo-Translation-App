
const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const {Translate} = require('@google-cloud/translate');
const textToSpeech = require('@google-cloud/text-to-speech');


//  ***************************************
//  *     Transcription Audio Config      *
//  ***************************************

// The name of the audio file to transcribe
// const fileName = '../resources/speak.wav';
const fileName = './resources/maggieKorean.wav';

// Reads a local audio file and converts it to base64
const file = fs .readFileSync(fileName);
const audioBytes = file.toString('base64');


class Translator {

  constructor(inLang = 'ko-KR', outLang = 'en-US', bs) {
    this.inLang = inLang;
    this.outLang = outLang;
    this.bs = bs;

    // Creates clients
    this.transcriptionClient = new speech.SpeechClient();
    this.translate = new Translate();
    this.synthesisClient = new textToSpeech.TextToSpeechClient();

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    this.audio = {
      content: audioBytes,
    };
    this.audioConfig = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: this.inLang
    };
    this.transcriptionRequest = {
      audio: this.audio,
      config: this.audioConfig,
    };

    //  ***************************************
    //  *          Translate Config           *
    //  ***************************************

    this.targetLanguage = this.outLang.slice(0,2);


    //  ***************************************
    //  *          Synthesis Config           *
    //  ***************************************

    // Construct the request
    this.synthesisRequest = {
      input: {text: ''},
      // Select the language and SSML Voice Gender (optional)
      // voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
      voice: {languageCode: this.outLang, ssmlGender: 'NEUTRAL'},    //Hardcoded
      // Select the type of audio encoding
      audioConfig: {audioEncoding: 'LINEAR16'},
    };
  }


  //  ***************************************
  //  *       Speech 2 Speech Pipeline      *
  //  ***************************************
  speechToSpeech() {
    // DETECTS SPEECH IN AUDIO FILE AND GENERATES TRANSCRIPTION
    this.transcriptionClient
      .recognize(this.transcriptionRequest)
      .then(data => {

        let response = data[0];
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        // console.log(`Transcription: ${transcription}`);

        // TRANSLATE TRANSCRIPTION INTO TARGET LANGUAGE
        this.translate
          .translate(transcription, this.targetLanguage)
          .then(results => {

            const translation = results[0];
            // console.log(`Translation: ${translation}`);

            // PERFORMS THE TEXT-TO-SPEECH REQUEST
            this.synthesisRequest.input.text = translation;
            this.synthesisClient.synthesizeSpeech(this.synthesisRequest, (err, response) => {
              if (err) {
                console.error('ERROR:', err);
                return;
              }
              // Write the binary audio content to a local file
              fs.writeFile('./resources/output1.wav', response.audioContent, 'binary', err => {
                if (err) {
                  console.error('ERROR:', err);
                  return;
                }
                console.log('Audio content written to file: output.mp3');
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


  }

}