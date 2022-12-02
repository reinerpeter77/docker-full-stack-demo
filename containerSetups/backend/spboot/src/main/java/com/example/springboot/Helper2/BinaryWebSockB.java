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

import org.json.JSONObject;
import org.springframework.web.socket.BinaryMessage;
// import org.springframework.web.socket.TextMessage;

public class BinaryWebSockB extends BinaryWebSocketHandler {

	/**
	 * returns some text encoded as bytes
	 * NOTE this is for the base class, not inner class!
	 */
	@Override
	protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message)
			throws Exception {
		ByteBuffer inByteBuff = message.getPayload();
		Charset charset = Charset.forName("ISO-8859-1");
		String text = charset.decode(inByteBuff).toString();
		System.out.println("BinaryWebSockB.handleBinaryMessage() input: " + text);
		// byte[] byteData = ("wed text send as binary END U sent: " +
		// text).getBytes(StandardCharsets.UTF_8);
		byte[] byteData = ("return byte socket data here from BinaryWebSockB.java on server. You sent: " +
				text).getBytes(StandardCharsets.UTF_8);
		// JSONObject jsonA = new JSONObject();
		// jsonA.append("msgType", "sndData");
		// // in javascript web audio worker, data comes right out as array
		// jsonA.append("leftData", byteData);
		// jsonA.append("rightData", byteData);
		// org.json.JSONArray foo = (org.json.JSONArray)jsonA.get("leftData");
		// ((org.json.JSONArray)jsonA.get("leftData")).get(2);
		// com.fasterxml.jackson.core.json.JsonReadContext
		// com.fasterxml.jackson.core.JsonEncoding ff;
		// ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

		// ByteArrayOutputStream stream = new ByteArrayOutputStream();
		// byte[] bytes = jsonA.toString().getBytes();
		// session.sendMessage(new BinaryMessage(bytes));

		// comes out at client as comma separated text
		// session.sendMessage(new TextMessage(jsonA.toString()));

		// ff.values()
		// JsonEncoding

		session.sendMessage(new BinaryMessage(byteData));
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
	 */

	
}
