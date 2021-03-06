import React, {Component} from 'react';
import AnimatedLoader from '../animatedLoader/AnimatedLoader.js'
import {CSSTransition} from "react-transition-group";

class AudioPlayer extends Component {

  constructor(){
    super()

    this.state={
      infoActive:false,
      showSVG: false
    }
  }

  componentDidMount(){

    //Initiate and configure browser audio player

    var audioContext = window.AudioContext || window.webkitAudioContext;
    var soundController = {};
    var audioCache = [];

    soundController.speakerContext = new audioContext();

    //Websocket listener

    this.props.ws.on('stream', stream => {
      soundController.nextTime = 0;
      var init = false;

      console.log("receiving data stream")

      this.showSVG();

      stream.on('data', data => {
        //Only responsible for binary audio data
        if (data && data.byteLength){
          var byteArray = data;

          soundController.speakerContext.decodeAudioData(data, buffer => {

            console.log("adding buffer to audioCache")
            audioCache.push(buffer);

            if((init === true) || ((init === false) && (audioCache.length > 0))) {
              init = true;
              console.log("attempting to play audio cache")
              soundController.playCache(audioCache);
            }
          });

        } else{
          console.log('Did not receive binary audio data')
        }

      });


      stream.on('end', () => {
        console.log('end of data stream...')
      });

    });

    //Web audio player method
    soundController.playCache = cache => {
      let totalTime = 0;
      while(cache.length) {
        let buffer = cache.shift();
        let source = soundController.speakerContext.createBufferSource();
        source.buffer = buffer;
        source.connect(soundController.speakerContext.destination);
        totalTime += source.buffer.duration
        if(soundController.nextTime == 0) {
          soundController.nextTime = soundController.speakerContext.currentTime + 0.07;
        }

        source.start(soundController.nextTime);
        soundController.nextTime += source.buffer.duration;
      }

      //Show animation in the duration of audio play
      setTimeout(()=>{this.hideSVG()}, totalTime*1000);
    }

  }

  render(){
    return (
      <div>

        <div className='animated-svg' id='listener-visualizer'>
        {this.state.showSVG &&
        ( <CSSTransition
            in={this.state.showSVG}
            appear={false}
            timeout={800}
            classNames="fade"
          >
            <div>
              <AnimatedLoader/>
            </div>
          </CSSTransition>
        )}
        </div>

        <div className='bottom-bar'>
          <div className='side-buttons'>
          </div>
          <div className='side-buttons' id='room-info' onClick={this.toggleInfo}>
            <i className="material-icons">
            info
            </i>
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