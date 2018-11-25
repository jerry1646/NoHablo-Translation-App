import React, {Component} from 'react';

class Audio extends Component {

  constructor(){
    super();
    this.state={
      RecordedAudio: new Blob([], { type: 'audio/wav' }),
      infoActive: false
    }

   /*************************
      Audio Record Variables
    **************************/
    this.gumStream; //stream from getUserMedia()
    this.rec; //Recorder.js object
    this.input; //MediaStreamAudioSourceNode we'll be recording
    this.AudioContext;
    this.audioContext; //new audio context to help us record



    /*************************
      Audio Display Variables
    **************************/
    this.meter = null;
    this.canvasContext = null;
    this.WIDTH=500;
    this.HEIGHT=50;
    this.rafID = null;
    this.createAudioMeter = this.createAudioMeter.bind(this)
    this.volumeAudioProcess = this.volumeAudioProcess.bind(this)
  }

  componentDidMount() {
    this.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext; //new audio context to help us recordß
  }

  render(){
    return (
      <div>
        <div id='speaker-visualizer'>
          <canvas id="meter" width="600" height="40"></canvas>
        </div>
        <div className='bottom-bar'>
          <div className='side-buttons' id='room-info' onClick={this.toggleInfo}>
            <i className="material-icons">
            info
            </i>
          </div>
          <div className='speaker-button record' onClick= {this.startRecording} id="recordButton">
            <span><i className="material-icons">
            record_voice_over
            </i></span>
          </div>
          <div className='speaker-button stop' onClick= {this.stopRecording} id="stopButton">
            <span><i className="material-icons">
            stop
            </i></span>
          </div>
          <div className='side-buttons'>
          </div>
        </div>
      </div>
    )
  }


  //Private functions

  toggleInfo = (e) => {
    let currentState = this.state.active
    this.props.methods.toggleInfo();
    this.setState({
      infoActive: !currentState
    })
  }

  startRecording = () => {
    console.log("recordButton clicked in Audio file");


    recordButton.disabled = true;
    stopButton.disabled = false;

    var displayConstraints = {
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
          },
        "optional": []
      }
    }

    navigator.mediaDevices
      .getUserMedia(displayConstraints)
      .then((stream) => {
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
        //***********************
        //    For Display Audio
        //***********************
        this.gotStream(stream);
      })
      .catch(function(err) {
        //enable the record button if getUserMedia() fails
        console.log(err);
        recordButton.disabled = false;
        stopButton.disabled = true;
      });
  }




  stopRecording = () => {
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
  }


  // call back function for exportWAV method in recorder.js
  getWavAudio = blob => {
    this.RecordedAudio = blob;
    console.log(blob);
    console.log(this.RecordedAudio);
    this.props.ws.send(this.RecordedAudio);
  }

  createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
    var processor = audioContext.createScriptProcessor(512);
    processor.onaudioprocess = this.volumeAudioProcess;
    processor.clipping = false;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel || 0.98;
    processor.averaging = averaging || 0.95;
    processor.clipLag = clipLag || 750;

    // this will have no effect, since we don't copy the input to the output,
    // but works around a current Chrome bug.
    processor.connect(audioContext.destination);

    processor.checkClipping = function() {
      if (!this.clipping)
        return false;
      if ((this.lastClip + this.clipLag) < window.performance.now())
        this.clipping = false;
      return this.clipping;
    }

    processor.shutdown = function() {
      this.disconnect();
      this.onaudioprocess = null;
    };

    return processor;
  }

  volumeAudioProcess( event ) {
    var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
    var sum = 0;
    var x;

    // Do a root-mean-square on the samples: sum up the squares...
    for(var i=0; i<bufLength; i++) {
      x = buf[i];
      if(Math.abs(x) >= this.meter.clipLevel) {
        this.meter.clipping = true;
        this.meter.lastClip = window.performance.now();
      }
      sum += x * x;
    }

    // ... then take the square root of the sum.
    var rms = Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.meter.volume = Math.max(rms, this.meter.volume*this.meter.averaging);
  }


  gotStream = stream => {
    // Create an AudioNode from the stream.
    // mediaStreamSource = this.audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    this.meter = this.createAudioMeter(this.audioContext);
    this.input.connect(this.meter);

    // kick off the visual updating
    this.drawLoop();
  }

  drawLoop = time =>{

    // clear the background
    this.canvasContext = meter.getContext("2d");
    this.canvasContext.clearRect(0,0,this.WIDTH,this.HEIGHT);

    // check if we're currently clipping
    if (this.meter.checkClipping()) {
        this.canvasContext.fillStyle = "red";
    } else {
      this.canvasContext.fillStyle = "green";
    }

    // draw a bar based on the current volume
    this.canvasContext.fillRect(0, 0, this.meter.volume * this.WIDTH * 1.4, this.HEIGHT);
    // set up the next visual callback
    this.rafID = window.requestAnimationFrame(this.drawLoop);
  }
}

export default Audio


/*                      TO DO: add audio analyser display


https://stackoverflow.com/questions/46302362/record-audio-from-browser-and-visualize-in-real-time


*/
