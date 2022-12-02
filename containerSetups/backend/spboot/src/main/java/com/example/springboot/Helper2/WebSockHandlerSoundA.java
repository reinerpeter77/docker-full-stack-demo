package com.example.springboot.Helper2;

// https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket-intro-architecture

// added to build.gradle -> implementation group: 'org.springframework.boot', name: 'spring-boot-starter-websocket', version: '2.3.12.RELEASE'
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import org.springframework.web.socket.handler.TextWebSocketHandler;

// build.gradle -> implementation group: 'org.json', name: 'json', version: '20210307'
import org.json.JSONObject; // entry added to build.gradle for this

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;

// mapping: registry.addHandler(new WebSockHandlerSoundA(), "/websockBinaryB");
public class WebSockHandlerSoundA extends BinaryWebSocketHandler {
    final int buffLen = 512;
	@Override
	protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
		ByteBuffer inByteBuff = message.getPayload();
		Charset charset = Charset.forName("ISO-8859-1");
		String text = charset.decode(inByteBuff).toString();
		System.out.println("in ByteBuffer: " + text);
		session.sendMessage(new BinaryMessage(("from spboot binary").getBytes(StandardCharsets.UTF_8)));
	}

}

