// AudWorkletProcsA.js
// when adding new worklet dont forget to put in registerProcessor() at end of file
// when adding new worklet dont forget to put in registerProcessor() at end of file
// when adding new worklet dont forget to put in registerProcessor() at end of file
var timeBaseCount = 0;
class SineAudWorkletProc extends AudioWorkletProcessor {
    constructor() { super(); console.log(" new SineAudWorkletProc... ;" )}
    process (inputs, outputs, parameters) {
      /*To get STEREO, use below to create the worklet node in calling code.
        const whiteNoiseNode = 
          new AudioWorkletNode(audioContext, 'white-noise-processor', {outputChannelCount: [2]});
      */
      var leftChan = outputs[0][0]
      var rightChan = outputs[0][1] // error unless {outputChannelCount: [2]}
      if (timeBaseCount % 5000 == 0) { console.log("timeBaseCount: " + timeBaseCount + "  leftChan " + leftChan.type); }
      var msg;
      for (let i = 0; i < leftChan.length; i++) {
          timeBaseCount++
          leftChan[i] = generateSample(timeBaseCount, ANGULAR_FREQUENCY)
          if (timeBaseCount % 50000 > 25000) rightChan[i] = generateSample(timeBaseCount, ANGULAR_FREQUENCY * 3)
      }
      return true
    }
  }

  class SineAudWorkletProc2 extends AudioWorkletProcessor {
    constructor() { super(); console.log(" new SineAudWorkletProc ;" )}
    process (inputs, outputs, parameters) {
      /*To get STEREO, use below to create the worklet node in calling code.
        const whiteNoiseNode = 
          new AudioWorkletNode(audioContext, 'white-noise-processor', {outputChannelCount: [2]});
      */
      var leftChan = outputs[0][0]
      var rightChan = outputs[0][1] // error unless {outputChannelCount: [2]}
      if (timeBaseCount % 5000 == 0) { console.log("timeBaseCount: " + timeBaseCount + "  leftChan " + leftChan.type); }
      var msg;
      for (let i = 0; i < leftChan.length; i++) {
          timeBaseCount++
          leftChan[i] = generateSample(timeBaseCount, ANGULAR_FREQUENCY/2)
          if (timeBaseCount % 50000 > 25000) rightChan[i] = generateSample(timeBaseCount, ANGULAR_FREQUENCY)
      }
      return true
    }
  }
  
  const REAL_TIME_FREQUENCY = 440; 
  const ANGULAR_FREQUENCY = REAL_TIME_FREQUENCY * 2 * Math.PI;
  const SAMPLEPERSEC = 44100;
  const DURATION = 0.5; // in seconds
  function generateSample(sampleNumber, angFreq) {
    let sampleTime = sampleNumber / 44100;
    let sampleAngle = sampleTime * angFreq;
    return Math.sin(sampleAngle);
  }

  // IT WORKLET NOT SETUP BELOW, IT IS INVISIBLE TO USERS OF THIS MODULE!!
  registerProcessor('SineAudWorkletProc', SineAudWorkletProc)
  registerProcessor('SineAudWorkletProc2', SineAudWorkletProc2)

  
  
  