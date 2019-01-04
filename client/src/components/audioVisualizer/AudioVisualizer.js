import React, {Component} from 'react';


class AudioVisualizer extends Component {
  constructor(){
    super();

    this.audioContext = this.props.audioContext

    this.meter = null;
    this.canvasContext = null;
    this.WIDTH=500;
    this.HEIGHT=50;
    this.rafID = null;
  }

  componentDidMount() {
  }

  render(){
    return (
      <div>
        <canvas id="meter" width="600" height="40"></canvas>
      </div>
    )
  }

  // Helper functions

  createAudioMeter = (audioContext,clipLevel,averaging,clipLag)=>{
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

  gotStream = stream => {

    // Create a new volume meter and connect it.
    this.meter = this.createAudioMeter(this.audioContext);
    this.input.connect(this.meter);

    // kick off the visual updating
    this.drawLoop();
  }

  volumeAudioProcess = event =>{
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


  drawLoop = time =>{

    // clear the background

    this.canvasContext = meter.getContext("2d"); //'meter' refers to canvas component with id 'meter'
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

export default AudioVisualizer
