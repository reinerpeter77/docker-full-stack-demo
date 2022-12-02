package Helper;

import java.nio.ByteBuffer;

public class DSPhelper {
    // independently of the buffer position, gets angle value of ONE data point increment at 1 Hz
    static double angleDeltaOneSample(int samplesPerSecond) {
        return ((2.0 * Math.PI) / samplesPerSecond);
    }

    // keeps a running angle position across all calls to get chunk of data.
    static private int rampSamples = 0;
    static private double freqAngleDeltaSum = 0;
    static private double FM_modulationDeltaSum = 0;
    public static int SAMPLESPERSECOND = 44100; // dvd format 44.1 kHz.

    // float is 32 bits to match javascript float32, used by web audio api
    /**
     * returns array where first half is left channel and second is right channel
     * @param buffSize must be multiple of 2
     * @param fStart ramp start
     * @param fEnd ramp end
     * @param rampPeriod todo
     * @param LeftToRightPhaseShift
     * @param modulationFreq FM modulation freq
     * @return
     * @throws Exception
     */
    public float[] getRampFM_stereo(int buffSize, double fStart, double fEnd, double rampLenSecs,
              int LeftToRightPhaseShift, double modulationFreq) throws Exception {
        if (buffSize % 2 == 1) {
            throw (new Exception( "buffsize must be even number (stereo)")); 
        } 
        float[] newBuffer = new float[buffSize]; 
        int leftRightOffst = buffSize/2;
        double modulationSine = 0; double phaseShiftAngle = 0;
        double rampRatio = 0; double interpolatedFreq = 0; 
        int rampLenSamples = (int)(rampLenSecs * SAMPLESPERSECOND);
        float modulAmplitude = 0.2f;
        for (int idx = 0; idx < leftRightOffst; idx++) {  
            //rampRatio = (double) idx / (double) leftRightOffst; // for frequency ramp
            if (rampSamples > rampLenSamples) rampSamples = 0;
            rampRatio = (double)rampSamples++ / rampLenSamples; // for frequency ramp
            interpolatedFreq = fStart + rampRatio * (fEnd - fStart);
            FM_modulationDeltaSum = FM_modulationDeltaSum + 
                angleDeltaOneSample(SAMPLESPERSECOND) * modulationFreq; 
            modulationSine = Math.sin(FM_modulationDeltaSum);
            modulationSine = (modulationSine * modulAmplitude) + 1.0f; // scale & center at 0
            if (modulationFreq < 1) modulationSine = 1.0; // this stops click modulationSine = 1.0;
            // modulationSine = 1.0;
            freqAngleDeltaSum = freqAngleDeltaSum + 
                angleDeltaOneSample(SAMPLESPERSECOND) * (interpolatedFreq * modulationSine);
            var leftVal = (float)Math.sin(freqAngleDeltaSum); 
            newBuffer[idx] = leftVal;
            var rightVal = (float)Math.sin(freqAngleDeltaSum + LeftToRightPhaseShift);
            // if (idx == leftRightOffst - 2)
            //     idx = idx;  // visual studio pause on condition takes 5 minutes to find it
            newBuffer[idx + leftRightOffst] =  rightVal; // for right channel, offset by half buffer length
        }
        return newBuffer; 
    }

    static public int timeBaseCt = 0;
 
    // 32 bits to match javascript float32, used by web audio api
    // this technique does not work well for modulation
    double oneDataPointInSeconds = (1.0d / (double)SAMPLESPERSECOND);
    public float[] fillBuffF32_stereophonic(int buffSize, double cwFrequency) throws Exception {
        if (buffSize % 2 == 1) {
            throw (new Exception("buffsize must be even number (stereo)"));
        }
        float[] newBuffer = new float[buffSize];
        int trackOffst = buffSize/2;
        for (int idx = 0; idx < trackOffst; idx++) {  
            double angleInRadians = timeBaseCt * oneDataPointInSeconds * 2.0 * Math.PI;
            float leftVal = (float)Math.sin(angleInRadians * cwFrequency); 
            newBuffer[idx] = leftVal;
            // for STEREO add offset of half buffer size
            newBuffer[idx + trackOffst] = leftVal; 
            timeBaseCt++;
        }
        return newBuffer;
    }




    int zz = 0;
    // thanks to codereview.stackexchange.com
    public static byte[] floatsToBytes(float[] floats) {
        byte bytes[] = new byte[Float.BYTES * floats.length];
        ByteBuffer.wrap(bytes).asFloatBuffer().put(floats);
        return bytes;
    }
    public static float[] bytesToFloats(byte[] bytes) {
        if (bytes.length % Float.BYTES != 0)
            throw new RuntimeException("Illegal length");
        float floats[] = new float[bytes.length / Float.BYTES];
        ByteBuffer.wrap(bytes).asFloatBuffer().get(floats);
        return floats;
    }

    static short getSineShort(double ang, double divisor) {
        return (short) ((Math.sin(ang) * Short.MAX_VALUE) / divisor);
    }

    public void zero(float[] buff, int startIdx, int length) {
        float threshold = 0.05f; 
        // beginning
        for (int idx = startIdx; ; idx++) {
            if (Math.abs(buff[idx]) < threshold) { 
                //System.out.print(" zero: " + idx); 
                break; 
            }
            buff[idx] = 0;
        }
        // ending
        int lastPt = startIdx + length;
        for (int idx = lastPt - 1; ; idx--) {
            if (Math.abs(buff[idx]) < threshold) { 
                //System.out.print(" endzero: " + (lastPt - idx)); 
                break; 
            }
            buff[idx] = 0;
        }
    }

    public void taper(float[] buff, int taperLength, int startIdx, int length) {
        int taperCt = 0;
        // taper START
        for (int idx = startIdx; idx < (startIdx + taperLength); idx++) {
            float ratio = (float) taperCt++ / taperLength;
            buff[idx] = (float) (buff[idx] * ratio);
        }
        // taper END
        taperCt = 0;
        int lastPt = startIdx + length;
        for (int idx = lastPt - taperLength; idx < lastPt; idx++) {
            float ratio = ((float)taperLength - taperCt) / taperLength;
            buff[idx] = (float) (buff[idx] * ratio);
        }
    }

    // TRASH
       /*
    // 32 bits to match javascript float32, used by web audio api
    // this version calculates output per data point and does not work properly.
    // it fails when a frequency is sweeped or modulated and result is the changing value causes
    // some sort of additive effect.
    public float[] ZZZZZZ_fillBuffF32_stereophonicRamped(int buffSize, double fStart, double fEnd, double rampPeriod,
              int LeftToRightPhaseShift, double modulationFreq) throws Exception {
        if (buffSize % 2 == 1) {
            throw (new Exception("buffsize must be even number (stereo)"));
        }
        System.out.print(timeBaseCt + " "); //"fstart " + fStart + " fEnd " + fEnd);
        float[] newBuffer = new float[buffSize];
        int halfBuffLeftRight = buffSize/2;
        double modulationSine = 0;
        double newAngle = 0;
        double phaseShiftAngle = 0;
        float rampRatio = 0;
        double interpolatedFreq = 0;
        float modulAmplitude = 0.2f;
        for (int idx = 0; idx < halfBuffLeftRight; idx++) {  
            rampRatio = (float)idx / (float)(halfBuffLeftRight);
            interpolatedFreq = fStart + rampRatio * (fEnd - fStart);
            int timeBaseNormalizedToBuffer = timeBaseCt % halfBuffLeftRight;
            double angleInRadiansNormalized = (timeBaseNormalizedToBuffer * 2.0 * Math.PI)/SAMPLESPERSECOND; 

            modulationSine = Math.sin(modulationFreq * timeBaseCt * 2.0 * Math.PI/SAMPLESPERSECOND);
            modulationSine = ((modulationSine + 1.0f) * modulAmplitude); // scale & center at 0
            if (modulationFreq == 0) modulationSine = 1.0f;
            float leftVal = (float)Math.sin(angleInRadiansNormalized * interpolatedFreq * modulationSine);
            // float leftVal = (float)Math.sin(angleInRadians * 440); //freaky but this works ok ????
            newBuffer[idx] = leftVal;
            // for STEREO add offset of half buffer size
            var rightVal = leftVal; // (float)Math.sin(phaseShiftAngle);
            int rightIndex = idx + halfBuffLeftRight;
            // if (idx == halfBuffLeftRight - 2)
            //    idx = idx;  // visual studio pause on condition takes 5 minutes to find it
            newBuffer[rightIndex] =  rightVal;
            timeBaseCt++;
        }

        return newBuffer;
    }
    */

    // public float[] zeroDown(float[] buff, int startIdx, int length) {
    //     // beginning
    //     float prev = 0;
    //     for (int idx = startIdx; ; idx++) {
    //         if (buff[idx] < 0 && prev > 0) { 
    //             //System.out.print(" zero: " + idx); 
    //             break; 
    //         }
    //         buff[idx] = 0;
    //     }
    //     // ending
    //     int lastPt = startIdx + length;
    //     for (int idx = lastPt - 1; ; idx--) {
    //         if (Math.abs(buff[idx]) < threshold) { 
    //             //System.out.print(" endzero: " + (lastPt - idx)); 
    //             break; 
    //         }
    //         buff[idx] = 0;
    //     }
    // }


    // fills left, right alternately for android sound
    /* public short[] fillBuffAndroid(int buffSize, double carrierFreqStart, double carrierFreqEnd,
            double modulationFreq) throws Exception {
        short[] newBuffer = new short[buffSize];
        // Log.d("gg", "before.. " + ++ct);
        // if (1==1) return newBuffer;
        if (buffSize % 2 == 1) {
            throw (new Exception("buffsize must be even number (stereo)"));
        }
        double fmAngle = 0;
        double modulationSine = 0;
        double cwAngle = 0;
        double newAngle = 0;
        double shiftAngle = 0;
        double rampRatio = 0;
        double interpolatedFreq = 0;
        int SAMPLESPERSECOND = 44100; // dvd format 44.1 kHz.
        int modulFrequency = 0;
        int modulAmplitude = 0;
        int cwFrequency = 600;
        int LeftToRightPhaseShift = 0;

        for (int idx = 0; idx < buffSize; idx++) {
            rampRatio = (double) idx / (double) buffSize;
            interpolatedFreq = carrierFreqStart + rampRatio * (carrierFreqEnd - carrierFreqStart);

            fmAngle = getAngleIncrement_ForOneDataPoint(modulationFreq, SAMPLESPERSECOND);
            oldModulationAngle += fmAngle;
            modulationSine = Math.sin(oldModulationAngle);
            if (modulationFreq < 1)
                modulationSine = 0.0;
            // modulationSine ranges from -1 to 1
            // multiply by amplitude, but bring back to be centered around 1.0
            modulationSine = (modulationSine * modulAmplitude) + 1.0f;

            cwAngle = master_timebase_angle + getAngleIncrement_ForOneDataPoint(cwFrequency, SAMPLESPERSECOND);
            master_timebase_angle = cwAngle;

            if (modulMode == MODULATION_FM) {
                newAngle = oldAngle + getAngleIncrement_ForOneDataPoint(
                        interpolatedFreq * modulationSine, SAMPLESPERSECOND);
                shiftAngle = newAngle + LeftToRightPhaseShift;
                newBuffer[idx] = getSineShort(shiftAngle, 2);
                newBuffer[idx] += getSineShort(cwAngle, 2);
                idx++;
                newBuffer[idx] = getSineShort(shiftAngle, 2);
                newBuffer[idx] += getSineShort(cwAngle, 2);
                // newBuffer[idx] += getSineShort(cwAngle, 2);
                // preserve current angle so click wont happen on next iteration.
                oldAngle = newAngle;
            }

            else {
                throw new Exception("modulation mode not properly set");
            }
        }
        // Log.d("gg", "after.. " + ct);
        return newBuffer;
    } */

}
/*        // Log.d("gg", "after.. " + ct);
        // taper(newBuffer, 200, true, true);
        //taper(newBuffer, 50, 0, newBuffer.length/2);
        //taper(newBuffer, 50, newBuffer.length/2, newBuffer.length/2);
        //if (zz++ == 0) 
        //    System.out.println(" stereoTestMode: " + stereoTestMode + " newBuffer.length/2: " + newBuffer.length/2);
        // disable zero and taper because timebase is now static
        //zero(newBuffer, 0, newBuffer.length/2);
        //zero(newBuffer, newBuffer.length/2, newBuffer.length/2); */
