import React, { useState, useEffect  } from "react"
// import ReactDOM from 'react-dom';
//import randomcolor from "randomcolor" // for useEffect demo from scrimba

// RUN NPM START TO START THE DEVELOPMENT BUILDER/SERVER
// this is a "functional component", not a "class component"
// react hooks, demoed here allow functional components to handle lifecycle events, which
//     already work in class components.

function DemoHookFn() {
    /** useState() is the hook function way of letting a function component
     * (versus a class component) in react.js of having a "state variable".
     * seems sort of complicated why not just call it state?
     **/
    const [turtle, turtleHookFn] = useState("thisIsTheDefaultValueOfTurtle"); 
    var [styleColorAttr, colorHookFn] = useState("green");
    const [isChanged, isChangedHookFn] = useState(false);
    var [mouseX, mouseXHookFn] = useState(0);
    var [mouseY, mouseYHookFn] = useState(0);
    // useEffect is a lifecycle feature of react.js
    // useEffect runs at every render of page! It is a react builtin hook
    useEffect(() => { 
          var intervalHandleA;
          var ct = 0;
          console.log('useEffect')
          intervalHandleA = setInterval( // anonymous function run at interval
            () => { console.log("count: " + ct++); 
                    if (ct > 2) clearInterval(intervalHandleA); }, 1000)
          return () => {
              clearInterval(intervalHandleA);
              console.log("useEffect.return() invoked, usually by a refresh hook or setState");
          }
        }, // BUG: this by itself causes endless re-render loop!
        [isChanged, turtle] // inside array, watch for variables which change. 
        // If no change, fcn not called.
        // if empty array, gets run at startup only
    );

    useEffect( () => {
        window.addEventListener("mousemove", handleMouseMove)
        return () => {  // stop mouse listener when goto other component
          window.removeEventListener("mousemove", handleMouseMove)
        }  
      }, [] // empty array says run only at startup
    );

    //var mouseX;
    function handleMouseMove(event) {
        /////mouseX = event.clientX;
        /////console.log("mouseX: " + mouseX + " mouseY: " + event.clientY);
        mouseXHookFn(event.clientX);
        mouseYHookFn(event.clientY);
    }

    function addDoughnut() {
        // call turtleHookFn using anonymous function as argument which adds doughnut to turtle
        turtleHookFn(nuts => nuts + " doughnut"); 
    }
    
    return (
        
        <div style={{color: styleColorAttr, border: '2px solid black'}}>hook demo<br />
        turtle value: {turtle}  &nbsp; styleColorAttr value: {styleColorAttr} <br/>
        <div id='topOfGrid' style={{ display:'grid', gridTemplateColumns: 'repeat(4, 1fr)', 
            border: '4px solid green', width: '30%'}} >
          <div> mouseX: </div><div>{mouseX}</div><div>mouseY: </div><div>{mouseY}</div>
        </div>
        {/* function as onClick arg is used because it binds colorHookFn() to this 
            component-function. Otherwise its bound to the button itself, and 
            colorHookFn() only acts on the button */}
        <button onClick={() => { turtleHookFn("whiskey2"); isChangedHookFn(!isChanged);} }>invoke turtleHookFn() and change color</button><br />
        {/* this takes the old value of turtle and adds toast to it */}
        <button onClick={() => turtleHookFn(old => "toast " + old)}>invoke turtleHookFn with old value </button><br />
        {/* this doesnt use the hook function, it uses a regular function instead which calls hook fcn */}
        <button onClick={addDoughnut} >invoke hook via fcn</button><br />
        <button onClick={() => colorHookFn('red')} >styleColorAttr hook fcn. React causes a page redraw</button><br />
        <button onClick={() => colorHookFn('blue')} >styleColorAttr hook fcn2. React causes a page redraw</button><br />
        <button onClick={() => styleColorAttr = 'yellow'} >set styleColorAttr direct-doesnt work</button><br />
        </div>)
        //colorHookFn(color); //randomcolor()); // colorHookFn triggers a re-render
}

export default DemoHookFn