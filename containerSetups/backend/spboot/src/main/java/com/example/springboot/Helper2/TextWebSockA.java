package com.example.springboot.Helper2;

// https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket-intro-architecture

// added to build.gradle -> implementation group: 'org.springframework.boot', name: 'spring-boot-starter-websocket', version: '2.3.12.RELEASE'
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

// build.gradle -> implementation group: 'org.json', name: 'json', version: '20210307'
import org.json.JSONObject; // entry added to build.gradle for this

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
// import org.springframework.web.socket.sockjs.*;

public class TextWebSockA extends TextWebSocketHandler { // BinaryWebSocketHandler

    @Override
	public void handleTextMessage(WebSocketSession session, TextMessage message)
			throws InterruptedException, IOException {
		try {
			String payload = message.getPayload();
			JSONObject jsonObject = new JSONObject(payload);
			String cmd = jsonObject.get("command").toString();
			System.out.println("....command: " + cmd);
			if (cmd.equals("loopThing")) {
				int sessionID = Integer.parseInt(jsonObject.get("sessionID").toString());
				session.sendMessage(new TextMessage("loopThing " + jsonObject.get("user") + " number is: " + sessionID));
				// send message every second...
				new Timer().scheduleAtFixedRate(new SendWebSocketMessageA(session), 0, 1000); 
			}
			if (cmd.equals("setTemperatureF")) { 
				int valueF = Integer.parseInt(jsonObject.get("value").toString());
				session.sendMessage(new TextMessage("setTemperatureF got value: " + valueF));
			}
		} catch (Exception ex) {
			session.close(CloseStatus.BAD_DATA);
			// session.close(new CloseReason(CloseReason.CloseCodes.PROTOCOL_ERROR, "error on server"));
			// session.sendMessage(new ErrorMessage(new Exception("error on server")));
		}
	};  

	class SendWebSocketMessageA extends TimerTask {
		int sessionID = 0; int ct = 0;
		public SendWebSocketMessageA(WebSocketSession session) {
			ws_session = session;
		}
		WebSocketSession ws_session;
		@Override  
		public void run() {  
			try {
				ws_session.sendMessage(new TextMessage("././.sessionID...: " + sessionID + " count: " + ct++));
				if (ct > 2) {
					System.out.println("exiting TimerTask at 2");
					ws_session.close();
					this.cancel();
				}
			} catch (IOException e) {System.out.println("sendMessage error");}
		};
	}
}

