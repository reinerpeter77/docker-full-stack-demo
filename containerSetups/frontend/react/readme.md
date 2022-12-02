


This is the react.js project.  
It can be run by itself without anything docker and without spring-boot rest server. 
TO START, follow instructions in "QUICK START section of the 
<!-- the below link to root level /../../tree/main is the SAME regardless of current location  -->
**[root&nbsp;level&nbsp;README.MD](/../../tree/main#quick-start)** of this git repository.
<!-- **[root&nbsp;level&nbsp;README.MD](/../../tree/main)** -->
## Security during development: In windows 10, restrict incoming connections:  
- start windows security by typing security in windows search box  
- go to firewall and network protection
- click on "public network" and select "block all incoming connections..." [a permission window may open for you to enter password]
- for your private network (I use tethered phone while away) add your tethered phone to "private network" using the windows wifi thing ->properties.  [a permission window may open for you to enter password]. Now when on tether, you can use phone to run react app but works cant run (and run debugger on it and see source javascript)
- linux running in a vm in windows "should" get restricted also.
 
### Other notes (not organized)  
React updates html elements differently than normal javascript ie: getElementById().css(background:red).text('you pressed button')  
Instead each page or "component" has "state" which is a json-like set of name/value pairs.   
When something like buttonpress or "message" from websocket occurs, "state" gets  modified (using setstate()) and elements using state
values change to reflect the new values.  
Whenever setState() is called for a component, it redraws itself and its jsx subcomponents and their html things in the tree so state changes become visible.  
In code, look for use of arrow functions, especially near setstate() calls; these look weird but are needed because they bind state to the page/component, not the button being pushed, for example.  

The start page is http://localhost:3008
It has links to react.js pages demonstrating react.js things, and
how to access REST web services, web sockets and some basic
examples of using the "Web Audio Api". These show how react.js components 
interact with these using callbacks, and how to deal with issues arising
from this.   

## Production react.js
**these notes are in the context of the whole fullstack project, to be run at its root folder**
- react.js can run in dev or production mode. In dev mode, it requires a dev server to be running and serving the pages; the "npm start" command starts this dev server.  Changes to source get refreshed to pages as soon as they are saved on disk. Dev mode is too slow for production. For that, "npm run-script build" is run, which compiles source to javascript files it places into the "build" folder in the react project. Nginx points to this build folder and serves the files. 
- on either dev or cloud login, 
to build react.js compiled javascript for production: open a shell 
  ```
  docker-compose -f docker-compose-fullstackWithProfiles.yml exec reactA sh
  ```
   in the react container and do "npm run-script build" there. Or you can do it all on one line:
  ```
  docker-compose -f docker-compose-fullstackWithProfiles.yml exec reactA npm run-script build
  ```
- look in docker-compose-frontend.yml for "volumes" section to see how the built javascript gets shared with nginx (which serves it to the internet)
