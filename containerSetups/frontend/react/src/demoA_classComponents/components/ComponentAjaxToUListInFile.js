import '../../App.css';
// import React from 'react';
import React, { Component } from 'react';
// import { Helpers } from '../../Helpers.js'
import { WebSvcHelper } from '../../net_utils/WebSvcHelper.js';

/*
  _______ ____  _____   ____    
 |__   __/ __ \|  __ \ / __ \ _ 
    | | | |  | | |  | | |  | (_)
    | | | |  | | |  | | |  | |  
    | | | |__| | |__| | |__| |_ 
    |_|  \____/|_____/ \____/(_)    https://patorjk.com/software/taag                          
*/
// TODO need "bootstrap" library by running: "npm i react-bootstrap bootstrap" When you do this, an entry gets added 
//      to package.json, so it never need run again.  So after that, just run "npm install" instead, 
//      such as setting up or updating a cloud instance. Dont forget remove/rebuild docker image too when you do this.
// 2 imports added to get modal dialog provided by the "bootstrap" library.
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

let webSvcHelperA = new WebSvcHelper('sweet'); 

export default class ComponentAjaxToUListB extends Component {
    constructor(props) {
        super(props);
        this.doClickA = this.doClickA.bind(this); // if use arrow  function declaration, dont need this line...
        //not needed because using ARROW FUNCTION: this.okCallBackAjax = this.okCallBackAjax.bind(this);
    }
    count = 0;
    listDataAsJSON_AStart = 
            [{ flavor: "peas", color: "green7" }, { flavor: "cheese", color: "yellow" }]

    // initialize the state for this class instance "this". calls to setState() trigger re-render 
    state = { listDataAsJSON_A: this.listDataAsJSON_AStart, countstate: 0, modalOpen1: false, modalMessage1: "" };

    doClickA() {
        console.log("doClickA called")
        console.log('asf ' + this.listDataAsJSON_AStart[0].color +
                      '\nstate: ' + this.state.listDataAsJSON_A[0].color + 
                      ' countstate: ' + this.state.countstate + 
                      ' count: ' + this.count)
        this.listDataAsJSON_AStart[0].color = "chartreuse";
        this.count++;
        this.setState({ listDataAsJSON_A: this.listDataAsJSON_AStart })
    }

    componentDidMount = () => {
        this.setState({ modalMessage1: 'componentDidMount' });
        // setTimeout(() => { 
        //     console.log("timeout.."); 
        //     this.setState({modalOpen1: false, modalMessage1: 'asdf' });
        //     console.log("timeout done...z.");
        // }, 2000);
    }

    //ComponentAjaxToUListInFile(props) {
    render() {
	    return ( <div id='jsxWantsTopLevelElementSoThisIsIt'>
            <div className='button2' 
                onClick={() => {
                   var springBootPort = "8086";
                   var remoteURL = window.location.protocol + '//' + window.location.hostname + 
                            ':' + springBootPort + '/eatFruitArrayOutputArray'; 
                   // helpr.runAjaxAndCallFcn(remoteURL, this, this.okCallBackAjax, this.handleAjaxError) 
                   webSvcHelperA.fetchWebSvcAssumeJSONdata(remoteURL, this, this.webSvcCallback);
                   }} >
                Test web service call (success if service is up)
            </div>
            
            <div 
                onClick ={() => {  // use arrow notation for force "this" to be this page, not the div
                              this.doClickA(); 
                              this.setState({modalOpen1: true, modalMessage1: 'reset clicked with timeout!' });
                              setTimeout(() => {this.setState({modalOpen1: false });}, 750);
                            }}
                className='button2' >reset data. doClickA() ..count: {this.count}
            </div>
            <div id='myDataIsAJsonObjectInReactObjectState' 
                    className='css_1, gridA'>HH
                {/* WARNING: BIND JMapLoadFetchDataToHtmlList TO THIS OBJECT IN CONSTRUCTOR
                IE: this.JMapLoadFetchDataToHtmlList = this.JMapLoadFetchDataToHtmlList.bind(this);
                OTHERWISE setState stuff gets very and mysteriously messed up! */}
                data:<this.JMapLoadFetchDataToHtmlList  theList={ this.state.listDataAsJSON_A } />

            </div>
            {/* Modal comes from bootstrap library. It is a popup window with message */}
            <Modal show={this.state.modalOpen1} >
                <Modal.Body><font size="33pt">this is the modal {this.state.modalMessage1}</font></Modal.Body>
                {/* use arrow notation for force "this" to be this page, not the div */}
                <button onClick={() => this.setState({modalOpen1: false})}>Cancel</button>
            </Modal>
		</div> 
        )
    }

    // use arrow notation for force "this" to be this page, not caller of this fcn
    webSvcCallback = (reactComponent, returnedData, status) => {
		// console.log("webSvcCallback a: " + status);
		if (status === "error") {
            console.log(returnedData);
            this.setState({modalMessage1: returnedData, modalOpen1: true});
            setTimeout(() => {this.setState({modalOpen1: false});}, 2000);
            return;
        }   
		// eatFruitArrayOutputArray returns a JSON array
        this.setState({listDataAsJSON_A: returnedData, countstate: this.count,
                       modalMessage1: 'ajax success 2', modalOpen1: true});
        setTimeout(() => {this.setState({modalOpen1: false });}, 900);
	}

    JMapLoadFetchDataToHtmlList(props) {
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
//export { ComponentAjaxToUListB }
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