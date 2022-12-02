// jan 12
import '../App.css'; // this pulls css into the render() stuff. Dont need <style> tag!
import React from 'react'; 
import JMapTableComponent from './components/JMapTableComponent';
import ComponentAjaxToUListB from './components/ComponentAjaxToUListInFile';

/*______ ____  _____   ____    
|__   __/ __ \|  __ \ / __ \ _   get "bootstrap" library by running: "npm i react-bootstrap bootstrap"
   | | | |  | | |  | | |  | (_)  this inserts entry in package.json, so it never need run again. Run "npm install"
   | | | |  | | |  | | |  | |    ...import { Row, Modal } from 'react-bootstrap';
   | | | |__| | |__| | |__| |_ 
   |_|  \____/|_____/ \____/(_)    https://patorjk.com/software/taag                          
*/
// import Modal from "react-bootstrap/Modal";
// import "bootstrap/dist/css/bootstrap.min.css";
//import { doLog } from './Helpers';
/** 
 * alternative to import is use javascript modules. Cant get it to work, however.
 * const BBBB = require('./components/ComponentAjaxToUListInFile');
 * const myComponent = new BBBB();
 * and in component file: module.exports = { ComponentAjaxToUListInFile, sayHi } ;
 * Something about not mixing import with require ???
**/
// CSS: when doing CSS as an object in JSX, convert kebab-case to camelcase,
//      use comma instead of semicolon AND ADD QUOTES to values ie: '12px', NOT 12px
 
var paramsInJSON_1 = { bb: {name: "apple", color: "red" }}
var paramsInJSON_2 = [{ keyy:1, name: "peas", color: "green" },
						{ keyy:2, name: "cheese", color: "yellow" },
						{ keyy:3, name: "grapes", color: "purple" }];

class JsxDemoAclass extends React.Component {
	state = { mouseX: 0, mouseY: 0 , modalOpen1: true, modalMessage1: "aaaaaddddeeee"};
	// constructor(props) {super(props);}

	// to show as external function it works ok
	handleMouseMove(event) {
		this.setState(() =>  ({  mouseX: event.clientX  }) )
		this.setState(() =>  ({  mouseY: event.clientY  }) )
    }

	componentDidMount() {
		// all of the below work ok
		//document.addEventListener("mousemove", (mouseEvt) =>  (this.handleMouseMove(mouseEvt)));
		document.addEventListener("mousemove", (mouseEvt) =>  { 
			this.setState({  mouseX: mouseEvt.clientX  })
		    this.setState(() =>  ({  mouseY: mouseEvt.clientY  }) )});
	}
	componentWillUnmount() {
		document.removeEventListener("mousemove", (mouseEvt) =>  (this.handleMouseMove(mouseEvt)));
		//window.removeEventListener("mousemove", this.handleMouseMove)
	}
					
	var2 = 453255;
	//shorthand for: handleClick2(e)  { // function handleClick2(e)  {
	handleClick2 = (e) => {  
		// NOTE: ARROW NOTATION MAKES BIND() UNNECESSARY IN CONSTRUCTOR! it takes "this" from context so bind is not necessary.
		let bob = a => a + 100; // shortand for function def'n' // The let statement declares a block-scoped local variable
		e.currentTarget.innerHTML = e.currentTarget.innerHTML + '-clicked';
		console.log('state: ' + this.state.stateVariableA);
		e.currentTarget.className = e.currentTarget.className + ' styleBlueBorder css_mouseover';
		paramsInJSON_2.map(item => {
			if (item.name === 'grapes') { item.color = 'greenNred'; } return ''; });
		// the react.js way of updating a control in real time.
		// First dont say this.state =, because it won't trigger an update
		// instead call setState() with a call back (anonymous method in this example)
		// Setstate causes an update when react.js wants to do it, and since a
		// control is bound to stateVariableA (see below) it reflects new value upon update
		this.setState(() =>  ({  stateVariableA: bob(44)  }) )
		//testAjaxJsonCall();
	}
	
	doMath = () => { return('math: ' + 444 * 2) }
	doMath2 = (mynumber) => { return('math: ' + mynumber * 2) }  // NO overloading!
	
	render() {
		return (
		// <style>NOT done using this tag: JSX uses: import './App.css';</style>
		<div className="App">
		{/* below modified for react from this css: font-size: 1.1em; font-weight: 700; */}
		<div style={{ fontSize: '1.1em', fontWeight: '700' }}>
			this is the CLASS Component demo, demoA_classComponens/JsxDemoA.js.<br/>
			If learning react, the way to go is FUNCTION components; this project has this ported to function in other section.
		</div>
			{/* need inline style to setup grid. jsx forces to use css object, so stuff is not camelcase 
			and has commas instead of semicolons. */}
			{/* repeat(5, 1fr) means 1fr 5 times  same as (1fr, 1fr, ....)  */}
			{/* 1/3 means start at 1 and stop at 3, so its 1 and 2 but not 3 */}
			<div id='topOfGrid' 
				style={{ display:'grid', gridTemplateColumns: 'repeat(5, 1fr)' }} >
			<div className='css_1, gridA' 
					style={{ fontSize:'10pt', fontFamily:'courier new', fontWeight:800,
					borderWidth:4, borderColor:'red' }} >
				JMapListItemTemplate<JMapListItemTemplate theList={paramsInJSON_2} />
			</div>
			<div id='mouseMoveDisp' style={{ display:'grid', gridTemplateColumns: 'repeat(2, 1fr)', 
				height: 'fit-content', border: '4px solid green'}} >
				<div> mouseX: </div><div>{this.state.mouseX}</div><div>mouseY: </div><div>{this.state.mouseY}</div>
			</div>
			<div className='gridA'>
			<JMapTableComponent theList={paramsInJSON_2} />
			</div>
			<div style={{fontWeight: 900, backgroundColor: '#ccffcc'}} className='gridA' >
				{/* reactjs state
				flavor: {this.state.flavor} stateVariableA: {this.state.stateVariableA} */}
			</div>
			<div className='gridA' >
				DemoComponent- WithProps
				<DemoComponentWithProps name="apple" color="red" />
			</div>
			<div className='gridA'  >shows how to use bracket to insert javascript
			{ 'math: ' + 234 * 2 } doMath: { this.doMath() } doMath2(333): { this.doMath2(333) }
			</div>
			{/* reactjs wants onclick ..to be a function */}
			<div className='css_1'
					onClick={ function(zzz) { 
						console.log(zzz.currentTarget.getAttribute('mycolor'));}} 
					mycolor={'blue attr'} >
				jsx onClick show attr. REACT_APP_flavor2 {process.env.REACT_APP_flavor2} <br/>
				attribute "mycolor" (doesnt work):  { 8*8 }
			</div>
			<ComponentA param={paramsInJSON_1} />
			<ComponentC param={paramsInJSON_2[0]} />
			<ComponentC param={paramsInJSON_2[1]} />
			<div onClick= {this.handleClick2} 
					className='css_scriptFont'
					style={{backgroundColor: 'lightblue', color:'black'}}>
						ABC handleClick2() adds a css style
			</div>
			{/* because its jsx, style has camelcase and commas .. */}
			<div className='css_1' onClick= {this.handleClick2} >
				JJJ handleClick2()  has inline css jsx-style</div>
			<div className='css_1' 
					style={{ gridRow: '1/4', color:'#ff0000', borderColor:'#00FFFF' }} >
				Fetch() demo using component in separate module
				<ComponentAjaxToUListB  
					// dataToShow={ ComponentAjaxToUListB.state.webSvcResultData }
					// dataToShow={ oneComponentAjaxToUListB.webSvcResultDataStart }
					soupOfTheDay={ 'beefBarley' } /> 
			</div>
			</div>{/* topOfGrid  */}
			
		
		</div>
		);
	}

}
export default JsxDemoAclass;

// these are reactjs "components"
function ComponentA(jsonObjA) {
  // ES6 Spread operator is used to combine the 2 style objects. More complicated than html css!
  return <div className='css_1, css_2' > { 1 + 3 } ComponentA<br /> {jsonObjA.param.bb.name} {jsonObjA.param.bb.color}</div>;
}
function ComponentC(jsonObjA) {
  //console.log("hello " + process.env.NODE_ENV)
  var retVal = <div className='styleRedBorder, css_1,  css_mouseover'>
	        ComponentC with hover  {jsonObjA.param.name} {jsonObjA.param.color}<br/>
			flavor2 from launch.json env: {process.env.flavor2} eee<br/>
			process.env.NODE_ENV: {process.env.NODE_ENV} END
	      </div>;
  return retVal;
}
function DemoComponentWithProps(props) {
	return <div id='div1' className='styleRedBorder'
	         // jsx inline css
			 style={{ backgroundColor: 'pink', fontWeight: 900}}>DemoComponentWithProps using multiple properties<br/> name: {props.name} <br/>color: {props.color}</div>;
}
function JMapListItemTemplate(jsonObjA) {
	return (<div>JMapListItemTemplate.. 
		       <ul className='css_3'>
				   {jsonObjA.theList.map(
					   item => <li key={item.keyy}>key: {item.keyy}, name2: {item.name}, color2:{item.color}
			</li>)}</ul></div>)
}

/* SAVE THIS EXAMPLE OF XML POST DATA WITH JSON RESPONSE
fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/xml' }, 
        body: new XMLSerializer().serializeToString(xmlObject)
      })
      .then(gotToPassToNext => { console.log("response.headers.get('content-type'): " + 
                  gotToPassToNext.headers.get('content-type')); return gotToPassToNext;})
      .then(response => response.json()) // shortcut for parsing json from response body and returning it to the next in chain
      .then(jsonObjectNow => console.log("json data: " + jsonObjectNow.flavor +
           "\nwhole object: " + JSON.stringify(jsonObjectNow)))
      .catch((error) => {
        console.error('Error:', error);
      });
// these may cause headers to be blank--->   mode: 'no-cors', // no-cors, *cors, same-origin
// SAVE THIS EXAMPLE WITH XML RESPONSE
fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/xml' }, 
        body: new XMLSerializer().serializeToString(xmlObject)
      }) // NOTE: promises in the chain CHANGE "response" into different types
      .then(gotToPassToNext => { console.log("response.headers.get('content-type'): " + 
                  gotToPassToNext.headers.get('content-type')); return gotToPassToNext;})
      // fetch doesn't have a quick xml parse as it does for JSON, so to this:
      .then(response => response.text()) // EATS all input stream, returns text to next promise
      .then(response => new DOMParser().parseFromString(response, "application/xml"))
      .then(xmlObjectNow => {
            console.log("xml flavor : " + xmlObjectNow.getElementsByTagName("flavor")[0].textContent +
               "\nwhole object: " + new XMLSerializer().serializeToString(xmlObjectNow))
      })

      .catch((error) => {
        console.error('Error:', error);
      });
*/

/*
// "arrow functions" examples paste into chrome "inspect" console
console.log((a => a + 100)(2));  
zz = ((a, b) => a + b + 100)(4,3);
console.log(zz);
fcnB = (a, b) => a + b + 200;
console.log(fcnB(2,3));
fcnC = (a, b) => {
  let qq = 400;
  return a + b + qq;
}
console.log(fcnC(2,3));

----------------------
// this is a timer
var obj4 = {
    count : 10,
    doSomethingLater : function() { 
          //setTimeout(function() { // fails because count is outside scope of callback
          setTimeout( () => { // since the arrow function was created within the "obj", it assumes the object's "this"
            this.count++;
            console.log(this.count);
			// obj4.doSomethingLater(); // infinite loop
        }
		, 1000);
    }
}
obj4.doSomethingLater();
------------------
// more arrow functions
var arguments = [1, 3, 12];
var arr1 = () => arguments[2]; // arrow fcn takes no params and returns...
arr1(); // 1
console.log(arr1());
var arr2 = (x) => arguments[x];
console.log(arr2(1));
> 12
> 3
------------------------
3 DOTS "SPREAD SYNTAX OF ES6"
function foo(n) {
  var f = (...args) => args[1] + n; // 0 gives 14, 1 is 8
  return f(10, 4);
}
console.log(foo(4)); 
returns 14 or 8 
--------------------
function foo(...args) {
  return (args[0] + args[1]);
  // return (args.length);
}
console.log(foo(4, 2, 11)); 
> 6
--------------------
foo = (...args) => args.length;
foo2 = (...args) => args[2];
//   curly brace means returns an object instead of number
foo3 = (...args) =>  ({ arrLength: args.length, second: args[1] });
console.log(foo(4, 2, 11) + '  ' + foo2(4, 2, 11));
console.log('returns state sort of: ' + foo3(4, 2, 11).arrLength);
> "3  11"
> "returns state sort of: 3"
*/
/*
{ mode: 'cors', // no-cors, *cors, same-origin
	     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		 credentials: 'same-origin' // include, *same-origin, omit
       } )
	   */
// react & jsx does css weird. All examples seem to use style objects instead of css class 
// style object uses commas instead of semicolons and camelcase as in css because they are lists
// var css_1 = { fontSize:'10pt', padding : '2pt',  textAlign: 'left', border: 'solid 6px #ff0000' };
// var css_2 = { border: 'solid 8px #00ff00' };
// console.log('**this is how style object works: css_1.fontSize: ' + css_1.fontSize);
// // the 3-dot thing is the ES6 spread operator, spreads out elements of an iterable object
// var css_3 = {...css_1, ...css_2}; // inheritance css!
// var css_4 = { ...css_1, color:'#ff0000', borderColor:'#00ffff' };
// shows how inheritance works in jsx css
//console.log( '...css_1 is: ' + JSON.stringify(css_1) );
//console.log( '...css_4 is: ' + JSON.stringify(css_4) );
//var button2 = { borderRadius: '20px', fontSize: '11pt', padding: '2pt', 
//	            border: '5px solid #777777', padding: '5px', background: '#89fcff' }
