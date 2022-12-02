
import '../App.css'; // this pulls css into the render() stuff
import React from 'react';

// sndHelperA.js has an identical copy under /public which also contains audio worklet. Symbolic links dont work.
// import { sndHelper, color as colorFromSndHelper, STOPNOW } from "./sndHelperA.js";
import { sndHelper, STOPNOW } from "./sndHelperA.js";
import { ReactSelectBox, ReactSelectBox2, ReactSelectBoxLowHighStep } from "../ReactHelper.js";
import { WebSockHelper } from '../net_utils/WebSockHelper.js';

// import { TTYStyleOutput } from '../components/TTYStyleOutput.js';
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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'; 
// import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';

class WebSockSndStreamA extends React.Component {
	render() {
		const Dopopover  =  (
			<Popover id="popover-basic">
			  <Popover.Header as="h3">fix for untrusted certificate</Popover.Header>
			  <Popover.Body>
				..this link gives the  <strong>browser</strong> a chance to accept the web service ssl certificate
				which it would otherwise reject when calling web service from javascript code. Likewise for
				web sockets. Unless this is done, all web service/socket calls will fail.
				<div style={{ fontSize: '0.5em' }}>[this is a react-bootstrap popover thing]</div>
			  </Popover.Body>
			</Popover>
		);
		return (
			<div>

			<div id="jqueryTestA" style={{ fontSize: '0.5em', backgroundColor: '#0000ff', color: '#ffff00' , width: 'fit-content'}} >
				....this div is from containerSetups/frontend/react/src/webaudio/WebSockSndStreamA.js</div>
				<div className="App">
				{/* can also put tooltip into a callable function. lookup "react-bootstrap tooltip" */}
					<OverlayTrigger id='react-boostrap-tooltip'	placement="right" delay={{ show: 50, hide: 400 }} 
						overlay={Dopopover} >
					<div style={{ gridColumn: '1/3', fontSize: '1.0em', width: 'fit-content'}} >
						<a href='https://54.177.44.60:8086'>https://54.177.44.60:8086 (hover here)</a></div>
					</OverlayTrigger>
				<ReactComponentWhichDoesSoundStream_A />
				</div></div>
		);
	}

	
}

class ReactComponentWhichDoesSoundStream_A extends React.Component {
	// these are the two things which obtain sound data and play sound. This class is the intermediary
	audioWorkletNodeA; // the web audio api thing that plays sounds in its own thread. Communicates using messaging.
	webSocketSoundWaveHelper; // the web socket class which obtains the next waveform from the server.

	// constructor(props) {
	// 	super(props);
	// 	//console.log("import colorFromSndHelper: " + colorFromSndHelper)
	// }

	state =  { soundType: 'sineWithRamps', //'simpleSine', //'sineWithRamps', // 'sineWithStartEndMarkers',
		statusMsg: '', modalOpen1: false, modalMessage1: "modal here",
		sndStopBtnCSS_Class: 'gridA notEnabled fancyWithRadius',
		lnOutput: '-', frequencyStart: 420, frequencyEnd: 420, 
		chunkSizeSamples: 22048, phaseShiftAngle: 0,
		fmModFreq: 0.0, rampLenSecs: 1.0,
		value: 50, xyz: 'zzzz'
	};

	// componentDidMount() {
	// 	alert('asdf')
	// 	//nope jquery not defined...  $("#jqueryTestA").text("Hello world!");
	// }
	
	sessionID = 0;
	render() {
		// jjj();
		// console.log("WebAudSockSvc_demo render(): STOPNOW:  " + STOPNOW + " state: " + this.state.sndStopBtnCSS_Class);
		var workletChunksFPath = "/publicjs/sndApi/WorkletChunks.js"
		// var workletChunksFPath = "/publicjs/sndApi/WorkletChunksSingleBuffer.js"
		
		return (
			// <style>NOT done using this tag: JSX uses: import './App.css';</style>
			//	{/* see README.md for why workletJSfileURL must be under /public */}
			<div id='topOfGrid'
				style={{ width: 'fit-content', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', fontSize: '12pt' }}  >
				<div style={{ width: '100px', height: '100px', border: '3px solid black'}} >
					zzzz
				</div>
				<div className='gridA, fancyWithRadius' style={{ gridColumn: '1/2' }}
					onClick={() => {
						//var sockURL = '8086/SweepChunks';
						var sockURL = '8086/MultiSounds';
						this.webSocketSoundWaveHelper = new WebSockHelper(window.location, sockURL,
							this.webSockCallBack_whenSockEvent, WebSockHelper.TYPE_arraybuffer //WebSockHelper.TYPE_blob 
						)
						this.addNewAudioWorklet('WorkletChunks', workletChunksFPath);
						// this.addNewAudioWorklet('WorkletChunksSingleBuffer', workletChunksFPath);
						this.setState({
							statusMsg: 'runAudioWorkletNode() called', sndStopBtnCSS_Class: "gridA, fancyWithRadius"
						});
					}} >
					Audio Worklet Chunks2<br />
				</div>
				<div id='stopB' className={this.state.sndStopBtnCSS_Class}
					onClick={() => { 
						this.stopSoundA();
					    this.setState({	sndStopBtnCSS_Class: "notEnabled gridA fancyWithRadius" });
					}} >
					STOPNOW Worklet Chunks
				</div>
				<div className='gridA, fancyWithRadius'
					onClick={() => { // connect to srvr on same address, ssl status, but diff socket.
						this.wsHelprJSON_A = new WebSockHelper(
							window.location, '8086/webSockJSONA', this.wsockCallbackTestJsonData, WebSockHelper.TYPE_blob // WebSockHelper.TYPE_arraybuffer
							);
							this.setState({modalOpen1: true, modalMessage1: 'testing web socket. Output is in js log' });
				 			setTimeout(() => {this.setState({modalOpen1: false });}, 3000); // close modal after delay
					}} >
					Test webSockJSONA<br />(requires https if not localhost)
				</div>
				{/* ---- new row ---- */}
				<div className='gridA, fancyWithRadius' 
			     style={{ gridColumn: '1/11', gridRow: '2', border:'0px', padding: '0px' }}>
					 {/* surround literal by  curly brackets to cast to number not string */}
					  <ReactSelectBox choices={[ 'sineWithRamps', 'sineWithStartEndMarkers', 'simpleSine' ]}
						label="soundType"	value={this.state.soundType}
						onChange={(zz) => {	this.setState({ soundType: zz.target.value }); }} />
					  <ReactSelectBoxLowHighStep low={220} high={1600} step={200}
						label="start frequency"	value={this.state.frequencyStart}
						onChange={(zz) => {	this.setState({ frequencyStart: zz.target.value }); }} />
					 <ReactSelectBoxLowHighStep low={220} high={1600} step={200}
						label="end frequency"	value={this.state.frequencyEnd}
						onChange={(zz) => {	this.setState({ frequencyEnd: zz.target.value }); }} />
					<ReactSelectBoxLowHighStep low={0.0} high={6} step={0.5}
						label="rampLenSecs"	value={this.state.rampLenSecs}
						onChange={(zz) => {	this.setState({ rampLenSecs: zz.target.value }); }} />



					 <ReactSelectBoxLowHighStep low={5512} high={44100} step={5512}
						label="chunkSizeSamples"	value={this.state.chunkSizeSamples}
						onChange={(zz) => {	this.setState({ chunkSizeSamples: zz.target.value }); }} />

					<ReactSelectBox2 choices={[ '0', 'Math.PI/4', 'Math.PI/2', '3*Math.PI/4', 'Math.PI', '1.5*Math.PI', '2*Math.PI' ]} 
					        values={[ 0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 1.5*Math.PI, 2*Math.PI ]}
						label="phaseOffset"	value={this.state.phaseShiftAngle}
						onChange={(zz) => {	this.setState({ phaseShiftAngle: zz.target.value }); }} />
					 {/* <ReactSelectBoxLowHighStep low={0} high={(2.0*Math.PI)} step={(Math.PI/4.0)}
						label="phaseShiftAngle"	value={this.state.phaseShiftAngle} 
						onChange={(zz) => {	this.setState({ phaseShiftAngle: zz.target.value }); }} /> */}

					 <ReactSelectBoxLowHighStep low={0} high={12} step={1}
						label="fmModFreq"	value={this.state.fmModFreq} 
						onChange={(zz) => {	this.setState({ fmModFreq: zz.target.value }); }} />
						
							 
				
			    </div>
				{/* must teach browser self-signed ssl certificate is ok: browse to below and choose 'continue'
			https://localhost:8086/eatFruitArrayOutputArray */}

				<Modal show={this.state.modalOpen1} >
					<Modal.Body><font size="33pt">this is the modal {this.state.modalMessage1}</font></Modal.Body>
					<button onClick={() => this.setState({ modalOpen1: false })}>Cancel</button>
				</Modal>
			{/* topOfGrid  */} </div>
		);
	}

	/**
	 * 
	 * @param {*} worketClassName extends AudioWorkletProcessor as defined in workletJSfilePath
	 * @param {*} workletJSfilePath must be under /public cuz web audio api looks there for it. It doesnt know about react.js
	 */
	addNewAudioWorklet(worketClassName, workletJSfilePath) {
		if (this.audioWorkletNodeA != null) { console.log("this.audioWorkletNodeA not null, returning"); return; }
		var auCon = new AudioContext({ latencyHint: 'interactive', sampleRate: 44100 });
		// console.log(" numberOfOutputs: " + auCon.destination.numberOfOutputs + " channelCount: " + auCon.destination.channelCount); 
		// other way: audioContext.audioWorklet.addModule(workletJSfilePath).then(xyz =>  { do all stuff in afterModuleAdded() }
		var promiseB = auCon.audioWorklet.addModule(workletJSfilePath);
		// the "then" thing runs after audio module is all setup which can take some time. Use promise so gui thread doesnt block..
		
		/* **** WARNING ****
           errors like "Uncaught (in promise) SyntaxError: Unexpected token '{'" "
		   refer to the code in the worklet, not this file. */
		promiseB.then(xyz => {  // use weird arrow function or else "this" is undefined in anonymous function which follows
			this.setupNewAudioWorkletModule(auCon, worketClassName);
		});
	}

	setupNewAudioWorkletModule(audioContext, worketClassName) {
		var setupParamsForAudioWorklet =
		{ // parameters defined by https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode/AudioWorkletNode
			numberOfOutputs: 1, // one output which is the speakers
			outputChannelCount: [2], // 2 channels for stereo OUTPUT through speakers. 
			numberOfInputs: 0, // this is start of sound pipeline, so no inputs.
			// processorOptions let me add my own params
			processorOptions: { drink: 'iced tea', pizza: 'mushroom and onions thin crust' }
		}
		this.audioWorkletNodeA = new AudioWorkletNode(audioContext, worketClassName, setupParamsForAudioWorklet);
		// https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode/port#examples
		// setInterval(() => audioWorkletNodeA.port.postMessage('ping'), 2000)
		this.audioWorkletNodeA.port.postMessage('ping');
		this.setupAudioWorkletHandlers(this.audioWorkletNodeA);
		// now wire up above stereo AudioWorkletNode to the speakers of computer
		this.audioWorkletNodeA.connect(audioContext.destination, 0, 0)
	}

	SAMPLESPERSECOND = 44100; // dvd format 44.1 kHz. used by service at socket
	//startCarrier = 440; endCarrier = 1200;
	getWebSockPars(reqNumIn) {
		var webSockReqParms = {  // this IS a JSON object
			soundType: this.state.soundType,
			reqNum: reqNumIn, // NOT USED!
			chunkSizeSamples: parseInt(this.state.chunkSizeSamples), 
			startCarrier: parseInt(this.state.frequencyStart), 
			endCarrier: parseInt(this.state.frequencyEnd),
			rampLenSecs: parseFloat(this.state.rampLenSecs),
			fmModFreq: parseFloat(this.state.fmModFreq), //   0.0, // must use 0.0 else thinks its an Octal type!
			phaseShiftAngle: parseInt(this.state.phaseShiftAngle),
			// stereoTestMode: 'Y' // if yes makes left/right different to test stereo
			stereoTestMode: 'N',
		}
		var blobPars = new Blob([new TextEncoder().encode(JSON.stringify(webSockReqParms))]);
		return blobPars;
		// wont work because server wont respond to text... not even an error message ....  
		// return JSON.stringify(webSockReqParms);
	}

	setupAudioWorkletHandlers(workletNode) {
		workletNode.port.onmessage = (audioWorkletMsg) => {
			// console.log('audioWorkletNodeA onmessage msgType: ' + e.data.msgType)
			if (audioWorkletMsg.data.msgType === 'binaryA') {
				var txt = ("onmessage: " + audioWorkletMsg.data.msgType + ' .. ' + audioWorkletMsg.data.msgText +
					this.procBinary(audioWorkletMsg.data.msgBinary));
				this.appendOutput(txt);
			}
			if (audioWorkletMsg.data.msgType === 'testBinarySine') {
				txt = ("onmessage: " + audioWorkletMsg.data.msgType + ' .. ' + audioWorkletMsg.data.msgText +
					this.float32ArrayToString(audioWorkletMsg.data.msgBinary));
				this.appendOutput(txt + ' END BINARY TEST');
			}
			if (audioWorkletMsg.data.msgType === 'FEED_ME') {
				switch (audioWorkletMsg.data.wavetype) {
					case 'sinewave':
						// start call to web service. When data is ready, the callback forwards data to AudioWorklet
						if (this.webSocketSoundWaveHelper) {
							// console.log('feedWS call')
						    this.webSocketSoundWaveHelper.webSocketSendDataWithErrorHandling(this.getWebSockPars(this.ctA++));
						}
						break;
					case 'whitenoise':
						break;
					default: break;
				}
			}
		}
	}
    ctA = 0;
	chopToStereoAndSendToAudioWorklet(workletNodeA) {
		// chop data into left/right channels
		var midBuff = this.f32LeftThenRight.length / 2; // first half is LEFT
		this.lBuffr = this.f32LeftThenRight.slice(0, midBuff);  // second half is RIGHT
		this.rBuffr = this.f32LeftThenRight.slice(midBuff, midBuff * 2);
		this.f32LeftThenRight = undefined; // prevent send of next until new data rec'd from socket
		// note: messages sent to AudioWorkletProcessor are JSON where fields can be
		//   binary arrays. Not so for web socket messages unfortunately. To send stereo over
		//   web socket, I concatenate left and right channels, then decode it here.
		//   [Android audio alternates left and right for each array member pair.]
		var payload = {
			msgType: 'sndData',
			format: 'Float32Array', leftData: this.lBuffr, rightData: this.rBuffr
		}
		workletNodeA.port.postMessage(payload);
	}

	webSockCallBack_whenSockEvent = (socketEvt) => {
		var msg
		switch (socketEvt.type) {
			case ('open'):
				// must send binary data else return code is 1003 NOT_ACCEPTABLE
				console.log('socket now open..')
				this.webSocketSoundWaveHelper.webSocketSendDataWithErrorHandling(this.getWebSockPars(this.ctA++));
				break;
			case ('message'):
				// set elsewhere as: this.theWebSocket.binaryType = 'arraybuffer'; 'blob' ...
				if (socketEvt.data instanceof ArrayBuffer) {
					if (socketEvt.data.byteLength < 1000) {
						// must be a message, not data. probably error message
						msg = new TextDecoder().decode(socketEvt.data);
						console.log("text message from socket server: " + msg);
						break;
					}
					// To send stereo over web socket, I concatenate left and right channels, then decode it here.
					//       [Android audio alternates left and right for each array member pair.]
					var f32Input = sndHelper.arrayBufferToFloat32Array(socketEvt.data);
					this.f32LeftThenRight = f32Input;
				}
				if (this.audioWorkletNodeA)  // it may no be setup yet
					this.chopToStereoAndSendToAudioWorklet(this.audioWorkletNodeA);
				// if (socketEvt.data instanceof Blob) {
				// 	console.log('got blob data ' + socketEvt.data);
				// 	socketEvt.data.arrayBuffer().then(buffr => {
				// 		console.log(buffr)
				// 	})
				// }
				break;
			case ('close'):
				// https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/socket/CloseStatus.html
				msg = "websocket has closed " + ((socketEvt.code === 1007) ? "BAD_DATA" : "code: ") + socketEvt.code;
				// org.springframework.web.socket.CloseStatus has error code
				console.log(msg)
				break;
			case ('error'): msg = "ERROR CONNECTING TO callbackSineWaveSocket WEBSOCKET " + socketEvt.data;
				//this.setState((previous) => ({lnOutput: previous.lnOutput + "<br />" + msg }));
				console.log(msg)
				break;
			default: break;
		}
		// HEY! dont put ui stuff here because above functions are asynchronous.
	}

	// use arrow notation for force "this" to be this page, not div calling this fcn
	stopSoundA = () => {
		console.log('stopSoundA()')
		this.webSocketSoundWaveHelper = null; // stop server connection
		if (this.audioWorkletNodeA != null) {
			this.audioWorkletNodeA.port.postMessage({ msgType: STOPNOW });
			this.audioWorkletNodeA = null;
		}
	}

	appendOutput = (msg) => {
		this.setState((previous) =>
			({ lnOutput: previous.lnOutput + '<br/>' + msg }));
		console.log(msg)
	}

	// use arrow notation so function binds to this object for use as callback parameter
	cbClearOutput = () => {
		this.setState(() => ({ lnOutput: '-' }));
	}

	/* this gets called by framework when component updates. */
	// componentDidUpdate() {	}

	wsockCallbackTestJsonData = (event) => {
		var msg
		switch (event.type) {
			case ('open'):
				var data = JSON.stringify({
					'command': 'loopThing', 'user': 'chucky', 'sessionID': this.sessionID++
				})
				this.wsHelprJSON_A.theWebSocket.send(data); break;
			case ('message'):
				msg = "callbackTextWSocket data: " + event.data;
				// ok also... this.setState({modalMessage1: 'testing web socket. Output is in js log' });
				this.setState(old => ({ modalMessage1: old.modalMessage1.concat(event.data) }));
				break;
			case ('close'):
				// https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/socket/CloseStatus.html
				msg = "websocket has closed " + ((event.code === 1007) ? "BAD_DATA" : "code: ") + event.code;
				break;
			case ('error'): msg = "ERROR CONNECTING TO WEBSOCKET " + event.data; break;
			default: break;
		}
		console.log(event.type + ' msg: ' + msg)
		this.setState(() => ({ lnOutput: this.state.lnOutput + " cb: " + msg }));
	}

	UI_wsock_binaryB;

}
const color = 'lightblue';
// export default WebSockSndStreamA;
export { color, WebSockSndStreamA, ReactComponentWhichDoesSoundStream_A };

/*
// this.setState(() =>  ({  mouseY: mouseEvt.clientY  }) )});
*/
/* <OverlayTrigger id='react-boostrap-tooltip'	placement="right" delay={{ show: 50, hide: 400 }} 
						overlay={renderTooltipA} >
					   <div style={{ gridColumn: '1/3', fontSize: '1.0em', width: 'fit-content'}} >bbb</div>
					</OverlayTrigger> */
		// const renderTooltipA = (props) => (
		// 	<Tooltip id="button-tooltip" {...props}>
		// 	  Simple tooltip zz
		// 	</Tooltip>
		//   );
		/*
							<OverlayTrigger id='react-boostrap-tooltip'	placement="right" delay={{ show: 50, hide: 400 }} 
						overlay={<Tooltip>link to web service to prompt browser to accept untrusted certificate</Tooltip>} >
					<div style={{ gridColumn: '1/3', fontSize: '1.0em', width: 'fit-content'}} >
						<a href='https://54.177.44.60:8086'>https://54.177.44.60:8086</a></div>
					</OverlayTrigger>
					*/