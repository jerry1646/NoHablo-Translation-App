import React, {Component} from 'react';
// import {startRecording, stopRecording} from './helper.js'
// import recorder from './recorder.js'

class Audio extends Component {

  constructor(){
    super();
    this.state={
      RecordedAudio: new Blob([], { type: 'audio/wav' })
    }

    /*helper variables*/
    this.gumStream; //stream from getUserMedia()
    this.rec; //Recorder.js object
    this.input; //MediaStreamAudioSourceNode we'll be recording
    // shim for AudioContext when it's not avb.
    this.AudioContext;
    this.audioContext; //new audio context to help us record
    // this.startRecording = this.startRecording.bind(this);
    // this.stopRecording = this.stopRecording.bind(this);
    // this.getWavAudio = this.getWavAudio.bind(this);

  }

  componentDidMount(){
    this.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext; //new audio context to help us recordß
    // this.audioContext.sampleRate = 16000;
  }




  render(){
    return (
      <div>
        <div id="viz">
          <canvas id="analyser" width="256" height="125"></canvas>
        </div>
        <button onClick= {this.startRecording} id="recordButton">Record</button>
        <button onClick= {this.stopRecording} id="stopButton" >Stop</button>
      </div>
    )
  }

  startRecording = ()=>{
    console.log("recordButton clicked in Audio file");

    var constraints = { audio: true, video:false }

    recordButton.disabled = true;
    stopButton.disabled = false;

    navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /* assign to gumStream for later use */
        this.gumStream = stream;
         // use the stream
        this.input = this.audioContext.createMediaStreamSource(stream);
        //numChannels:1 mono recording
        this.rec = new Recorder(this.input,{numChannels:1})
        //start the recording process
        this.rec.record()
        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        console.log(err);
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
  }

  stopRecording = ()=> {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;

    //tell the recorder to stop the recording
    this.rec.stop();

    //stop microphone access
    this.gumStream.getAudioTracks()[0].stop();

    //create the wav blob and save blob data to RecordAudio
    this.rec.exportWAV(this.getWavAudio)

    /*
        create the client socket and send RecordedAudio to server
        and
        after successfully send, active  start button
    */
    // var host = 'ws://localhost:5000/binary-endpoint';
    // var client = new BinaryClient(host);
    // console.log(this.RecordedAudio);
    // setTimeout(function(){ client.send(this.RecordedAudio); }, 3000);

  }
// call back function for exportWAV method in recorder.js
  getWavAudio=(blob)=>{
    this.RecordedAudio = blob;
    console.log(blob);
    console.log(this.RecordedAudio);
    var host = 'ws://localhost:5000/binary-endpoint';
    var client = new BinaryClient(host);
    setTimeout(()=>{
    // let stream = client.createStream();
    // client.send(this.RecordedAudio); }, 3000);
      client.send(this.RecordedAudio);
      console.log(this.RecordedAudio);
    }, 3000);


  }
}

export default Audio


/*                      TO DO: add audio analyser display


https://stackoverflow.com/questions/46302362/record-audio-from-browser-and-visualize-in-real-time


*/
