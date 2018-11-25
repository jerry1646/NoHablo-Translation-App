import React, {Component} from 'react';
import AnimatedLoader from '../animatedLoader/AnimatedLoader.js'

class AudioPlayer extends Component {

  constructor(){
    super()

    this.state={
      infoActive:false,
      showSVG: false
    }
  }

  componentDidMount(){
    console.log("Mounted audio player.");

    var audioContext = window.AudioContext || window.webkitAudioContext;
    var soundController = {};
    soundController.speakerContext = new audioContext();

    this.props.ws.on('stream', stream => {
      soundController.nextTime = 0;
      var init = false;
      var audioCache = [];

      console.log("receiving data stream")

      this.showSVG();

      //HANDLE INCOMING DATA
      stream.on('data', data => {

        console.log(`Audio player received data: ${data}`)
        if (data && data.byteLength){
          var byteArray = data;

          var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          audioCtx.decodeAudioData(data, buffer => {


            console.log("adding buffer to audioCache")
            audioCache.push(buffer);

            if((init === true) || ((init === false) && (audioCache.length > 0))) {
              init = true;
              console.log("attempting to play audio cache")
              soundController.playCache(audioCache);
            }
          });

            // var source = audioCtx.createBufferSource();
            // source.buffer = buffer;
            // source.connect(audioCtx.destination);
            // source.start();

        } else{
          console.log('Did not receive binary audio data')
        }

      });


      //HANDLE STREAM CLOSING
      stream.on('end', () => {
        console.log('end of data stream...')
      });

    });

    soundController.playCache = cache => {
      let totalTime = 0;
      while(cache.length) {
        let buffer = cache.shift();
        let source = soundController.speakerContext.createBufferSource();
        source.buffer = buffer;
        source.connect(soundController.speakerContext.destination);
        totalTime += source.buffer.duration
        if(soundController.nextTime == 0) {
          soundController.nextTime = soundController.speakerContext.currentTime + 0.05;
        }

        source.start(soundController.nextTime);
        soundController.nextTime += source.buffer.duration;
      }
      console.log(totalTime)
      setTimeout(()=>{this.hideSVG()}, totalTime*1000);
    }

  }

  render(){
    return (
      <div>
        <div className='animated-svg' id='listener-visualizer'>
        {this.state.showSVG &&
        (
          <div>
            <AnimatedLoader/>
          </div>
        )}
        </div>
        <div className='bottom-bar'>
          <div className='side-buttons'>
          </div>
          <div className='side-buttons'>
            <div className={this.state.active?'active-info side-button':'side-button'} id='room-info' onClick={this.toggleInfo}>i</div>
          </div>
        </div>
      </div>
    )
  }

  toggleInfo = (e) => {
    let currentState = this.state.active
    this.props.methods.toggleInfo();
    this.setState({
      infoActive: !currentState
    })
  }

  showSVG = () => {
    console.log('changing state to true')
    this.setState({
      showSVG: true
    })
  }

  hideSVG = () => {
    this.setState({
      showSVG: false
    })
  }


}

export default AudioPlayer