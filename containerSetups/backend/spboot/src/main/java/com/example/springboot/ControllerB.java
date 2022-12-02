package com.example.springboot;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import Helper.CloudHelper;

import javax.servlet.http.HttpServletRequest;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;

@Controller  
// @RestController // causes caller to get literal string, not contents of html in templates
public class ControllerB {
	
	// FOR html files in templates folder TO SHOW, NEED TO ADD ENTRY TO BUILD.GRADLE !
    // FOR html files in templates folder TO SHOW, NEED TO ADD ENTRY TO BUILD.GRADLE !
    // FOR html files in templates folder TO SHOW, NEED TO ADD ENTRY TO BUILD.GRADLE !
    // FOR html files in templates folder TO SHOW, NEED TO ADD ENTRY TO BUILD.GRADLE !
	// ADD BELOW TO BUILD GRADLE [also needed to re-import gradle project to eclipse for this to take effect]
	//    ==>>  dependencies { ...  implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'  ...
	
    // to show a template or can show a regular html file. 
    // Its better to show a regular html file by putting it into
    //  /java/resources folder. Below GetMapping file is in /resources/templates (without
    //  the java in path). Confusing.
    // gets html file from resources/templates; localhost:8086 presents this file
    @GetMapping("/")  
	public String jhiguiuihih() { 
        System.out.println("ControllerB got request / ");
		return "javascriptWebApiClient"; // gets html file from resources/templates
	}
	
    // gets html file from resources/templates
    // this is an actual spring-boot template...
    @PostMapping("/processPostAndReturnHTML_template")
    public String processPostAndReturnHTML_template(HttpServletRequest request) {
        System.out.println("got post");
        try {
            System.out.println("body: " + extractPostRequestBody(request));
        } catch (Exception e) {
        	System.out.println("error extract");
            e.printStackTrace();
        }
        System.out.println("returning processPostResponsePage"); 
        return "processPostResponsePage"; // returns hello5.html content from src/resources/templates
        // System.out.println("returning hello5inController"); return "hello5inController"; // ERROR ..needs html template name
    }
    
    @PostMapping("/processPostAndReturnLiteralString")
    @ResponseBody  // says it returns actual body of response, not a template
    public String submitToRestController2(HttpServletRequest request) {
        System.out.println("got post");
        try {
            //System.out.println("submitToRestController2: " + extractPostRequestBody(request));
            return ("<bb style='font-size:24px'>this is return string not an html template<br/>"
            + " because the handler has annotation: @ResponseBody " +
           "<br/> you input this data: fname, lname: " + request.getParameter("fname") + " " + request.getParameter("lname")) +
           "</bb>"; 
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    
    public static String extractPostRequestBody(HttpServletRequest request) throws Exception {
        Scanner s = new Scanner(request.getInputStream(), "UTF-8").useDelimiter("\\A");
        return s.hasNext() ? s.next() : "";
    }

    @RequestMapping("/testDBandDockerSecret")
    @ResponseBody  // says it returns actual body of response, not a template
	public String index() {
		System.out.println("testDBandDockerSecret");
		return testDBandDockerSecret();
	}

	String testDBandDockerSecret() {
		String resp = "failed";
		String dbMsg = "from db..: ";
		try {
			dbMsg += CloudHelper.testDB();
			// resp = " .secret named color2: " + CloudHelper.getDockerSecretFileContent("color2");
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return new SimpleDateFormat("yyyy/MM/dd HH:mm:ss")
				.format(new Date()) +
				" secret: " + resp + " | " + dbMsg;
	}

	@GetMapping("/returnLiteralString")   
    @ResponseBody  // says it returns actual body of response, not a template
	public String hello() {
		return "this is return string not an html template because its @ResponseBody";
	}
	
	
}
