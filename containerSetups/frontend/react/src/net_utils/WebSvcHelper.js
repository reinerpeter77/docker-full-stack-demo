/**
 * Helper class for accessing web services using fetch()
 * This is NOT a react class, so it's ok for it to be a class and not a function.
 */

// example of no-class function to export
function doLog(zz) { 
    console.log('from Helpers.doLog: ' + zz);
}

// example of class to export
class WebSvcHelper { // extends myEvent {
    constructor(msg) { 
        this.message = msg; 
    }

    fetchWebSvcAssumeJSONdata(remoteUrl, reactComponent, eventCallback) {
        console.log('fetchWebSvcAssumeJSONdata remoteUrl: ' + remoteUrl);
        var jsonObjectA = [{"flavor": "apple", "color":"palegreen"}, {"flavor": "banana", "color":"yellow"}];
        var reqData = JSON.stringify(jsonObjectA)
        /** "fetch()" below can take a long time if network data xfer is slow.
         * If so, the browser would "freeze" thats bad. So instead fetch() returns a
         * "promise" object instantly [think callback]. After its work is completely 
         * done ie: all data loaded the promise springs to life and run its code.
         * Below is a chain of .then()/promise calls, each doing something. This particular example
         * assumes incoming data is JSON data.
         **/
        fetch(remoteUrl, {
            method: 'POST', headers: {'Content-Type': 'application/json' }, body: reqData
        }).then(fetchResp => { 
            if (!fetchResp.ok) throw new Error(fetchResp.url); // works also...   return Promise.reject(fetchResp);
            return fetchResp; })
        .then(swissCheese => { // data is now loaded
            console.log("swissCheese response.headers.get('content-type'): " + swissCheese.headers.get('content-type')); 
            return swissCheese; // this goes to the next ".then()"
        })
        // EATS input stream and returns a json object for next steps. Original data is GONE after this step!
        .then(responseZ => { console.log("to json"); return responseZ.json(); })
        // same effect as above but confusing...    .then(responseZ => responseZ.json()) 
        .then(newJSONObjectFromResponse => {
            eventCallback(reactComponent, newJSONObjectFromResponse, "dataReady"); 
            return newJSONObjectFromResponse; // this goes to the next ".then()"
        })
        .then(xyz => console.log(" json object xyz[1].color: " +  xyz[1].color))
        .then(swissCheese => { console.log("all done"); })
        .catch((errMsg) => {
            // console.log("websvc err url: " + errMsg)
            eventCallback(reactComponent, "websvc err url: " + errMsg, "error");
        });
    } 
}
// module.exports = Helpers;
export { WebSvcHelper, doLog };
// var EMIT_MSG_TAG = 'zzzzy';
// module.exports.EMIT_MSG_TAG = EMIT_MSG_TAG;
// at this point the api return with headers, body is lost.
        /* instead of above response.json() call, can do this, but cannot do both because they EAT input stream!
        .then(response => response.text()) 
        .then((responseText) => { 
            console.log("text: " + responseText); 
            var jsonObj = JSON.parse(responseText)
            console.log("JSON: " + JSON.stringify(jsonObj) + " color " + jsonObj[1].color)
            return responseText; 
        }) */

// example of fetch() using explicit promise object.
// var promiseA = fetch(remoteUrl, {
        //     method: 'POST', headers: {'Content-Type': 'application/json' }, body: reqData
        // });
        // // show headers from the api  call.
        // promiseA.then(swissCheese => { 
        //     console.log("response.headers.get('content-type'): " + swissCheese.headers.get('content-type')); 
        //     return swissCheese;
        // })
 