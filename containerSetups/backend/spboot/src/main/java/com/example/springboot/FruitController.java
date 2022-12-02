package com.example.springboot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController 
// "The controller is annotated with the @RestController annotation, therefore 
// the @ResponseBody isn't required"
public class FruitController {
	public FruitController() {
	}

	// WARNING: must add "implementation group: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-xml', version: '2.11.4'"
	// to build.gradle for this to work. If not get misleading error message.
	// WARNING: must add "implementation group: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-xml', version: '2.11.4'"
	// to build.gradle for this to work. If not get misleading error message.

	// moved this to Application.java because "id 'org.springframework.boot' version '2.6.3'" refised to start circular dependency
	// Spring takes this annotation and creates lots of code. 
	//spring.main.allow-circular-references: true
	// java -Dspring.main.allow-circular-references=true -Dserver.port=8086 -jar build/libs/spring-boot-0.0.1-SNAPSHOT.jar
	// @Configuration
	// public class AppConfig2 {
	// 	// example of inject values into a bean from a value in launch.json file
	// 	@Value("${server.port}")  // this was set in vscode launch.json file	
    // 	private int beanInjectedPortValue; // somehow this gets above value 

	//     @Bean // needed or else "required a bean" error occurs
	//     public Fruit fruit() {
	// 		System.out.println(Thread.currentThread().getStackTrace()[1].getMethodName() + 
	// 	  " +++++ on port " + beanInjectedPortValue);
	//         return new Fruit();
	//     }
	// }

	@Autowired  
	// WARNING removing this sometimes gives impossible to trace Spring error messages!  
	private Fruit fruit = new Fruit();

    /* curl commands for testing all handlers:
	*/

	// To consume xml or json data as string in POST.
	/* echo *** curl commands. add "-v" to see header info *********************************************************************************************
	   echo eatFruit
	   curl -d '<fruit><color>green</color><flavor>tangyyyy</flavor></fruit>' -H 'Content-Type: application/xml' http://localhost:8086/eatFruit
	   curl -d '{"color":"green","flavor":"tangy"}' -H 'Content-Type: application/json' http://localhost:8086/eatFruit
       echo ***eatFruitArray
	   curl -d '[{"flavor": "apple", "color":"red"}, {"flavor": "banana", "color":"yellow"}]' -H 'Content-Type: application/json' localhost:8086/eatFruitArray
	   curl -d '<basket><fruit><color>red</color><flavor>cherries</flavor></fruit><fruit><color>green</color><flavor>apple</flavor></fruit></basket>' -H 'Content-Type: application/xml' http://localhost:8086/eatFruitArray
       curl -d '[{"flavor": "apple", "color":"red"}, {"flavor": "banana", "color":"yellow"}]' -H 'Content-Type: application/json' localhost:8086/eatFruitArray/1
	   curl -d '<basket><fruit><color>red</color><flavor>cherries</flavor></fruit><fruit><color>green</color><flavor>apple</flavor></fruit></basket>' -H 'Content-Type: application/xml' http://localhost:8086/eatFruitArray/1
       echo ***eatFruitArrayOutputArray
	   curl -d '[{"flavor": "apple", "color":"red"}, {"flavor": "banana", "color":"yellow"}]' -H 'Content-Type: application/json' localhost:8086/eatFruitArrayOutputArray
	   echo ***eatFruitArrayOutputOneIndexed
	   curl -d '[{"flavor": "apple", "color":"red"}, {"flavor": "banana", "color":"yellow"}]' -H 'Content-Type: application/json' localhost:8086/eatFruitArrayOutputOneIndexed/1
	   curl -d '<basket><fruit><color>red</color><flavor>cherries</flavor></fruit><fruit><color>green</color><flavor>apple</flavor></fruit></basket>' -H 'Content-Type: application/xml' http://localhost:8086/eatFruitArrayOutputOneIndexed/1
	   echo ***eatFruitArrayOutputArrayInXML
	   curl -d '[{"flavor": "apple", "color":"red"}, {"flavor": "banana", "color":"yellow"}]' -H 'Content-Type: application/json' localhost:8086/eatFruitArrayOutputArrayInXML
	   curl -d '<basket><fruit><color>red</color><flavor>cherries</flavor></fruit><fruit><color>green</color><flavor>apple</flavor></fruit></basket>' -H 'Content-Type: application/xml' http://localhost:8086/eatFruitArrayOutputArrayInXML

	*/
	@RequestMapping(value = "/eatFruit", consumes = { MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE })
	public String eatFruit(@RequestBody Fruit inFruit) {
		System.out.println("got eatFruitFromJson color: " + inFruit.color);
		return "\n eatFruit done. color: " + inFruit.color + " flavor: " + inFruit.flavor + "\n";
	}

	@RequestMapping(value = "/eatFruitArray", consumes = { MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE })
	public String eatFruitArray(@RequestBody Fruit[] inFruits) {
		System.out.println("got eatFruitFromJson color: " + inFruits[1].color);
		return "\n eatFruitArray done " + inFruits[1].flavor + " " + inFruits[1].color + "\n";
	}
	@RequestMapping(value = "/eatFruitArray/{fruitID}", consumes = { MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE })
	public String eatFruitArray(@RequestBody Fruit[] inFruits, @PathVariable int fruitID) {
		if (inFruits.length <= fruitID) { return "error fruitID out of bounds"; }
		System.out.println("got eatFruitFromJson color: " + inFruits[fruitID].color);
		return "\n eatFruitArray done " + inFruits[fruitID].flavor + " " + inFruits[fruitID].color + "\n";
	}


	@RequestMapping(value = "/eatFruitArrayOutputArray", method = RequestMethod.POST, consumes = { MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<Fruit[]> abcd(@RequestBody Fruit[] inFruits) {
		inFruits[0].flavor += "-sunnyday4Ave from server";
		inFruits[1].flavor += "-and-sour";
		return ResponseEntity.ok(inFruits);
	}

	@RequestMapping(value = "/eatFruitArrayOutputOneIndexed/{fruitID}", method = RequestMethod.POST, consumes = { MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<Fruit> abcdeff(@RequestBody Fruit[] inFruits, @PathVariable int fruitID) {
		inFruits[0].flavor += "-eatFruitArrayOutputOneIndexed";
		inFruits[1].flavor += "-and-sour";
		return ResponseEntity.ok(inFruits[fruitID]);
	}

	@RequestMapping(value = "/eatFruitArrayOutputArrayInXML", produces = { MediaType.APPLICATION_XML_VALUE }, consumes = { MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<Fruit[]> abcde(@RequestBody Fruit[] inFruits) {
		inFruits[0].flavor += "-eatFruitArrayOutputArrayInXML";
		inFruits[1].flavor += "-and-sour";
		return ResponseEntity.ok(inFruits);
	}

	// this is a bad example to put object class inside controller.
	// Done here to keep the examples clear and compact.
	static class Fruit {
		public Fruit() { System.out.print("new Fruit()...");};
		public String flavor;
		public String color;
		public Fruit(String flavor, String color) {
			this.flavor = flavor; this.color = color; 
		}
	}
}
