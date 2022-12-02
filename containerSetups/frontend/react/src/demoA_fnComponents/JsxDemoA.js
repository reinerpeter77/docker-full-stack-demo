
import '../App.css'; // this pulls css into the render() stuff. Dont need <style> tag!
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { JMapListItemTemplate, JMapTableComponent}  from './components/JMapTableComponent';
import { ComponentAjaxToUListB } from './components/ComponentAjaxToUListInFile';
var QRCode = require('qrcode');

var paramsInJSON_1 = { bb: {name: "apple", color: "red" }}

function JsxDemoA( props ) {
	// state variable: useState() for those which trigger screen redraw, otherwise useRef()
	var [mouseX, setMouseX] = useState(-1000); 
	var [mouseY, setMouseY] = useState(-1000);
	var [modalMessage1, setModalMessage1] = useState("bbbbb"); 
	var [modalOpen1, setModalOpen1] = useState(false);
	var refVariableA = useRef(48888)
	var qrcanvas = useRef();
	const jsonA = [{ keyy:1, name: "peas", color: "green" },
			{ keyy:2, name: "cheese", color: "yellow" },
			{ keyy:3, name: "grapes", color: "purple" }
		   ];
	// const jsonB = 
	//     { allstuff: [{ keyy:1, name: "peas", color: "green" },
	// 	{ keyy:2, name: "cheese", color: "yellow" },
	// 	{ keyy:3, name: "grapes", color: "purple" }]
	// 	};
	var [ dataJSON_2, setJSON2data] = useState(jsonA);
	var [ xyz, setxyz ] = useState(4)

	
	/* React function component has advantage over class component because:
	*   - it lets you access dom components easily [search for "thisReactNode" to see how it works]
	*   - use of class for react components is wonky and has lots of arrow functions and weird bindings...
	*  There are 3 'hook functions' used here for react function components:
	*    useState(), useRef() and useEffect. 
	*    Their purpose is to be called by the framework as "lifecycle events", that is the framework calls them
	*    either when the component first mounts (1 time) or every time it renders or whenever a state variable
	*    changes. 
	* 1. useEffect() is called by the framework conditionally according to second array argument.
	*    It is named "useEffect()" because the name "elbow" was already taken; there is an actual
	*    reason but I don't care.
	*    If second argument is:  
	*   + missing: run every time. Good for getting dimensions of window etc
	*   + [] empty: run only once when component mounts like componentDidMount
	*   + [aa, bb]: do only when aa or bb changes
	*   + [] empty and returns function: runs when component unmounts
	* 2. "useState" sets up a variable which perists between renders and queues a render when its value is changed.
	* 3. "useRef" lets you name a dom element and reference it in the code.
	*/
	const thisReactNode = useRef();

	// [] empty: run only once when component mounts like componentDidMount
	useEffect(() => { 
		// set up a callback "doMoveTouchOrMouse" which gets called whenever mouse moves
		window.addEventListener("mousemove", (mevent) =>  { doMoveTouchOrMouse(
			mevent, thisReactNode.current, mevent.clientX, mevent.clientY);
		});
		doQRcode();
		console.log('useEffect run component has mounted')
	  }, []);

	useEffect(() => { 
		console.log('useEffect dataJSON_2')
	  }, [dataJSON_2, xyz]);

	// [] empty and returns function: gets called when component is unmounted
	useEffect(() => {
		return (() => { 
			// window.removeEventListener("mousemove", (mevent) =>  { doMoveTouchOrMouse(
			// 	mevent, thisReactNode.current, mevent.clientX, mevent.clientY);
			// });
			console.log('component unmounted') })
	}, []);

	// the QRCode component works by taking a HTML5 canvas that you put in the document and drawing a QRCode into it
	// It lets you easily get the site on you phone (requires server and phone on same subnet).
	// First set you browser to the true IP address (not localhost) and then scan it.
	function doQRcode() {
		// SAVE THIS:   to get url (not localhost) and open in browser, on dev machine run this:
		// on pc, run "hostname -I" to get ip. Below is a script which should extract needed parts of result:
    // foo=http://$(hostname -I | sed "s/ *$//g"):3000; google-chrome $foo;
		// on ubuntu:
		// first to "ipconfig | grep IPv4" to see which line to choose below
		// ipconfig | grep IPv4 | sed -n '4 p'| sed -n -e 's/.*: //p'
		//                                ^ line 3           ^^^ all stuff before colon
		// -n means not to print anything by default. -e is followed by a sed command. s is the pattern replacement command.
    var myURL = window.location.href;
    console.log(myURL)
    QRCode.toCanvas(qrcanvas.current, myURL, { width: 99 }, function (error) {
      if (error) console.error(error); console.log('success!');})
	}

	function doMoveTouchOrMouse(evt, theNode, x, y) {  
		//console.log('x ' + x + ' y ' + y)
		// these are useState things calling them causes a redraw of screen (partial?)
		setMouseX(x); setMouseY(y); 
		return false;
	}
			
	function doMath() { return('math: ' + 444 * 2) }
	function doMath2(mynumber) { return('math: ' + mynumber * 2) }  
	
	/** shows how to modify a JSON object using the map function.
	 * also shows what to do when JSON data is a setState() thing, which we use because when it gets
	 * changed, the page gets refreshed, showing the new change.
	 */
	function modifyJSONdata(e) {  
		e.currentTarget.className = 'styleBlueBorder';
		// first make a clone and change the clone
		var tempObj2 = [... dataJSON_2]; //"spread operator" clones JSON
		//var tempObj2 = Object.assign(dataJSON_2); // this works also
		// now use map, which works like a "for" loop. 
		tempObj2.map(rowItem => { 
			if (rowItem.name === 'cheese') { rowItem.color = 'blue-green'; }; 
		})
		// calling the setState() setter causes a redraw showing the new data
		setJSON2data(tempObj2)
	}

	return (
	  <div ref={thisReactNode} className="App" >
		{/* below modified for react from this css: font-size: 1.1em; font-weight: 700; */}
	  <div style={{ fontSize: '1.1em', fontWeight: '700' }}>
			this is the FUNCTION Component demo, demoA_fnComponens/JsxDemoA.js. React started out using class components
			then decided function components are better so use it instead.<br/>
	  </div> 
		{/* need inline style to setup grid. jsx forces to use css object, so stuff is not camelcase 
		and has commas instead of semicolons. */}
		{/* repeat(5, 1fr) means 1fr 5 times  same as (1fr, 1fr, ....)  */}
		{/* 1/3 means start at 1 and stop at 3, so its 1 and 2 but not 3 */}
		<div id='gridHolder' // below says make 5 sub-things of 1 fractional unit (fr) each
			style={{ display:'grid', gridTemplateColumns: 'repeat(5, 1fr)' }} >
			<div className='css_1, gridA' 
					style={{ fontSize:'10pt', fontFamily:'courier new', fontWeight:800,
					borderWidth:4, borderColor:'red' }}   >
				{/* WARNING: if onClick is in JMapListItemTemplate div, JMapListItemTemplate WONT UPDATE! */}
				<div style={{ background:'#00ffff' }}  onClick= {modifyJSONdata} className={'styleRedBorder'} >
					demo of JMapListItemTemplate<br/>
					Click here to modify json data and it updates here</div>
					<JMapListItemTemplate theList={dataJSON_2} />
				</div>
				<div id='mouseMoveDisp' style={{ display:'grid', gridTemplateColumns: 'repeat(2, 1fr)', 
					height: 'fit-content', border: '4px solid green'}} >
					<div> mouseX: </div><div>{mouseX}</div><div>mouseY: </div><div>{mouseY}</div>
					<div>qrcanvas:<br/><canvas ref={qrcanvas}  ></canvas></div>
				</div>
				<div className='gridA'>
					demo of JMapTableComponent
					<JMapTableComponent  theList={dataJSON_2} />
				</div>
				{/* style={{ gridRow: '1/4' */}
				<div className='css_1' style={{ color:'#ff0000', borderColor:'#00FFFF' }} >
				 Fetch() demo <br/>
					<ComponentAjaxToUListB  
						// dataToShow={ ComponentAjaxToUListB.state.webSvcResultData }
						// dataToShow={ oneComponentAjaxToUListB.webSvcResultDataStart }
						soupOfTheDay={ 'beefBarley' } /> 
				</div>
				<div style={{backgroundColor: '#ccffcc'}} className='gridA'
				   onClick={ (e) => { 
						 let anonymouseFnA = a => a + 100; // shortand for function def'n' // The let statement declares a block-scoped local variable
		         setxyz(anonymouseFnA(22));  
						 refVariableA.current = anonymouseFnA(44); 
						 e.currentTarget.innerHTML = e.currentTarget.innerHTML + '-clicked';
		       }} >
					click to test useRef() and useState()<br />
					refVariableA: {refVariableA.current} <br/> xyz: {xyz}
				</div>
				<div className='gridA' >
					DemoComponent- WithProps
					<DemoComponentWithProps name="apple" color="red" />
				</div>
				<div className='gridA'  >shows how to use bracket to insert javascript
					{ 'math: ' + 234 * 2 } doMath: { doMath() } doMath2(333): { doMath2(333) }
				</div>
				{/* reactjs wants onclick ..to be a function */}
				<div className='css_1'
						onClick={ function(zzz) { 
							console.log(zzz.currentTarget.getAttribute('mycolor'));}} 
						mycolor={'blue attr'} >
					jsx onClick show attr. REACT_APP_flavor2 {process.env.REACT_APP_flavor2} <br/>
					attribute "mycolor" (doesnt work):  { 8*8 }
				</div>
			<ComponentA param={paramsInJSON_1} />aa
			<ComponentC param={dataJSON_2[0]} />zz
			<ComponentC param={dataJSON_2[1]} />
			<div onClick= {modifyJSONdata} 
					className='css_scriptFont'
					style={{backgroundColor: 'lightblue', color:'black'}}>
						ABC modifyJSONdata() adds a css style
			</div>
			{/* because its jsx, style has camelcase and commas .. */}
			<div className='css_1' onClick= {modifyJSONdata} >
				JJJ modifyJSONdata()  has inline css jsx-style
			</div>
			
		</div>{/* topOfGrid  */}
			
		
		</div>
		);
}
export { JsxDemoA }; 

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
