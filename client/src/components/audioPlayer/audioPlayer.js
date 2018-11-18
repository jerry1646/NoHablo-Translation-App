import React, {Component} from 'react';

var host = 'ws:localhost:5000/binary-endpoint';

class AudioPlayer extends Component {
  constructor(){
    super()
    this.state = {
      users: []
    }
  }

  componentDidMount(){
    console.log("fetching data..");

    var audioContext = window.AudioContext || window.webkitAudioContext;

    var client = new BinaryClient(host);
    var soundController = {};
    soundController.speakerContext = new audioContext();

    client.on('stream', stream => {
      soundController.nextTime = 0;
      var init = false;
      var audioCache = [];

      console.log("receiving audio stream")


      //HANDLE INCOMING DATA
      stream.on('data', data => {

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

      });

      //HANDLE STREAM CLOSING
      stream.on('end', () => {
        console.log('end of audio stream...')
      });

    });

    soundController.playCache = function(cache) {
      while(cache.length) {
        var buffer = cache.shift();
        var source = soundController.speakerContext.createBufferSource();
        source.buffer = buffer;
        source.connect(soundController.speakerContext.destination);

        if(soundController.nextTime == 0) {
          soundController.nextTime = soundController.speakerContext.currentTime + 0.05;
        }

        source.start(soundController.nextTime);
        soundController.nextTime += source.buffer.duration;
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