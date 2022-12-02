


// exports work on chrome ubuntu but fail for firefox ubuntu!
// exports work on chrome ubuntu but fail for firefox ubuntu!
// exports work on chrome ubuntu but fail for firefox ubuntu!
// exports work on chrome ubuntu but fail for firefox ubuntu!
// exports work on chrome ubuntu but fail for firefox ubuntu!
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
            lBuffr[i] = sndHelper.generateSample(this.timeBaseCount, piAngle)
            if (i > 10000) rBuffr[i] = sndHelper.generateSample(this.timeBaseCount, piAngle * 2)
        }
    }
    static generateSample(sampleNumber, angFreq) {
        let sampleTime = sampleNumber / 44100;
        let sampleAngle = sampleTime * angFreq;
        return Math.sin(sampleAngle);
    }
}
export function sayHi() { console.log("hi from sndHelperA.js") }	

const color = 'green55';
const flavor = 'lemon';
// commands used between html page and sound worket. Cannot define inside worklet
var STOPNOW = "stopPlayerNow"
export { color, flavor, sndHelper, STOPNOW };