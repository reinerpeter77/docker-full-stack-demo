import '../../App.css';
// import React from 'react';
import React, { useState, useEffect, useRef } from 'react';
// import { Helpers } from '../../Helpers.js'
import { WebSvcHelper } from '../../net_utils/WebSvcHelper.js';

// when adding bootstrap to a project run this, which adds it to node_modules and adds
// and entry to package.json: "npm i react-bootstrap bootstrap" 
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

function ComponentAjaxToUListB() {
    let webSvcHelperA = new WebSvcHelper('sweet'); 
    const listDataAsJSON_AStart = 
        [{ flavor: "peas", color: "green7" }, { flavor: "cheese", color: "yellow" }]

    /** state variables: 
     * useState() for those which trigger screen redraw
     * useRef() for no redraw. DONT FORGET TO USE .current when referencing
     */
    var [ listDataAsJSON_A, setListDataAsJSON_A ] = useState(listDataAsJSON_AStart)
    var [ modalOpen1, setModalOpen1 ] = useState(false)
    var [ modalMessage1, setModalMessage1 ] = useState("not init")
    var countstate = useRef(0);

    function doClickA() {
        console.log("doClickA called")
        console.log('asf ' + listDataAsJSON_AStart[0].color +
                      '\nstate: ' + listDataAsJSON_A[0].color + 
                      ' countstate: ' + countstate)
        var theCopy = [...listDataAsJSON_AStart]; // "spread operator" makes a JSON clone
        theCopy[0].color = "chartreuse";
        setListDataAsJSON_A(theCopy)
        countstate.current = countstate.current + 1; // there is also a shorcut thing for this
    }

    // [] empty: run only once when component mounts like componentDidMount
	useEffect(() => { 
        // setup bootstrap modal box with message and make it visible
		setModalMessage1("component has mounted"); setModalOpen1(true);
        // setTimeout takes args anonymous function and a timeout in milliseconds.
        // make anonymous function using "arrow notation"
        setTimeout(
            () => { console.log("component mounted"); setModalOpen1(false); }, 
            400 );
	  }, []);

    return ( 
        <div id='jsxWantsTopLevelElementSoThisIsIt'>
            function ComponentAjaxToUListB<br />
        <div className='button2' 
            onClick={() => {
                var springBootPort = "8086";
                var remoteURL = window.location.protocol + '//' + window.location.hostname + 
                        ':' + springBootPort + '/eatFruitArrayOutputArray'; 
                // helpr.runAjaxAndCallFcn(remoteURL, this, this.okCallBackAjax, this.handleAjaxError) 
                webSvcHelperA.fetchWebSvcAssumeJSONdata(remoteURL, this, webSvcCallback);
                }} >
            Test web service call (success if service is up)
        </div>
        
        <div 
            onClick ={() => { doClickA(); 
                            // show the bootstrap-modal box
                            setModalMessage1('reset clicked with timeout!');
                            setModalOpen1(true)
                            setTimeout(() => {setModalOpen1(false)}, 750);
                        }}
            className='button2' >reset data. doClickA() ..count: {countstate.current}
        </div>
        <div id='myDataIsAJsonObjectInReactObjectState' 
                className='css_1, gridA'>
            data:<JMapLoadFetchDataToHtmlList  theList={ listDataAsJSON_A } />

        </div>
        {/* Modal comes from bootstrap library. It is a popup window with message */}
        <Modal show={modalOpen1} >
            <Modal.Body><font size="33pt">this is the modal {modalMessage1}</font></Modal.Body>
            {/* use arrow notation for force "this" to be this page, not the div */}
            <button onClick={() => setModalOpen1(false)}>Cancel</button>
        </Modal>
    </div> 
    )

    function webSvcCallback(reactComponent, returnedData, status) {
		// console.log("webSvcCallback a: " + status);
		if (status === "error") {
            console.log('webSvcCallback: ' + returnedData);
            setModalMessage1(returnedData); setModalOpen1(true);
            setTimeout(() => { setModalOpen1(false); }, 900 );
            return;
        }   
		// eatFruitArrayOutputArray returns a JSON array
        setListDataAsJSON_A(returnedData);
        countstate.current = countstate.current + 1;
        setModalMessage1('ajax success 2'); setModalOpen1(true);
        // setTimeout takes args anonymous function and a timeout in milliseconds.
        // make anonymous function using "arrow notation"
        setTimeout(() => { setModalOpen1(false); }, 900 );
	}

    function JMapLoadFetchDataToHtmlList(props) {
        var JSONdata = props.theList;
        return (<div className='css_1' 
                     style={{ color:'#ff0000', borderColor:'orange' }}> 
                  JMapLoadFetchDataToHtmlList=== 
                  <ul style={{ color: 'purple' }}>
                      {JSONdata.map(
                          item => <li key={item.flavor}>flavor: {item.flavor}, color:{item.color}</li>)}
                  </ul>
                  </div>)
    }
}
export { ComponentAjaxToUListB } 
// export default ComponentAjaxToUListInFile;
// success and failure handlers for ajax call

    // Can assign function 2 ways: regular and arrow function.
    // if using regular, the function must be bound to this object with 
    // this line: "//this.okCallBackAjax = this.okCallBackAjax.bind(this);"
    // Instead, using arrow syntax creates function in real time and binding is not necessary.
    // The regular way:
    // okCallBackAjax(reactComponent, JSONdataObject) {
    //     console.log('okCallBackAjax');
    //     this.setState({listDataAsJSON_A: JSONdataObject, countstate: this.count});
    //     reactComponent.setModalOpen1("ajax success");
    // }
    // the arrow function way (no bind needed):