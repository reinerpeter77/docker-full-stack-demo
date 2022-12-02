import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 
// need curly brackets if not exported as default, else ambiguous error message occurs

import { JsxDemoA } from './demoA_fnComponents/JsxDemoA';
import JsxDemoAclass from './demoA_classComponents/JsxDemoA';
import { WebSockSndStreamA } from './webaudio/WebSockSndStreamA.js';
import { DemoSocketAndSound } from './webaudio/DemoSocketAndSound.js';
// import JsxDemo_noImports from './JsxDemo_noImports';
// import JsxDemoCSS_object from './JsxDemoCSS_object'
import FormsTest from './demoA_classComponents/FormsTest';
import DemoHookFn from './demoA_classComponents/DemoHookFn'; 

// for below, run... npm install react-router-dom  ...it allows different url's
// not put here by: npx create-react-app react_app1 
// import {  BrowserRouter as Router,   Switch,  Route, Link } from "react-router-dom";
import {  BrowserRouter as Router, Route, Link } from "react-router-dom";
import { TabContent } from 'react-bootstrap';

ReactDOM.render(
  <React.StrictMode>
    <div style={{ fontSize: '0.5em', backgroundColor: '#ffff00', width: 'fit-content' }} >
      ....this div is from containerSetups/frontend/react/src/index.js</div>
    <DoAllTheRendering />
  </React.StrictMode>,
  // below div is in index.html
  document.getElementById('root_div_which_gets_populated_by_indexjs')
);

function DoAllTheRendering() {
  // console.log("render color99 is: " + color99)
  return (
    <Router>
      <main>
      <div>
          {/* set up routes to .js pages */}
          <Route path="/JsxDemoA_url">
            <JsxDemoA /> {/* demo using more modern "function components" */}
          </Route>
          <Route path="/JsxDemoA_class_url">
            <JsxDemoAclass /> {/* demo using old-style "class components" */}
          </Route>
          <Route path="/WebSockSndStreamA_url">
            <WebSockSndStreamA /> 
          </Route>
          <Route path="/DemoSocketAndSound_demo_url">
            <DemoSocketAndSound /> 
          </Route>
          <Route path="/FormsTest_url">
            <FormsTest />
          </Route>
          <Route path="/DemoHookFn">
            <DemoHookFn />
          </Route>
          {/* Now show the links to the paths setup above
              "exact" below says show only component, dont just add it to page */}
          <Route exact path="/"
            component={ThisFunctionSetsUpVisibleLinksForPaths}
          />
        {/* </Switch> */}
      </div>
      </main>
    </Router>
    );
  }
  
  function ThisFunctionSetsUpVisibleLinksForPaths() {
    return <div>
        <nav>
          <br/><Link to="/JsxDemoA_url">JsxDemoA using function components</Link> 
          <br/><Link to="/JsxDemoA_class_url">JsxDemoA using (old style) class, not function for components</Link> 
          
          <br/><Link to="/WebSockSndStreamA_url">WebSockSndStreamA</Link> 
          <br/><Link to="/DemoSocketAndSound_demo_url">DemoSocketAndSound</Link> 
          {/* <br/><Link to="/JsxDemo_noImports_url">JsxDemo_noImports</Link>   */}
          {/* <br/><Link to="/JsxDemoCSS_object_url">JsxDemoCSS_object</Link>  */}
          <br/><Link to="/FormsTest_url">FormsTest</Link> 
          <br/><Link to="/DemoHookFn">DemoHookFn</Link> 
        </nav></div>;
  }


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//////////////reportWebVitals();
export default DoAllTheRendering;
