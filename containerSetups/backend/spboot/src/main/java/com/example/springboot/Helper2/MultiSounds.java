package com.example.springboot.Helper2;

// https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket-intro-architecture

// added to build.gradle -> implementation group: 'org.springframework.boot', name: 'spring-boot-starter-websocket', version: '2.3.12.RELEASE'
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import Helper.DSPhelper;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.socket.BinaryMessage;
// import org.springframework.web.socket.TextMessage;

// javascript float32 equivalent to java float
// static int callCountForSweepFcn = 0;
public class MultiSounds extends BinaryWebSocketHandler {
	int callCount = 0;
	int carrStart = 880;
	int carrEnd = 1600;

	public MultiSounds() {
		super();
		System.out.println("====== new MultiSounds ======");
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// super.afterConnectionEstablished(session);
		System.out.println("====== new Connection MultiSounds. TODO bind timebase to this ======");
		//DSPhelper.timeBaseCt = 0;
	}

	// from org.springframework.web.socket.handler.AbstractWebSocketHandler
	// cannot rename because its an override, so rename the class instead.
	@Override
	protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message)
			throws Exception {
		String text = "emptytext";
		int reqNum = 0, chunkSizeSamples = 0, stfreq = 0, endfreq = 0, fmModFreq = 0, phaseShiftAngle = 0;
		String soundType = null, stereoTestMode = "";
		float rampLenSecs = 0.5f;
		try {
			ByteBuffer inByteBuff = message.getPayload();
			Charset charset = Charset.forName("ISO-8859-1");
			text = charset.decode(inByteBuff).toString();
			JSONObject jsonObject = new JSONObject(text);
			soundType = jsonObject.getString("soundType");
			if (soundType == null) {
				throw new Exception("error parsing required field \"soundType\" in json.");
			}
			try {
				if (jsonObject.has("reqNum")) reqNum = (int) jsonObject.get("reqNum");
				if (jsonObject.has("chunkSizeSamples")) chunkSizeSamples = (int) jsonObject.get("chunkSizeSamples");
				if (jsonObject.has("startCarrier")) stfreq = jsonObject.getInt("startCarrier");
				if (jsonObject.has("endCarrier")) endfreq = jsonObject.getInt("endCarrier");
				if (jsonObject.has("rampLenSecs")) rampLenSecs = jsonObject.getFloat("rampLenSecs");
				if (jsonObject.has("phaseShiftAngle")) phaseShiftAngle = (int) jsonObject.get("phaseShiftAngle");
				if (jsonObject.has("fmModFreq")) fmModFreq = (int) jsonObject.get("fmModFreq");
				if (jsonObject.has("stereoTestMode")) stereoTestMode = jsonObject.getString("stereoTestMode");
			} catch (Exception ex) {
				System.out.println("error parsing json. Input: " + text);
			}
			if (callCount++ == 0)
				System.out.println("MultiSounds first call soundType: " + soundType);
			if (soundType.equals("sineWithStartEndMarkers")) { 
				message.getPayload().position(0); // reset or ITS BLANK!
				SineWithStartEndMarkers(session, message);
			} else if (soundType.equals("sineWithRamps")) {
				message.getPayload().position(0); // reset or ITS BLANK!
				DSPhelper sndThing = new DSPhelper(); // todo make it for a socket session
				float[] chunk_leftFirstRightSecond = sndThing.getRampFM_stereo( 
						chunkSizeSamples * 2 /* stereo */, stfreq, endfreq, rampLenSecs, phaseShiftAngle,
						fmModFreq);
				byte[] bytesForWebSocket = DSPhelper.floatsToBytes(chunk_leftFirstRightSecond);
				session.sendMessage(new BinaryMessage(bytesForWebSocket));
			} else if (soundType.equals("simpleSine")) {
				message.getPayload().position(0); // reset or ITS BLANK!
				SimpleSine(session, message);
			} else {
				throw new Exception("bad params: \"" + text + "\"");
			}
		} catch (Exception ex) { // must catch or broken socket crashes server!
			System.out.println(Thread.currentThread().getStackTrace()[1].getMethodName() + ": " + ex.getMessage());
			byte[] byteData = ("bad socket request to server. \"" + ex.getMessage() + "\" You sent: " +
					text).getBytes(StandardCharsets.UTF_8);
			byte[] textMessage = new byte[byteData.length + 1];
			textMessage[0] = (byte) byteData.length; // first byte is length of message
			System.arraycopy(byteData, 0, textMessage, 1, byteData.length);
			// client detects text info, not data by short length of the message
			session.sendMessage(new BinaryMessage(textMessage));
		}
	}

	

	void SimpleSine(WebSocketSession session, BinaryMessage message) throws Exception {
		String text = "";
		try {
			ByteBuffer inByteBuff = message.getPayload();
			Charset charset = Charset.forName("ISO-8859-1");
			text = charset.decode(inByteBuff).toString();
			JSONObject jsonObject = new JSONObject(text);
			int reqNum = 0, chunkSizeSamples = 0, stfreq = 0;
			String soundType = "", stereoTestMode = "";
			try {
				reqNum = (int) jsonObject.get("reqNum");
				chunkSizeSamples = (int) jsonObject.get("chunkSizeSamples");
				stfreq = (int) jsonObject.get("startCarrier");
			} catch (Exception ex) {
				System.out.println("error parsing json. Input: " + text);
			}
			// System.out.print("SineWithStartEndMarkers" + reqNum);
			DSPhelper sndThing = new DSPhelper();
			float[] sndData = sndThing.fillBuffF32_stereophonic(
					chunkSizeSamples * 2 /* stereo */, stfreq);
			// sndData[0] = sndData[chunkSizeSamples] = 0.4444444f;
			// sndData[chunkSizeSamples - 1] = sndData[chunkSizeSamples * 2 - 1] =
			// 0.888888f;

			// socket sends as bytes, so convert from float array to byte array. Reconstruct
			// floats on other side.
			// see commented javascript below for re-assembling bytes to floats in client
			byte[] bytesForWebSocket = DSPhelper.floatsToBytes(sndData);
			session.sendMessage(new BinaryMessage(bytesForWebSocket));
		} catch (Exception ex) { // must catch or broken socket crashes server!
			System.out.println(Thread.currentThread().getStackTrace()[1].getMethodName() +
					": " + ex.getMessage() + " json text: " + text);
		}
	}

	/**
	 * sets value to 0.44444 at start and 0.88888 at end of block.
	 * for testing xfer of data
	 */
	void SineWithStartEndMarkers(WebSocketSession session, BinaryMessage message) throws Exception {
		String text = "";
		try {
			ByteBuffer inByteBuff = message.getPayload();
			Charset charset = Charset.forName("ISO-8859-1");
			text = charset.decode(inByteBuff).toString();
			JSONObject jsonObject = new JSONObject(text);
			int reqNum = 0, chunkSizeSamples = 0, stfreq = 0;
			String soundType = "", stereoTestMode = "";
			try {
				reqNum = (int) jsonObject.get("reqNum");
				chunkSizeSamples = (int) jsonObject.get("chunkSizeSamples");
				stfreq = (int) jsonObject.get("startCarrier");
			} catch (Exception ex) {
				System.out.println("error parsing json. Input: " + text);
			}
			// System.out.print("SineWithStartEndMarkers" + reqNum);
			DSPhelper sndThing = new DSPhelper();
			// float[] sndData = sndThing.fillBuffF32_stereophonic(
			// chunkSizeSamples * 2 /* stereo */, stfreq);
			float[] sndData = sndThing.fillBuffF32_stereophonic(
					chunkSizeSamples * 2 /* stereo */, stfreq);
			sndData[0] = sndData[chunkSizeSamples] = 0.4444444f;
			sndData[chunkSizeSamples - 1] = sndData[chunkSizeSamples * 2 - 1] = 0.888888f;

			// socket sends as bytes, so convert from float array to byte array. Reconstruct
			// floats on other side.
			// see commented javascript below for re-assembling bytes to floats in client
			byte[] bytesForWebSocket = DSPhelper.floatsToBytes(sndData);
			session.sendMessage(new BinaryMessage(bytesForWebSocket));
		} catch (Exception ex) { // must catch or broken socket crashes server!
			System.out.println(Thread.currentThread().getStackTrace()[1].getMethodName() +
					": " + ex.getMessage() + " json text: " + text);
		}
	}
}
/*
 * save this. Javascript to re-assemble floats from bytes sent by this socket
 * static arrayBufferToFloat32Array(ArrayBufferIn) {
 * // from the official docs: getFloat32(byteOffset)
 * // getFloat32(byteOffset, littleEndian)
 * // packs sets of 4 bytes into single float32's, determined by byte order as
 * indicated.
 * // THE ABOVE RACIST SLUR IN THE OFFICIAL DOCS IS UNACCEPTABLE. IT IS A
 * LEFTOVER FROM 50+ YEARS AGO.
 * // var z = Float32Array.from(ArrayBufferIn); // no good.. it doesnt combine
 * bytes into floats
 * var BYTES_PER_F32 = 4;
 * var f32Array = new Float32Array(ArrayBufferIn.byteLength/BYTES_PER_F32);
 * var f32Idx = 0;
 * var byteOrderLeastFirst = false;
 * var inputDataView = new DataView(ArrayBufferIn);
 * for (var idx = 0; idx < ArrayBufferIn.byteLength; idx += BYTES_PER_F32) {
 * f32Array[f32Idx++] = inputDataView.getFloat32(idx, byteOrderLeastFirst);
 * }
 * return f32Array;
 * }
 * 

 int jsonGetInt(JSONObject jObj, String key) {
		try {
			return (int) jObj.get(key);
		} catch (Exception ex) {
			return 0;
		}
	}

	float jsonGetFloat(JSONObject jObj, String key) {
		try {
			return (float) jObj.getFloat(key);
		} catch (Exception ex) {
			return 0;
		}
	}

	String jsonGetString(JSONObject jObj, String key) {
		try {
			return jObj.getString(key);
		} catch (Exception ex) {
			return "";
		}
	}
 */
