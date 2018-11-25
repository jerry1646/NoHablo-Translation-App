import React, {Component} from 'react';

class AudioPlayer extends Component {

  constructor(){
    super()
  }

  componentDidMount(){
    console.log("Mounted audio player.");

    var audioContext = window.AudioContext || window.webkitAudioContext;
    var soundController = {};
    soundController.speakerContext = new audioContext();

    var audioCache = [];

    this.props.ws.on('stream', stream => {
      soundController.nextTime = 0;
      var init = false;

      console.log("receiving data stream")


      //HANDLE INCOMING DATA
      stream.on('data', data => {
        console.log(`Audio player received data: ${data}`)
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

      //HANDLE STREAM CLOSING
      stream.on('end', () => {
        console.log('end of data stream...')
      });

    });

    soundController.playCache = cache => {
      while(cache.length) {
        console.log(`Cache length: ${cache.length}`)
        let buffer = cache.shift();
        let source = soundController.speakerContext.createBufferSource();
        source.buffer = buffer;
        source.connect(soundController.speakerContext.destination);

        if(soundController.nextTime == 0) {
          soundController.nextTime = soundController.speakerContext.currentTime + 0.07;
        }

        source.start(soundController.nextTime);
        soundController.nextTime += source.buffer.duration;
        console.log(`Duration: ${source.buffer.duration}`)
        console.log(`Next time: ${soundController.nextTime}`)
      }
    }

  }

  render(){
    return (
      <div>
      </div>
    )
  }

}

export default AudioPlayer