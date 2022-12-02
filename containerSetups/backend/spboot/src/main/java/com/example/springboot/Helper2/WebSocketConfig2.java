package com.example.springboot.Helper2;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistration;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import Helper.CloudHelper;

// WARNING: this file must be in subfolder of Application.java OR IT IS IGNORED !!!!!!
// WARNING: this file must be in subfolder of Application.java OR IT IS IGNORED !!!!!!
// WARNING: this file must be in subfolder of Application.java OR IT IS IGNORED !!!!!!
// WARNING: this file must be in subfolder of Application.java OR IT IS IGNORED !!!!!!

// added to build.gradle -> implementation group: 'org.springframework.boot', name: 'spring-boot-starter-websocket', version: '2.3.12.RELEASE'

@Configuration
@EnableWebSocket
public class WebSocketConfig2 implements WebSocketConfigurer {

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) { 
		try {
			System.out.println("000000++++ registerWebSocketHandlers");
			// look in dbUrl.secret for allowed clients for connecting to websocket
			String[] allowedClientList; String secretsFile = "dbUrl";
			try {
				allowedClientList = CloudHelper.getArrayOfSecrets(secretsFile, "corsMappingsForServer");
			} catch (Exception ex) {
				String strA = "http://localhost:3008,https://localhost:3008,http://my.ip.addr:3008";
				System.out.println("****** " + secretsFile + " secrets file not present. Assuming this project is \n" +
				"running standalone, not in folder hierarchy. Using hardcoded web socket allowed origins: \n" +
				strA); 
				allowedClientList = strA.split("\\s*,\\s*"); // trims whitespace foreach
			}
			System.out.println(CloudHelper.ANSI_RED + "*** websock client list: " + 
			     Arrays.toString(allowedClientList) + CloudHelper.ANSI_RESET); 
			WebSocketHandlerRegistration whreg = registry.addHandler(new TextWebSockA(), "/webSockJSONA");
		    whreg.setAllowedOrigins(allowedClientList);
			whreg = registry.addHandler(new BinaryWebSockB(), "/websockBinaryB");
			whreg.setAllowedOrigins(allowedClientList);
			// use inner class to make different signal generators. Cannot rename actual handler fcn.
			//whreg = registry.addHandler(new Sounds().new SweepChunks(), "/SweepChunks"); 
			//whreg.setAllowedOrigins(allowedClientList);
			whreg = registry.addHandler(new MultiSounds(), "/MultiSounds"); 
			whreg.setAllowedOrigins(allowedClientList); 
		} catch (Exception ex) { System.out.println(ex);}
	}
}
