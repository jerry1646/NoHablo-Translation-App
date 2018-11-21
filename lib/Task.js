class Task {
  constructor(inputAudio,inLang,outLangs,roomId){
    this.inputAudio = inputAudio;
    this.roomId = roomId;
    this.inLang = inLang;
    this.outLangs = outLangs;

    this.transcriber;
    this.translators = [];
  }


}

Task.prototype.initialize(){
  this.transcriber = new Transcriber(this.inputAudio, this.inLang)
}

