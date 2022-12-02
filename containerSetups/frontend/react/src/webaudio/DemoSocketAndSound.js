
import '../App.css'; // this pulls css into the render() stuff
import React from 'react';

// sndHelperA.js has an identical copy under /public which also contains audio worklet. Symbolic links dont work.
// import { sndHelper, color as colorFromSndHelper, STOPNOW } from  "./sndHelperA.js";
import { sndHelper, STOPNOW } from  "./sndHelperA.js";

import { WebSockHelper, TYPE_arraybuffer, TYPE_blob } from '../net_utils/WebSockHelper.js';
import { WebSvcHelper } from '../net_utils/WebSvcHelper.js'; 
import { ReactComponentWhichDoesSoundStream_A } from './WebSockSndStreamA.js'; 

import { TTYStyleOutput } from '../components/TTYStyleOutput.js'; 
// WARNING: delete .eslintcache if weird errors occur describing syntax errors!
// WARNING: delete .eslintcache if weird errors occur describing syntax errors!
// WARNING: delete .eslintcache if weird errors occur describing syntax errors!
// WARNING: delete .eslintcache if weird errors occur describing syntax errors!
/*______ ____  _____   ____    
|__   __/ __ \|  __ \ / __ \ _   get "bootstrap" library by running: "npm i react-bootstrap bootstrap"
   | | | |  | | |  | | |  | (_)  this inserts entry in package.json, so it never need run again. Run "npm install"
   | | | |  | | |  | | |  | |    ...import { Row, Modal } from 'react-bootstrap';
   | | | |__| | |__| | |__| |_ 
   |_|  \____/|_____/ \____/(_)    https://patorjk.com/software/taag                          
*/
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css"; // under node_modules

class DemoSocketAndSound extends React.Component {
	constructor(props) {
		super(props);
		this.webSvcHelprA = new WebSvcHelper('abcd');
		// console.log("import colorFromSndHelper: " + colorFromSndHelper)	
	}

	state = { statusMsg: '', modalOpen1: false, modalMessage1: "modal here",
	  sndStopBtnCSS_Class: 'gridA notEnabled fancyWithRadius', 
	  lnOutput: '-' };
	audioWorkletNodeA;

	setupSine(frequency) {
		var buffTimeSpan = 1;
		var srcBuffLen = sndHelper.SAMPLEPERSEC * buffTimeSpan;
		this.lBuffr = new Float32Array(srcBuffLen);
    	this.rBuffr = new Float32Array(srcBuffLen);
		new sndHelper().fillBuffSineTest(this.lBuffr, this.rBuffr, frequency);
	}
	
	/**
	 * 
	 * @param {*} worketClassName extends AudioWorkletProcessor as defined in workletJSfilePath
	 * @param {*} workletJSfilePath must be under /public cuz web audio api looks there for it. It doesnt know about react.js
	 */
	addNewAudioWorklet(worketClassName, workletJSfilePath) {
		if (this.audioWorkletNodeA != null) { console.log("this.audioWorkletNodeA not null, returning"); return; }
	    var auCon = new AudioContext({ latencyHint: 'interactive', sampleRate: 44100 }); 
		console.log(" numberOfOutputs: " + auCon.destination.numberOfOutputs + " channelCount: " + auCon.destination.channelCount); 
		// other way: audioContext.audioWorklet.addModule(workletJSfilePath).then(xyz =>  { do all stuff in afterModuleAdded() }
		var promiseB = auCon.audioWorklet.addModule(workletJSfilePath);
		// the "then" thing runs after audio module is all setup which can take some time. Use promise so gui thread doesnt block..
		promiseB.then(xyz => {  // use weird arrow function or else "this" is undefined in anonymous function which follows
			this.setupNewAudioWorkletModule(auCon, worketClassName); 
		}); 
	}

	setupNewAudioWorkletModule(audioContext, worketClassName) {
		var audWorketParsJSON = 
		  { // parameters defined by https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode/AudioWorkletNode
			numberOfOutputs: 1, // one output which is the speakers
			outputChannelCount: [2], // 2 channels for stereo OUTPUT through speakers. 
			numberOfInputs:0, // this is start of sound pipeline, so no inputs.
			// processorOptions let me add my own params
			processorOptions:{ drink:'iced tea', pizza:'mushroom and onions thin crust' }  }
		this.audioWorkletNodeA = new AudioWorkletNode(audioContext, worketClassName, audWorketParsJSON);
		// audioWorkletNodeA.addEventListener(jkadsfklldf)
		// now setup the port thing connecting dom to worklet
		// https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode/port#examples
		// setInterval(() => audioWorkletNodeA.port.postMessage('ping'), 2000)
		this.audioWorkletNodeA.port.postMessage('ping'); 
		this.audioWorkletNodeA.port.onmessage = (e) => {
			console.log('audioWorkletNodeA onmessage msgType: ' + e.data.msgType)
			if (e.data.msgType === 'binaryA') {
			  var txt = ("onmessage: " + e.data.msgType + ' .. ' + e.data.msgText + 
						  this.procBinary(e.data.msgBinary));
			  this.appendOutput(txt);
			}
			if (e.data.msgType === 'testBinarySine') {
			  txt = ("onmessage: " + e.data.msgType + ' .. ' + e.data.msgText + 
						  this.float32ArrayToString(e.data.msgBinary));
			  this.appendOutput(txt + ' END BINARY TEST');
			}
			if (e.data.msgType === 'FEED_ME') {
			  // console.log('react component onmessage ' + e.data.msgType + ' chunkNum: ' + e.data.chunkNum)
			  if (this.audioWorkletNodeA === null) { console.log('null worklet. returning.'); return; }
			  switch (e.data.wavetype) {
				  case 'sinewave':
					  if (this.wsSineHelper == null) { console.log('null wsSineHelper'); break; }
					  // skip this so websocket data gets used..      this.setupSine(440)
					  var payload = { msgType:'sndData', chunkNum: e.data.chunkNum,
							 format: 'Float32Array', leftData: this.lBuffr, rightData: this.rBuffr}
					  this.audioWorkletNodeA.port.postMessage(payload);

					  // Call web service for next chunk
					  var blobData = new Blob([new Uint8Array([0x65, 0x65, 0x48, 0x48,0x48,0x66]).buffer]);
					  this.wsSineHelper.webSocketSendDataWithErrorHandling(blobData); 
					  break;
				  case 'whitenoise':
					  break;
				  default: break;
			  }
			}
		}
		// now wire up above stereo AudioWorkletNode to the speakers of computer
		this.audioWorkletNodeA.connect(audioContext.destination, 0, 0)
	}

	callbackSineWaveSocket = (event) => {
		var msg
		// console.log('callbackSineWaveSocket: ' + event.type);
		switch(event.type) {
			case ('open'): 
				// must send binary data else return code is 1003 NOT_ACCEPTABLE
				var blobData = new Blob([new Uint8Array([0x65, 0x65, 0x48, 0x48,0x48,0x66]).buffer]);
				// var outArr = Array.from('abcdff');
				this.wsSineHelper.webSocketSendDataWithErrorHandling(blobData); 
				break;
			case ('message'): 
				// set elsewhere as: this.theWebSocket.binaryType = 'arraybuffer'; 'blob' ...
				if (event.data instanceof ArrayBuffer) { 
					// console.log('got ArrayBuffer data ' + event.data);
					var f32Input = this.arrayBufferToFloat32Array(event.data);
					//TODO put in temporary buffer because this messes up the sound already playing.....
					this.lBuffr = this.rBuffr = f32Input;
				}
				if (event.data instanceof  Blob) { 
					console.log('got blob data ' + event.data);
					event.data.arrayBuffer().then(buffr => {
						console.log(buffr)
					})
				} 
				break;
			case ('close'): 
				// https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/socket/CloseStatus.html
				msg = "websocket has closed " + ((event.code === 1007) ? "BAD_DATA" : "code: ") + event.code; 
				// org.springframework.web.socket.CloseStatus has error code
				console.log(msg)
				break;
			case ('error'): msg = "ERROR CONNECTING TO callbackSineWaveSocket WEBSOCKET " + event.data;
				//this.setState((previous) => ({lnOutput: previous.lnOutput + "<br />" + msg }));
				console.log(msg) 
				break;
			default: break;
		}
		// HEY! dont put ui stuff here because above functions are asynchronous.
	}

	
	
		arrayBufferToFloat32Array(ArrayBufferIn) {
 			// from the official docs: getFloat32(byteOffset)    
			//     getFloat32(byteOffset, littleEndian)
			//     packs sets of 4 bytes into single float32's, determined by byte order as indicated.
			// GET RID OF THIS 60+ YEAR OLD RACIST SLUR IN THE OFFICIAL DOCUMENTATION NOW!
			// I WANT TO KNOW HOW TO USE THE API, NOT BE OFFENDED BY THIS SH*T
			// var z = Float32Array.from(ArrayBufferIn); // no good..  it doesnt combine bytes into floats
			var BYTES_PER_F32 = 4;
			var f32Array = new Float32Array(ArrayBufferIn.byteLength/BYTES_PER_F32);
			var f32Idx = 0;
			var byteOrderLeastFirst = false;
			var inputDataView = new DataView(ArrayBufferIn);
			for (var idx = 0; idx < ArrayBufferIn.byteLength; idx += BYTES_PER_F32) {
				f32Array[f32Idx++] = inputDataView.getFloat32(idx, byteOrderLeastFirst);
				// outstr += (dataView.getFloat32(idx, false).toFixed(2) + ', ');
			}
			return f32Array;
		}

		float32ArrayToString(array) { 
			// type is javascript Float32Array
			var str = 'array.length: ' + array.length + ' ';
			for (var idx = 0; idx < array.length; idx++) {
				if ((idx % 50) === 0) str += ' [[' + idx + ']]<br/> '
				str += array[idx].toFixed(2) + ' ';
			}
			return str;
		}

		procBinary(msgBinary) {
			if (!msgBinary) return;
			var Uint8Array_in = msgBinary;
			var str = ' ... msgBinary: ' + new TextDecoder().decode(Uint8Array_in) + ":END";
			return str;
		}

		// use arrow notation for force "this" to be this page, not div calling this fcn
		stopSoundA = () => { 
			console.log('stopSoundA()')
			this.setState(() => ({ statusMsg: 'stopped', sndStopBtnCSS_Class: "gridA fancyWithRadius notEnabled"}));
			if (this.audioWorkletNodeA != null) {
				this.audioWorkletNodeA.port.postMessage({ msgType: STOPNOW });
				this.audioWorkletNodeA = null;
				}
		}

		appendOutput = (msg) => {
			this.setState((previous) => 
				({lnOutput: previous.lnOutput + '<br/>' + msg }));
			console.log(msg)
		}

	sessionID = 0;
	render() { 
	  // console.log("WebAudSockSvc_demo render(): STOPNOW:  " + STOPNOW + " state: " + this.state.sndStopBtnCSS_Class);
	  ///var workletChunksFPath = "/publicjs/sndApi/WorkletChunks.js"
	  // var workletChunksFPath = "/publicjs/sndApi/WorkletChunksSingleBuffer.js"
	  return (
		// <style>NOT done using this tag: JSX uses: import './App.css';</style>
	    <div className="App">
		  <h5>...this is containerSetups/frontend/react/src/webAudioApiTest.js</h5>
		  <div id='topOfGrid' 
		       style={{ width:'70%', display:'grid', gridTemplateColumns: 'repeat(12, 1fr)',
               fontSize:'12pt'  }}  >
			{/* see README.md for why workletJSfileURL must be under /public */}
			<div className='gridA, fancyWithRadius' >
			   Audio Worklet Chunks2<br/>
			   <ReactComponentWhichDoesSoundStream_A />
			</div>
			{/* must teach browser self-signed ssl certificate is ok: browse to below and choose 'continue'
			https://localhost:8086/eatFruitArrayOutputArray */}
			<div className='gridA, fancyWithRadius' style={{ borderStyle: 'dotted' }}
			  onClick={() => {
				var springBootPort = "8086"; console.log("adfabb");
				var remoteURL = window.location.protocol + '//' + window.location.hostname + ':' 
				  + springBootPort + '/eatFruitArrayOutputArray'; 
				this.webSvcHelprA.fetchWebSvcAssumeJSONdata(remoteURL, this, this.webSvcCallback);
			  }} >
			  Test Web Service
			</div>
			<div className='gridA, fancyWithRadius' style={{ borderStyle: 'dotted'}}
			  onClick={() => { // connect to srvr on same address, ssl status, but diff socket.
			  		this.wsHelprJSON_A = new WebSockHelper(
						window.location, '8086/webSockJSONA', this.wsockCallbackJSON_A, WebSockHelper.TYPE_arraybuffer) 
			  }} >
			  Test Web SOCKET TEXT
			</div>
			<div className='gridA, fancyWithRadius' style={{ borderStyle: 'solid' }}
			  onClick={() =>  { // send message over existing socket
					try { 
						// this.wsHelprText.webSocketSendTemperature(); 
						var JSONdataThing = JSON.stringify({ // now send some test data. TODO: comment out
							'command' : 'setTemperatureF', 'value' : '75', 'station' : '49' })
						this.wsHelprJSON_A.webSocketSendDataWithErrorHandling(JSONdataThing);
					} catch (ex) { 
							console.log("thrown ex: " + ex)
							this.setState(() => ({lnOutput: 'error ' + ex })); 
							// works ok too..   this.doSetState(ex);
					}
				}} >
			  WEB SOCKET already connected, send setTemperatureF
			</div>
			<div className='gridA, fancyWithRadius' style={{ borderStyle: 'solid' }}
			    onClick={() => { // connect to srvr on same address, ssl status, but diff socket.
					console.log('asdf')
					this.wsHelprBinary = new WebSockHelper(window.location, '8086/websockBinaryB', 
			              this.callbackBinaryWSocket, WebSockHelper.TYPE_blob // WebSockHelper.TYPE_arraybuffer
				)}} >
			  OPEN and Test BINARY web socket
			</div>
			<div className='gridA, fancyWithRadius' style={{ borderStyle: 'solid' }}
			    onClick={() => { // connect to srvr on same address, ssl status, but diff socket.
				try {
					if (!this.wsHelprBinary) throw new Error('wsHelpBinary not yet assigned')
			    	var blobData = new Blob([new Uint8Array([0x65, 0x65, 0x65, 0x65, 0x65, 0x65, 0x48, 0x48,0x48,0x48]).buffer]);
					this.wsHelprBinary.webSocketSendDataWithErrorHandling(blobData);
				} catch (ex) {
					console.log("wsock error: " + ex)
				}
				}} >
					{/* TODO handle error here because callback is never called */}
			  Test already open BINARY web socket
			</div>
			<div className='gridA' 
			     style={{ gridColumn: '1/11', gridRow: '2', border:'0px', height:'33vh', padding: '0px' }}>
			    {/* would be nice if component kept track of lnOutput but it can't return or modify properties 
				    These attributes appear in component as ie:   this.props.doClearBtn */}
				<TTYStyleOutput id="consoleThing" 
				   text={ this.state.lnOutput } doClearBtn='yes' 
				   cbPushedClearBtn={ this.cbClearOutput } />
			</div>
		  </div>{/* topOfGrid  */}
	      
		  <Modal show={this.state.modalOpen1} >
                <Modal.Body><font size="33pt">this is the modal {this.state.modalMessage1}</font></Modal.Body>
                <button onClick={() => this.setState({modalOpen1: false})}>Cancel</button>
          </Modal>
	    </div>
	  );
	}

	// use arrow notation so function binds to this object for use as callback parameter
	cbClearOutput = () => {
		this.setState(() => ({ lnOutput: '-' }) );
	}

	/* this gets called by framework when component updates. */
	componentDidUpdate() {
	}

	// doSetState = (msg) => {
	// 	this.setState({lnOutput: msg });
	// }

	UI_wsock_binaryB;
	ct = 0;
	/**
	 * This callback function supplied as argument to this.wsockHelpr.webSocketConnectBinaryNsend()
	 * which has a line: "wst.addEventListener('message', event... which invokes this callback.
	 * It allows UI code to be separate from websocket helper.
	 * @param {*} event   the websocket event such as message, error, open etc
	 * NOTE: must declare using arrow function because this is a callback parameter to another module, and
	 *       non-arrow declaration results in "this" being undefined.
	 */
	callbackBinaryWSocket = (event) => {
		var msg
		switch(event.type) {
			case ('open'): 
				// this.wsHelprBinary.binaryType = 'blob';
				this.wsHelprBinary.binaryType = 'arraybuffer';
				// var blobData = new Blob([new Uint8Array([0x48, 0x48,0x48,0x65, 0x65, 0x65, 0x65, 0x65, 0x65, 0x48]).buffer]);
				var Uint8Array_A = new TextEncoder().encode(this.ct++ + ' data from client')
				this.wsHelprBinary.webSocketSendDataWithErrorHandling(Uint8Array_A); 
				//this.wsHelprBinary.binaryType = 'blob';
				//this.wsHelprBinary.webSocketSendDataWithErrorHandling(new Blob(Uint8Array_A)); 
				break;
			case ('message'): 
				if (event.data instanceof ArrayBuffer) {
					console.log('got ArrayBuffer data: ' + new TextDecoder().decode(event.data))
					// const byteArray = new TextEncoder().encode(str);
				}
				if (event.data instanceof Blob) { 
					//.then(response => response.json())
					// event.data..then(theData => {
					// 	console.log('got blob data');
					// })
					console.log('got blob data ' + event.data);
					// event.data.arrayBuffer().then(buffr => {
					// 	console.log(buffr)
					// })
					// https://developer.mozilla.org/en-US/docs/Web/API/Response/text
					/** "event.data.text()" below can take a long time if network data xfer is slow, freezing browser.
					 * It returns instantly, a "promise" object which comes to life when the process is done.  **/ 
					event.data.text().then(textContent => {   // ok, now all data is loaded so work on it.
						console.log("binary message, after then: " +  textContent); 
						this.setState((previous) => 
						    ({lnOutput: previous.lnOutput + " cb: " + textContent }));
					});
					/* another way of doing the same thing: var promiseA = event.data.text();
					promiseA.then(textContent => { console.log("another way of then: " +  textContent); msg = textContent;	}) */
				} 
				break;
			case ('close'): msg = "binary websocket has closed"; 
				this.setState((previous) => ({lnOutput: previous.lnOutput + "<br />" + msg })); 
				console.log(msg) 
				break;
			case ('error'): msg = "ERROR CONNECTING TO binary WEBSOCKET " + event.data;
				this.setState((previous) => ({lnOutput: previous.lnOutput + "<br />" + msg }));
				console.log(msg) 
				break;
			default: break;
		}
		// HEY! dont put ui stuff here because above functions are asynchronous.
	}

	/**
	 * passed as param later gets called by "theWebSocket.addEventListener('message', event..." 
	 * @param {*} event 
	 */
	wsockCallbackJSON_A = (event) => {
		var msg
		switch(event.type) { 
			case ('open'): 
				var data = JSON.stringify({ 
					'command' : 'loopThing', 'user' : 'chucky', 'sessionID' : this.sessionID++ })
				this.wsHelprJSON_A.theWebSocket.send(data); break;
			case ('message'): 
				msg = "callbackTextWSocket data: " + event.data; 
				break;
			case ('close'): 
			    // https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/socket/CloseStatus.html
				msg = "websocket has closed " + ((event.code === 1007) ? "BAD_DATA" : "code: ") + event.code; 
				break;
			case ('error'): msg = "ERROR CONNECTING TO WEBSOCKET " + event.data; break;
			default: break;
		}
		console.log(event.type + ' msg: ' + msg)
		this.setState(() => ({lnOutput: this.state.lnOutput + " cb: " + msg }));
	}

	// use arrow notation for force "this" to be this page, not caller of this fcn
	webSvcCallback = (reactComponent, data, status) => {
		console.log("webSvcCallback a: " + status);
		if (status === "error") this.setState(() => ({lnOutput: "web svc error " + data}));
		// this.setState(() => ({lnOutput: "web svc ok " + data}));
		this.setState({lnOutput: this.state.lnOutput + JSON.stringify(data),
			           modalOpen1: true, modalMessage1: 'webSvcCallback status: ' + status });
		setTimeout(() => {this.setState({modalOpen1: false });}, 1000);	
	}
}
const color = 'greenish';

// export default WebAudSockSvcDemo; // reference as: import WebAudSockSvcDemo from './webaudio/WebAudSockSvcDemo.js';
export { DemoSocketAndSound, color } ; // reference as: import { WebAudSockSvcDemo } from './webaudio/WebAudSockSvcDemo.js';

/*
// this.setState(() =>  ({  mouseY: mouseEvt.clientY  }) )});
*/

