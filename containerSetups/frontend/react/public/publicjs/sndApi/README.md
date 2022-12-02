

-This folder has NON-react.js files. They invoke the web audio api. 
These files are called by react.js javascript in 
containerSetups/frontend/react/src/webaudio using the line:  
```
audioContext.audioWorklet.addModule(workletJSfilename)
```
-Because they are not react.js files, they cannot be in the react/src/webaudio folder, where
they are eaten by react.js and not served up as a javascript resource.
If a file such as sndHelperA.js needs to be used in react.js code also, it must be copied to the above folder. Do not use a linux symbolic link, as it results in a very misleading error *"Support for the experimental syntax 'classProperties' isn't currently enabled"*.   
-question: can audioContext.audioWorklet.addModule() be made to load the module the react.js way?

