

// NOTE: this file exists twice in this project, identical copies.
// One is under the react.js folder and the other is under /public. The reason is that audio worklets
// need to exist under /public, not react, and this file is used by both systems because of static properties.
// javascript exports work on chrome ubuntu but fail for firefox ubuntu!
const color = 'green55';
const flavor = 'lemon';
// commands used between html page and sound worket. Cannot define inside worklet
const STOPNOW = "stopPlayerNow"
const STARTNOW = "startPlayerNow"

class sndHelper {
    static SAMPLEPERSEC = 44100;
    timeBaseCount = 0;

    srcBuffLen = sndHelper.SAMPLEPERSEC * 1;
    lBuffr = new Float32Array(this.srcBuffLen);
    rBuffr = new Float32Array(this.srcBuffLen);
    // fillBuffSineTest(lBuffr, rBuffr);

    fillBuffSineTest(lBuffr, rBuffr, freq) {
        var piAngle = freq * 2 * Math.PI;
        for (let i = 0; i < lBuffr.length; i++) {
            // if (this.timeBaseCount % 10000 == 0) { console.log("tbase.: " + this.timeBaseCount + "  lBuffr.length " + lBuffr.length); }
            this.timeBaseCount++
            lBuffr[i] = rBuffr[i] = sndHelper.generateSample(this.timeBaseCount, piAngle)
            //if (i > 10000) rBuffr[i] = sndHelper.generateSample(this.timeBaseCount, piAngle * 2)
        }
    }
    fillBuffSineTestTwinkle(buffr, freq, twinkle) {
        var piAngle = freq * 2 * Math.PI;
        for (let i = 0; i < buffr.length; i++) {
            this.timeBaseCount++
            if (twinkle) {
                if (this.timeBaseCount % 40000 < 20000)
                    buffr[i] = sndHelper.generateSample(this.timeBaseCount, piAngle)
            } else {
                buffr[i] = sndHelper.generateSample(this.timeBaseCount, piAngle)
            }
        }
    }
    static generateSample(sampleNumber, angFreq) {
        let sampleTime = sampleNumber / 44100;
        let sampleAngle = sampleTime * angFreq;
        return Math.sin(sampleAngle);
    }

    setupSine(frequency) {
		var buffTimeSpan = 1;
		var srcBuffLen = sndHelper.SAMPLEPERSEC * buffTimeSpan;
		this.lBuffr = new Float32Array(srcBuffLen);
		this.rBuffr = new Float32Array(srcBuffLen);
		sndHelper.fillBuffSineTest(this.lBuffr, this.rBuffr, frequency);
	}

    static arrayBufferToFloat32Array(ArrayBufferIn) {
       // from the official docs: getFloat32(byteOffset)    
       //     getFloat32(byteOffset, littleEndian)
       //     packs sets of 4 bytes into single float32's, determined by byte order as indicated.
       // THE ABOVE RACIST SLUR REFERRING TO BYTE ORDER IN THE OFFICIAL DOCS IS UNACCEPTABLE. 
       // IT IS A LEFTOVER FROM THE 1960'S AND NEEDS TO GO.
       // var z = Float32Array.from(ArrayBufferIn); // no good..  it doesnt combine bytes into floats
       var BYTES_PER_F32 = 4;
       var f32Array = new Float32Array(ArrayBufferIn.byteLength/BYTES_PER_F32);
       var f32Idx = 0;
       var byteOrderLeastFirst = false;
       var inputDataView = new DataView(ArrayBufferIn);
       for (var idx = 0; idx < ArrayBufferIn.byteLength; idx += BYTES_PER_F32) {
           f32Array[f32Idx++] = inputDataView.getFloat32(idx, byteOrderLeastFirst);
           // outstr += (dataView.getFloat32(idx, false).toFixed(2) + ', ');
       }
       return f32Array;
   }

   static float32ArrayToString(array) { 
       // type is javascript Float32Array
       var str = 'array.length: ' + array.length + ' ';
       for (var idx = 0; idx < array.length; idx++) {
           if ((idx % 50) === 0) str += ' [[' + idx + ']]<br/> '
           str += array[idx].toFixed(2) + ' ';
       }
       return str;
   }

   procBinary(msgBinary) {
       if (!msgBinary) return;
       var Uint8Array_in = msgBinary;
       var str = ' ... msgBinary: ' + new TextDecoder().decode(Uint8Array_in) + ":END";
       return str;
   }
}
export function sayHi() { console.log("hi from sndHelperA.js") }	

export { color, flavor, sndHelper, STOPNOW, STARTNOW };
