
-This folder has react.js files which invoke the web audio api. They use:

```
audioContext.audioWorklet.addModule(workletJSfilename)
```
where workletJSfilename is the name of a file containing a javascript class  which extends the web API "AudioWorkletProcessor". 
The javascript loader for this is apparently not compatable with react.js, so the file 
"workletJSfilename" must be a public javascript file.
This folder is used:   
**containerSetups/frontend/react/public/publicjs/sndApi**   

Common javascript files used by javascript in public and in react.js contain things
like STOPNOW constant/command in "sndHelperA.js" etc. I tried putting the file in public and making a symbolic unix
link to the react.js javascript folder, but this results in a very misleading error *"Support for the experimental syntax 'classProperties' isn't currently enabled"*.
FIX: put a copy of "sndHelperA.js" in the react.js folder to be used by react javascript code.
Note: react javascript code is prevented from using a public javascript, get message "code
outside of src not allowed".

```
ln -s  ../../public/publicjs/sndApi/sndHelperA.js sndHelperA_copy.js  
cp sndHelperA_copy.js sndHelperA.js
```
