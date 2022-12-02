
/**
 * Helper class for accessing web sockets
 * This is NOT a react class, so it's ok for it to be a class and not a function.
 */
// WARNING: delete .eslintcache if weird errors occur describing syntax errors!
// WARNING: delete .eslintcache if weird errors occur describing syntax errors!
// WARNING: delete .eslintcache if weird errors occur describing syntax errors!

/**
* intended to be called from gui code.
* This class binds a web socket with a socket endpoint on a server and with
* specific callbacks within react.js GUI components. It wires events such as "message" to
* the callbacks passing message or error data.
**/
class WebSockHelper { 
    // constructor(props) {		super(props);    }
    sessionID = 100;

    theWebSocket;
    /**  zz from https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
     * 0	CONNECTING	Socket has been created. The connection is not yet open.
     * 1	OPEN	The connection is open and ready to communicate.
     * 2	CLOSING	The connection is in the process of closing.
     * 3	CLOSED	The connection is closed or couldn't be opened..
     **/ 
    webSocketSendDataWithErrorHandling(data) { 
        try {
            if (!this.theWebSocket) 
                throw new Error("socket not yet open or already closed");
            if (this.theWebSocket.readyState !== 1) 
                throw new Error("socket not ready to send readyState:" + this.theWebSocket.readyState);
            this.theWebSocket.send(data);
        } catch (ex) { 
            console.log("error sending to web socket: " + ex)
            // throw ex; 
        }
    }

    constructor(myHostLocation, endPtUrlWithPort,  eventCallback, binaryTypeIn) { 
        this.webSocketSetupWithCallback(myHostLocation, endPtUrlWithPort,  eventCallback, binaryTypeIn);
    }

    /**
     * Connects to web socket and sets up events such as "message", close, etc
     * @param {*} myHostLocation http[s]://myhost
     * @param {*} endPtUrlWithPort   3008/processPizza/salami
     * @param {*} msgCallback    function to call upon "message" event from srvr. Typically react.js UI code
     * Cross Origin Issue: "...As of Spring Framework 4.1.5, default WebSocket and SockJS is to accept only same origin requests..."
     * setup cross-origin permissions in registerWebSocketHandlers(). SEARCH for this in server code. dont confuse with from "CORS"
     */
    // #webSocketSetupWithCallback (private) requires babel setup. Not doing it.
    static TYPE_arraybuffer='arraybuffer'; // to be visible outside module, must be STATIC
    static TYPE_blob='blob'; 
    webSocketSetupWithCallback(myHostLocation, endPtUrlWithPort,  callbackAtUIcode, binaryTypeIn) {
        if (!binaryTypeIn) throw 'binaryTypeIn must be specified';
        var webSockProtocol = "ws:";
        if (myHostLocation.protocol === "https:") webSockProtocol = "wss:";
        var sockURL = webSockProtocol + '//' + myHostLocation.hostname + ':' + endPtUrlWithPort;
        console.log('sockURL: ' + sockURL)
        this.theWebSocket = new WebSocket(sockURL);
        this.theWebSocket.binaryType = binaryTypeIn;
        // its already this...    this.theWebSocket.binaryType = "blob";
        // https://developer.mozilla.org/en-US/docs/Web/API/Response/text
        this.theWebSocket.addEventListener('message', event => { 
            callbackAtUIcode(event); // invoke callback on caller, probably UI code..
        })
        this.theWebSocket.addEventListener('open', event => { 
            callbackAtUIcode(event); 
        })
        this.theWebSocket.addEventListener('close', event => {  
            callbackAtUIcode(event); 
        })
        this.theWebSocket.addEventListener('error', event => { 
            this.sockError(event, callbackAtUIcode) 
        }) 
        // other way: webSocketA.onmessage = function(data) {
    }

    sockError(event, callbackFn) {
        var msg = "WebSocket error [may be cross-browser issue. " +
        "search \"registerWebSocketHandlers\" in server code ]. Event: " + this.evtString(event);
        console.log(msg); event.data += ' ' + msg; callbackFn(event); 
    }
    
    evtString(event) {
        return event.currentTarget.url + ', ' + event.currentTarget.binaryType + ', ' 
           + event.binaryType;
    }
}

var favoriteColor = 'bluegreen';
export { WebSockHelper, favoriteColor  };