// june27
// WorkletChunks.js
/** **** WARNING **** 
   ****    because this class is loaded by the web audio framework, syntax errors in 
   ****    this file don't get shown in the javascript console!
   ****    instead they show up as "Uncaught (in promise) SyntaxError: Unexpected token '{'" 
   ****    and the console references the CALLING file, NOT THIS FILE!
   **** WARNING ****  

   when adding new worklet dont forget to put in registerProcessor() at end of file
   WARNING: delete .eslintcache if weird errors occur describing syntax errors!
*/
// NOTE: this file is not under react.js control [in /public, not /src] because its for the web audio API.
// because of this, the import of sndHelperA.js is under /public too, and is a duplicate of same file under /src
// I tried using a symbolic link but it fails; the file must be copied.
import { color, sndHelper, STOPNOW, STARTNOW } from "./sndHelperA.js"; // ok chrome, but import fails for firefox because this is an audio worklet
// equivalent of *.html: "<script type="module">import { color } from "./sndHelperA.js"; </script>"

var isRunning = true;
const SIMPLEMODE = false; // for running without use of messages to refresh data. Plays one test buffer in loop.

/**
 * this AudioWorkletProcessor is setup by the UI layer, in this project it is react.js
 * The UI layer obtains "chunks" (typically 1 second, 44100 data points) of audio signal from a web socket or local code.
 * AudioWorkletProcessor runs in its own thread and plays sound buffer without holding up the
 * main UI thread, which would freeze the UI. It defines process(), which
 * it calls whenever it needs a new "bucket" of data, typically 128 bytes, so it calls it rapidly.
 * This class matches chunks to buckets by moving a bucket along a chunk using an increasing offset
 * and grabbing data at each call to process(). When a chunk is exhausted it sets up another chunk as 
 * input and resets counters. Also sends a message to the UI layer to send more data "FEED_ME".
 * Todo: use double-buffer: one chunk buffer is current signal source and the other waits
 * for asynchronous message response containing fresh data. Buffers swap when active buffer is exhausted.
 */
class WorkletChunks extends AudioWorkletProcessor {
    
    startFeedMeOnce = false;
    startFirstSwap = false;
    waitingForResponse = false;

    constructor(jsonOptions) { 
      super(); // this eats jsonOptions to setup stereo etc
      // console.log('WorkletChunks.js DOUBLE BUFFER NEWEST. pizza input: ' + jsonOptions.processorOptions['pizza']);
      // audio worklet interacts with gui layer via messages to prevent freezing gui. Below setup message handler.
      this.port.onmessage = (messageFromUIlayer) => this.handleAudioPortMessage(messageFromUIlayer); 
      if (SIMPLEMODE) this.fillSoundBufferTestData();
      this.SndHelperA = new sndHelper();
      //this.port.start()  not needed ??
    }

    // declare the 2 double-buffers and pointer to actively-being-played buffer.
    // beware of javascript's loose declaration for wrong-case var name errors!
    swpPointerPlaying_left;
    swpPointerPlaying_right;
    swpPointerRecv_left;
    swpPointerRecv_right;

    /**
     * handles incoming message from UI layer. Audio worklets communicate with UI layer via message only.
     * @param {*} messageFromUIlayer look at msgType to see what ui layer wants or data it's providing
     */
    handleAudioPortMessage = (messageFromUIlayer) => {
      if (messageFromUIlayer.data.msgType == STOPNOW) {
          console.log('AudioWorkletProcessor got STOPNOW')
          isRunning = false;
          return;
      }
      if (messageFromUIlayer.data.msgType == 'sndData') { 
          // assign receive pointer to incoming buffer without affecting currently playing buffer.
          // this is double-buffering
          this.swpPointerRecv_left = messageFromUIlayer.data.leftData;
          this.swpPointerRecv_right = messageFromUIlayer.data.rightData;
          // the spread operator ... clones the array
          //this.swpPointerRecv_left = [...messageFromUIlayer.data.leftData];
          //this.swpPointerRecv_right = [...messageFromUIlayer.data.rightData];
          ////console.log('got chunk data seq: ' + this.ctB++  + ' byteLength: ' + this.swpPointerRecv_left.byteLength)
          if (this.startFirstSwap == false) {
             this.startFirstSwap = true;
             this.swapActiveBuffer();
          }
          this.waitingForResponse = false;
      }
      if (messageFromUIlayer.data.msgType == 'sorryNoSndDataYet') {
        // UI layer hasnt yet gotten fresh data from web socket, so retry request to UI.
        console.log("got sorryNoSndDataYet +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        // this.sendFEED_ME(); removed because causes loop
      }
    }
    /**
     * provides double buffering whereby one buffer is playing the current sound and the other
     * buffer is standing by to receive data from the web service. This prevents data replacement
     * while a buffer is playing, resulting in lost data.
     */
    swapActiveBuffer() {
        if (this.swpPointerRecv_left == null) { 
          console.log('swapActiveBuffer swpPointerRecv_left null');
          this.swpPointerPlaying_left = null; 
        }
        // console.log('this.swapActiveBuffer ' + this.swpPointerRecv_left.byteLength)
        this.swpPointerPlaying_left = this.swpPointerRecv_left;
        this.swpPointerPlaying_right = this.swpPointerRecv_right;
        // reset indicator to no-data state
        this.swpPointerRecv_left = null;
    }

    /**  gets called by AudioWorkletProcessor which supplies left and right buffers to receive audio signal.
     * Length is typically 128 bytes "a bucket", so this gets called very rapidly.
     */
    nodataCt = 0;
    ctA = 0;
    ctB = 0;
    process (inputs, outputs, parameters) {  
        if (isRunning == false) { return false; } // return value false tells web audio api to stop playing 
        if (SIMPLEMODE) { this.loadOneBucketFromChunkBuffrToSpeakerOut(outputs[0][0], outputs[0][1]); return true; }
        if (!this.startFeedMeOnce) { 
          this.startFeedMeOnce = true; console.log('/////  at startup requesting first data'); 
          this.sendFEED_ME(); 
          return true;
        }

        if (this.swpPointerPlaying_left == null) { 
            this.logg('swpPointerPlaying_left is null. Playing blank sound.'); 
            this.startFirstSwap = false; // trigger a swapbuffer when data finally arrives
            //if (this.nodataCt++ > 1000) { console.log('no data over 1000. Exit.'); return false; } 
            for (var idx=0; idx < outputs[0][0].length; idx++)
                outputs[0][0][idx] = outputs[0][1][idx] = 0;
            return true; // it will "play" the blank buffers and retry again
        } 
        // this is asynchronous call. Result will appear sometime later as call to handleAudioPortMessage()
        var status = this.loadOneBucketFromChunkBuffrToSpeakerOut(outputs[0][0], outputs[0][1]); // l&r speakers
        if (!status) { // no data. load current bucket with zero output
            this.logg('empty in buffer')
            //for (var idx=0; idx < outputs[0][0].length; idx++)
            //    outputs[0][0][idx] = outputs[0][1][idx] = 0;
        }
        // BYPASS ALL EXTERNAL DATA FOR TESTING
        //this.SndHelperA.fillBuffSineTest(outputs[0][0], outputs[0][1], 440);
        return true;
    }

    lct = 0;
    logg(msg) {
        if (this.lct == 0 || this.lct % 1000 == 0) { this.lct; console.log(this.lct + ' ' + msg); }
        this.lct++;
    }

    bucketCounter = 0; // WARNING: look out for letter-case errors! Use intellisence!
    inputBuffTally = 0; 

    /**
     * returns true if fresh data has been loaded; false if no data ready
     * @param {*} leftOut 
     * @param {*} rightOut 
     * @returns 
     */
    srcBuffIdx = 0; // index for currently active input buffer from UI layer
    /**
     * Called by process() of web api. This method matches the small buffer that the web api
     * wants filled (128 bytes but can change) with the large buffer 44100 of signal originating from
     * a web socket or whatever. It gets called rapidly, and it manages swapping to a new buffer when
     * data is exhausted.
     * @param {*} leftOut web api wants left data here
     * @param {*} rightOut 
     * @returns false if no data is available. Typically caller fills arrays with 0's
     */
    loadOneBucketFromChunkBuffrToSpeakerOut (leftOut, rightOut) {
        var webApiBucketSize = leftOut.length; // 128 but specs can change
        // if (this.procCt++ % 100 == 0) console.log('load bucket'); // warning: backlog of logs slows the main thread!
        // now load one bucket of data going to speakers into the 128 byte buffer in outputs[0][0] and outputs[0][1]
        ///////////////////////
        for (let webApiBucketIndex = 0; webApiBucketIndex < webApiBucketSize; webApiBucketIndex++) {
            // end of src buffer can occur in the middle of filling destination buffer!
            // without the -1 at end, overruns the buffer and makes a snap when buffer change happens!
            if (this.srcBuffIdx > (this.swpPointerPlaying_left.length - 1)) { 
                if (!this.waitingForResponse)
                    this.sendFEED_ME(); 
                if (this.swpPointerRecv_left == null)
                   return false; // returns false if no new data available yet
                this.swapActiveBuffer(); // switch over to newly filled input buffer
                this.srcBuffIdx = 0; // starting new source buffer, so reset
            }
            // warning: javascript does not throw arrayOutOfBoundsException!
            leftOut[webApiBucketIndex] = this.swpPointerPlaying_left[this.srcBuffIdx]
            rightOut[webApiBucketIndex] = this.swpPointerPlaying_right[this.srcBuffIdx];
            this.srcBuffIdx++;
        }
        // this.bucketCounter++
        return true
    }

    sendFEED_ME() {
        // console.log('feedme from worklet ' + this.ctA++ + ' ---------------------------------------')
        var feedRequest = { msgType:'FEED_ME', wavetype:'sinewave', frequency:'440', chunkNum: this.chunkNum++ }
        this.port.postMessage(feedRequest);
        this.waitingForResponse = true;
    }

    fillSoundBufferTestData() {
      var buffTimeSpan = 5;
      var srcBuffLen = sndHelper.SAMPLEPERSEC * buffTimeSpan;
      this.swpPointerPlaying_left = new Float32Array(srcBuffLen);
      this.swpPointerPlaying_right = new Float32Array(srcBuffLen);
      new sndHelper().fillBuffSineTest(this.swpPointerPlaying_left, 440, false);
      new sndHelper().fillBuffSineTest(this.swpPointerPlaying_right, 1200, true);
    }
  }

  // IT WORKLET NOT SETUP BELOW, IT IS INVISIBLE TO USERS OF THIS MODULE!!
  registerProcessor('WorkletChunks', WorkletChunks);

// workaround to import this: "const STOPNOW="stopnow";"
//  FIX: firefox in ubuntu cannot handle javascript import/export within
//       a Worklet. Chrome does it ok. This was temporary workaround.
//////////////sillyFixForInabilityToExportAConstantFromTheModule(); 
// function sillyFixForInabilityToExportAConstantFromTheModule() {
//     fetch("./WorkletChunks.js").then(response => response.text())
//     .then(theText => { return(theText.match(/.*STOPNOW="(.*)".*/)[1]); }) // /g at end BREAKS it
//     .then(theVal => { STOPNOW = theVal;});  } -->

//this.port.postMessage(this.getBinarySineRequestFromPort()); 
    /* getBinarySineRequestFromPort() { 
      // blobs wont work in an audioWorker so use this
      // 0x48 = 72 decimal; 65 = 101
      var zz = new Uint8Array([0x48, 0x48,0x48,0x65, 0x65, 0x65, 0x65, 0x65, 0x65, 0x48]).buffer;
      return({ msgType:'testBinarySine', msgText: 'you want pizza: ' + this.pizza, msgBinary:zz });
      //return({ msgType:'testBinarySine', msgText: '', msgBinary:this.lBuffr });
    } */
            // await new Promise(r => setTimeout(r, 200));
            // const sleep = ms => new Promise(r => setTimeout(r, ms)); await sleep(<duration>);


  

  
 
  