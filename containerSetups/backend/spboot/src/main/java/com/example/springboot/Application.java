package com.example.springboot;

import Helper.CloudHelper;

import java.util.Arrays;

import com.example.springboot.Helper2.TextWebSockA;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.WebSocketHandler;

@SpringBootApplication
public class Application {

	@Autowired
	private static ServletWebServerApplicationContext  webServerAppCtxt;

	@Configuration
	public class AppConfig2 {
		
		// example of inject values into a bean from a value in launch.json file
		@Value("${server.port}")  // this was set in vscode launch.json file and docker-compose*.yml file	
    	private int beanInjectedPortValue; // somehow this gets above value 

		@Value("${color7}")  // this was set in vscode launch.json file and docker-compose*.yml file	
    	private String colorFromEnvSetInLaunchJsonOrDockerCompo;

		/////@Value("${server.http2.enabled}")
		/////private String http2thing;

	    @Bean // needed or else "required a bean" error occurs
	    public FruitController.Fruit fruit() {
			///////System.out.println("*********** http2thing: "  + http2thing);
			System.out.println(Thread.currentThread().getStackTrace()[1].getMethodName() + 
		  " +++++ on port " + beanInjectedPortValue + " color7: " + colorFromEnvSetInLaunchJsonOrDockerCompo);
	        return new FruitController.Fruit();
	    }

		// @Bean
		// public WebSocketHandler myHandler() {
		// 	System.out.println("WebSocketHandler bean");
		// 	return new SpbtWebSockHndlr();
		// }
	}
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
		// use lamba expression to return an implementation of CommandLineRunner
		return args -> {
			try {
				//CloudHelper.testDB();
			} catch (Exception ex) {
				System.out.println(ex);
			}
			/* this was put here by spring initializr: */
			System.out.println("Let's inspect the beans provided by Spring Boot:");
			String[] beanNames = ctx.getBeanDefinitionNames();
			Arrays.sort(beanNames);
			for (String beanName : beanNames) {
			if (beanName.contains(("fRuit").toLowerCase()))
				System.out.println(beanName);
			}
		};
	}

	/* the above, setup by initializr uses lambda to setup the commandLineRunner bean.
	   Below is a non-lambda example in case lambda gets too confusing */
	// class Foo implements CommandLineRunner {
	// 	@Override
	// 	public void run(String... args) throws Exception {
	// 		System.out.println("running using non-lambda runner");
	// 	}
	// }
	// @Bean
	// public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
	// 	return new Foo();
	// }
	

    


	// IMPORTANT THIS FIXES THE CORS CROSS-ORIGIN ERROR FROM BROWSER WHEN ACCESSING WEB SERVICE
	// IMPORTANT THIS DOES NOT AFFECT WS AND WSS WEB SOCKET STUFF. SEE "registerWebSocketHandlers"
	//    FOR A SIMILAR CONFIGURATION
	@Configuration
	public class CorsConfiguration {
		@Bean
		public WebMvcConfigurer corsConfigurer() {
			return new WebMvcConfigurer() {
				@Override
				public void addCorsMappings(CorsRegistry registry) {
					System.out.println("======================now running: public WebMvcConfigurer corsConfigurer()");
					CorsRegistration creg = registry.addMapping("/**");
					String[] allowedClientList;
					try {
						allowedClientList = CloudHelper.getArrayOfSecrets("dbUrl", "corsMappingsForServer");
					} catch (Exception ex) {
						String strA = "http://localhost:3008,https://localhost:3008";
						System.out.println("****** dbUrl secrets file not present. Assuming this project is \n" +
						"running standalone, not in folder hierarchy. Using hardcoded web socket allowed origins: \n" +
						strA); 
					    allowedClientList = strA.split("\\s*,\\s*"); // trims whitespace foreach  
					}
					System.out.println(CloudHelper.ANSI_GREEN + "*** CORS client list: " + 
			     		Arrays.toString(allowedClientList) + CloudHelper.ANSI_RESET);
					creg.allowedOrigins(allowedClientList); 
					// creg.allowedOriginPatterns(patterns)
					// new CorsConfiguration().corsConfigurer().
				}
			};
		}
	}
}
