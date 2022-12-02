// WorkletChunks.js
// when adding new worklet dont forget to put in registerProcessor() at end of file
// when adding new worklet dont forget to put in registerProcessor() at end of file
// when adding new worklet dont forget to put in registerProcessor() at end of file

// in firefox, below not available for "workers" ???
// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
import { color, sndHelper, STOPNOW } from "./sndHelperA.js"; // fails for firefox
// maybe this makes it work on firefox?? https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts
// equivalent of *.html: "<script type="module">import { color } from "./sndHelperA.js"; </script>"

var timeBaseCount = 0;
var chunkCount = 0;
var isRunning = true;

var buffTimeSpan = 1;
var srcBuffLen = sndHelper.SAMPLEPERSEC * buffTimeSpan;
var lBuffr = new Float32Array(srcBuffLen);
var rBuffr = new Float32Array(srcBuffLen);
new sndHelper().fillBuffSineTest(lBuffr, rBuffr, 440);

class WorkletChunks extends AudioWorkletProcessor {
    constructor(jsonOptions) { 
      super(); 
      // below needs better AudioWorkletProcessor docs; took too long to figure out.
      var pizza = jsonOptions.processorOptions['pizza'];
      console.log(" new WorkletChunks ..pizza: " + pizza); // JSON.stringify(jsonOptions))
      // create-react-app react-audio-worklet
      // https://developers.google.com/web/updates/2018/06/audio-worklet-design-pattern
      // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode/port#examples
      // https://stackoverflow.com/questions/57583266/audioworklet-set-output-to-float32array-to-stream-live-audio
      this.port.onmessage = (e) => {
        if (e.data == STOPNOW) {
            isRunning = false;
        }
        console.log("got message: " + e.data)
        this.port.postMessage('pong')
      }
      this.port.start()
    }
    // emptyBufferCallback;
    // setEmptyBufferCallback(bb) {
    //   this.emptyBufferCallback = bb;
    //   console.log("this.setEmptyBufferCallback called")
    // }
    process (inputs, outputs, parameters) {
      var leftChan = outputs[0][0]; var rightChan = outputs[0][1] 
      // console.log("leftChan.length " + leftChan.length); return;
      var msg;
      var workBuffLen = leftChan.length; // 128 but specs can change
      chunkCount++
      for (let i = 0; i < workBuffLen; i++) {
          if (isRunning == false) return;
          var srcBuffIdx = i + workBuffLen * chunkCount;
          if (srcBuffIdx > srcBuffLen) { 
              chunkCount = 0; 
              srcBuffIdx = i + workBuffLen * chunkCount;
              //https://stackoverflow.com/questions/65717051/how-do-i-access-global-window-scope-from-inside-a-worklet-javascript-frontend
          }
          leftChan[i] = lBuffr[srcBuffIdx]
          rightChan[i] = rBuffr[srcBuffIdx]
      }
      return true
    }
  }


  // IT WORKLET NOT SETUP BELOW, IT IS INVISIBLE TO USERS OF THIS MODULE!!
  registerProcessor('WorkletChunks', WorkletChunks)
  // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope/registerProcessor
  // cannot do. Breaks the sound thing.....     export { STOPNOW2, today };

  /*
  You can also use a SharedArrayBuffer

Create the shared memory object in one module.

  const length = 100;
  const size = Int32Array.BYTES_PER_ELEMENT * length;
  this.sab = new SharedArrayBuffer(size);
  this.sharedArray = new Int32Array(this.sab);

Send it to AudioWorkletProcessor

  this.worker.port.postMessage({
      sab: this.sab
  });

In the AudioWorkletProcessor

this.port.onmessage = event => {
      this.sharedArray = new Int32Array(event.data.sab);
}
Now both modules share the same array (this.sharedArray).
*/
// workaround to import this: "const STOPNOW="stopnow";"
//  FIX: firefox in ubuntu cannot handle javascript import/export within
//       a Worklet. Chrome does it ok. This was temporary workaround.
//////////////sillyFixForInabilityToExportAConstantFromTheModule(); 
// function sillyFixForInabilityToExportAConstantFromTheModule() {
//     fetch("./WorkletChunks.js").then(response => response.text())
//     .then(theText => { return(theText.match(/.*STOPNOW="(.*)".*/)[1]); }) // /g at end BREAKS it
//     .then(theVal => { STOPNOW = theVal;});  } -->



  

  
 
  