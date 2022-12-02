nov 20

***
### DISCLAIMER: see file LICENSE.txt (it is the MIT License)   
*** 
*Note: This .md file on github is written in "markdown", not html. Github converts the source to html which you see here. Use visual studio code to edit because it has a "preview" window which shows result.*
***


### Table of Contents
<!--- markdown comment 3 dashes. Make links using following notation, but make lower case. 
To make a link to part of this file, put stuff in parenthesis in all lower case and add a #. To put links to other docs, don't change it. --->  

<!-- to use & ampersand substitue with single dash in link -->
- **[Introduction & Prerequisites](#introduction--prerequisites)**
- **[Quick Start](#quick-start)**
- **[Method](#method)**
- **[Setup of linux for either local dev box or cloud instance](#setup-of-linux-for-either-local-dev-box-or-cloud-instance)**
- **[Setup of local linux for development](#setup-of-local-linux-for-development)**
- **[Build java and setup docker secrets](#build-java-and-setup-docker-secrets)**
- **[Run docker and use scripts for code update](#run-docker-and-use-scripts-for-code-update)**
- **[Configuration of SSL HTTPS SSL Websocket wss](#configuration-of-ssl-https-ssl-websocket-wss)**
- **[Setup of ubuntu instance in cloud](#setup-of-ubuntu-instance-in-cloud)** 
- **[Github setup local and cloud instance](#github-setup-local-and-cloud-instance)**
- **[Production react.js](#production-reactjs)**
- **[Snafus and Notes](#snafus-and-notes)**
- **[MARKDOWN EXAMPLES](#markdown-examples)**
***

## Introduction &amp; Prerequisites
- **DISCLAIMER: Assume nothing is this project is correct or secure.**
- **OBJECTIVE:**   Platform for learning & developing frontend and backend code.   Sets up full stack web app using docker-compose, with scripts to simplify the cycle of writing/debugging code and pushing to a cloud instance.  
*Docker and Cloud development is optional*, as project can be run locally from Visual Studio Code.   
***Note: search "hhh" here for description of shell quick-command tool for docker and cloud development central to this project.***    
- **THIS DOCUMENT**  is my own roadmap to the project; I added sections as I added each new feature. *Without doing this, the project would have eventually become an incomprehensible jumble* to me and would not progressed as far as it did.  It also facilitates usability after taking a break to do something else for a few years.  
Please offer helpful **github discussion** entries, as I and others may want to know what is wrong with the project or this document.   
- **PREREQUISITES:** Basic web skills, Unix shell commands and a programming language. Java and javascript are best.   
  - **Simple setup:** this project can run as a frontend-backend project straight from VSCode by those with web/language skills, but without docker, git or UNIX knowlege. (see **[Quick Start](#quick-start)**)   
  - **Full docker setup:** This project is driven by unix commands and scripts typed into a login "terminal" or "shell". Scripts run in shells make tasks vendor-independent, repeatable and self documenting, something modern GUI systems arent so good at. To learn linux shell commands, online linux shell websites are a good start in conjunction with tutorials..  
  **Git is optional** as it's used here to propagate code from development to the cloud. Since cloud is optional here, git is optional, however, Git is useful without cloud, as it serves as code backup & revision mgmt and zipfile download to serve as secondary backup. Warning: don't depend on Github as your sole code backup while you are learning it, as git beginner's mistakes & misunderstandings cause code to "vanish".
- ***DESCRIPTION:*** This project has a spring-boot server, a react.js front end on a separate server,  a mysql database with scripts to load a test db used in examples, a phymyadmin web-based console to manage the mysql, and an nginx server to serve compiled react.js content (as opposed to the dev react.js server build into it.) Examples of REST, websockets and web audio are included on server and react.js client, but not well documented. Docker secrets (ie db passwords, CORS url's) are setup by docker-compose files and consumed by example code.   
All is setup and controlled by docker-compose with above servers running in separate docker containers, all running on a single linux box, on a desk or in the cloud. *see "hhh" command*
   - The great thing about docker is that this entire setup of all servers gets initialized/started/stopped as a group by single command lines, thanks to docker-compose. Note the very first time a setup gets run, it takes a while for various vm images to download.

## Quick Start
- ## REACT standalone running without docker  
  On a pc or linux box, Server (spring-boot) and client (react.js) which interact with each other via web service and web sockets can be run in Visual Studio Code straight from their folders under "containerSetups" and be totally self-contained without using docker or secrets files.   
  First download zip of project, unzip locally and find the 2 project folders under **[containerSetups/frontend/react](containerSetups/frontend/react)** and **[containerSetups/backend/spboot](containerSetups/backend/spboot)**. Ignore everything else you can even delete it.

  1. Install java development kit JDK, NOT java runtime "JRE".  On a pc, I use microsoft-jdk-11.0.14.1_1-31205-windows-x64.zip from https://docs.microsoft.com/en-us/java/openjdk/download. File: **microsoft-jdk-11.0.14.1_1-31205-windows-x64.msi**      
  1. Install node.js from nodejs.org:  
  Don't install the latest long term release (v18 at this writing) because this project breaks it, with an error message which can eat a few days of work.  Instead, on the page select "previous releases", go down the list to "Node.js 16.14.2", select "downloads" and download  
   "**node-v16.14.2-x64.msi**".   
  2. Install Visual studio code, start it and install these "Extensions" (see the 4-square thing on left): **"rioj7.command-variable [command variable]", "Gradle for java", "Spring Boot Dashboard", "Extension Pack for Java"**. 
  For legible font, go to preferences->editor->font and click to edit settings.json file;  use below entries to get a good font:  
  ```
    "editor.fontFamily": "Consolas, 'Courier New', monospace",
    "editor.fontLigatures": false,
    "editor.fontSize": 16,
    "editor.fontWeight": "bold"  
  ```
  3. Restart VSCode, open react project folder in VSCode, then type into bottom terminal in VSCode: "npm install". This downloads all the node modules specified in package.json and puts them in node_modules folder.  
  4. Click the "run and debug" triangle-shaped thing on the left and from the dropdown at upper left, choose "http 8003". In a browser go to http://localhost:3008/JsxDemoA_url  If working properly it should show the demo page.  Buttons which call web services should fail, since the server is not yet up. **To use debugger**, start a browser controlled by VSCode by choosing "Do This First Run Chrome...", and you can set breakpoints within VSCode javascript.  This is essential for serious development.  
  *[april 2022 got error about missing module; fixed it with (terminal window) "npm update chokidar" and running "npm install" again]*
### Security during development: In windows 10, restrict incoming connections. Using github at repository root, use search box **"Security during development"** [include quotes] to find the notes on this.
## React demo code  
 - The above demo uses code in  **[containerSetups/frontend/react/src/demoA_fnComponents](containerSetups/frontend/react/src/demoA_fnComponents)**. To learn react, look at and  modify the code here. *The other folders are disorganized and are for other non-basic projects*  
  **react class vs functional components:** react originally had "class components" then moved on to "function components" to replace them. Class
  components sound nice but the react implementation is wonky with lots of weird arrow functions. Function components
  are cleaner and let you access specific dom elements from code. The functions useEffect(), useState() and others are
  the foundation of this, but are poorly named. Fortunately getting used to these does not take too long.  **[containerSetups/frontend/react/src/demoA_fnComponents/JsxDemoA.js](containerSetups/frontend/react/src/demoA_fnComponents/JsxDemoA.js)** has documented code describing this.
## To run the spring-boot project  
  - (after setting up react.js project): 
  - Open the spring-boot project: open "new window" in VSCode, in new window open spring boot folder 
  - VSCode unfortunately prompted me to setup the java.home path for **gradle** (the build tool used by spring-boot). It opened the following file where this path is specified: **C:\Users\userABC\AppData\Roaming\Code\User\settings.json** I used this line:  
     **"java.jdt.ls.java.home": "c:\\\\Program Files\\\\Microsoft\\\\jdk-11.0.14.101-hotspot"**  , based on where the jdk installed itself in the last step. 
     - Restart VSCode; if gradle error messages appear, try restarting VSCode. Gradle error messages can be misleading; dont try to examine them too closely. Once this works it problems didnt reappear for me. Gradle works by running a script "gradlew.bat" on a pc which loads and runs gradle; gradle does not get installed on the pc.
  5. In spring-boot VSCode window, run "port 8086". The the web service/web socket test from react should connect. Note 2 VSCode windows will be present, both running. Debugger works well for both.
  6. At this point you have a web front-end calling REST web services and web sockets on the spring-boot server, with no docker involved. The 2 project folders have no external file dependencies and can be moved anywhere. There is no database running, as this project uses docker for that.

- ## Setup with docker
  - do as described **[Setup of linux for either local dev box or cloud instance](#setup-of-linux-for-either-local-dev-box-or-cloud-instance)**. As a start, follow instructions for local dev box.
  - **[Build java jar for spring-boot and setup docker secrets](#build-java-and-setup-docker-secrets)**  
  - **[Run docker and use scripts for code update](#run-docker-and-use-scripts-for-code-update)**

## Method
***this is a description; see instructions in other sections***
- This project was setup using vmware player running  Ubuntu 21.04 linux (from osboxes.org) on a pc, and an Amazon Web ec2 instance of ubuntu. All project work is done in Ubuntu. The **vmware player shares folder /remote with the host pc [snafu\*]**, which contains ssh keys to access the cloud instance. Doing this prevents cloud credentials from getting in the vm image if it's shared. *note 6.1gb vm memory much faster than 4gb*   
 \* ***see snafu section for how to fix a vmware shared file problem I encountered***  
 \* **disable autofill in vm browsers** so your passwords dont end up in vm image you may share!
- docker sets up a bunch of virtual linux boxes "containers" on the host and automatically downloads linux images, software and configures them. Dockerfiles specify how each image/container is setup. docker-compose.yml files specify details of runtime for each container, like which dockerfile to use, secrets etc. It sets itself up and runs very fast after slow initial downloads which it caches for later use.  Note: Linux images specified in Dockerfiles are minimal and don't have gui code. [for illustration, search in internet: "bus chassis highway"]
- A set of scripts under the "Scripts" folder builds code and makes calls to docker and docker-compose. Any sensitive information used by these scripts is in files under the "Secrets" folder in files ending with .secret (they are excluded from git by .gitignore). Cloud credential secrets are in host-shared /remote *search for details*.

- Running single commands on a cloud instance looks something like this, and is the basis of many scripts in this project:  
    ``` 
    ssh -i "/remote/awsKeyPair123.pem" ubuntu@xx.xx.xx.xx "cd myproject && git pull && ./rebuildAndCopyToContainer"
    ```
- This project uses docker-compose.yml files:
  - The docker-compose command looks in one or more docker-compose.yml files for instructions of how to run docker containers. These files reference dockerfiles (which specify how a container is built), and also specify file paths for files to load into containers (see build: and context: tags). Dockerfiles are blueprints for each container; first they specify a linux image on dockerhub to download, then say what to copy to it (your code), how to set it up, and how to start it running when docker-compose says to.   
  - Docker secrets are used. The file-based secrets mechanism is used here for simplicity; in production probably the cloud host secrets mechanism is better to use. Use dos secmmgr tool.
- Run project in different contexts during "development" and "production":
  - When coding, run on local ide (one instance to ide for spring-boot and another for react.js) Use debugging directly.
  - Run on local docker. Local docker also provides a test mysql database for use by code running on local IDE or local docker. Visual studio can debug on a docker container; I tried that a few times.
  - As an optional next step, take above code and run on cloud service. Scripts manage this process as above.  These include git commands and your own git repository, as github serves as the go-between from local to cloud. Typically scripts do a local git-push, then git-pull on cloud instance, then run scripts\* on the cloud instance to build code and docker images. \*Those are the same scripts that get run on local machine.

## Structure of Project
- **TERMINOLOGY USED IN THIS DOC**  
  **"dev box"** is linux computer on your desk, whether directly on linux or on a vmware player Ubuntu box as a VM. I use a vmware player.  
  **"cloud instance"** is the virtual linux box running in the cloud service.    
  **"container"** is the docker virtual machine running inside docker which is running in your "dev box" or on your "cloud instance". Typically there are several of these running.  
  **"docker image"** is the frozen pizza which gets started to become a running container.  
  **"service"** is the tag used in docker-compose.yml files to indicate a container.  
- **docker-compose.yml files**  
  - setup groups of containers (each setup by a dockerfile) to get started at the **same time**; they specify  
  - **volumes** (shared folders between host and docker containers);  
***for example, the react.js build folder and nginx "root" folder get shared between 2 different containers, both of which reside on the host on which docker runs. This lets nginx serve react.js compiled javascript files to the web. [root defined in nginx default.conf file]***   
  - setup of **secrets** (with info such as db passwords db server url) etc. These originate from *.secret files, which get excluded from git so the world cant see your passwords.   
- in **[containerSetups/backend](containerSetups/backend)**:
  - Spring-Boot on docker
  - mysql on docker
  - phpmyadmin on docker. *its a web server which serves a console for the mysql database*
  - The **Spring-boot REST server** has code in the **[containerSetups/backend/spboot](containerSetups/backend/spboot)** folder, as a gradle project (initially created with spring-boot initializr). That folder is also an visual studio code project (visual studio adds .vscode folder)
- in **[containerSetups/frontend](containerSetups/frontend)**:  
  - Code for react.js and nginx are in  **[containerSetups/frontend/react](containerSetups/frontend/react)** and **[containerSetups/frontend/nginx](containerSetups/frontend/nginx)** respectively.
  - react.js is setup using Dockerfile **[containerSetups/frontend/react/Dockerfile.uses_react_node_modules](containerSetups/frontend/react/Dockerfile.uses_react_node_modules)**  
    Even though it copies source from host into container, this gets overidden by use of volumes in docker-compose.yml: Folders in host volumes replace what's copied into the container.
  - nginx on docker. The Dockerfile **[containerSetups/frontend/nginx/Dockerfile](containerSetups/frontend/nginx/Dockerfile)**
    copies a local config file **default.conf, which directs nginx setup** 
    into the where nginx wants it in container. Snippet from dockerfile:  
    ```
    # COPY line from host to dockerfile:
    COPY default.conf /etc/nginx/conf.
    docker-compose -f docker-compose-fullstackWithProfiles.yml down/default.conf
    ```
   - docker container hosting react.js
react.js pages are served 2 ways:
      - DEV: by the builtin react.js development server. It builds pages as soon as they are edited and serves them. It **does not build compiled javascript for production**. This is done by running a different command,  
      "npm run-script build"  
      The react development server gets started automatically by docker; it uses the line in the dockerfile ```ENTRYPOINT ["npm","start"]``` 
      - PROD: in production mode, nginx serves the pages in the "build" folder. These are compiled/optimized javascript and the react.js builtin dev server is not used. Nginx accesses this "build" folder via the docker volume setup. Setup details and instruction are in a following section.
      

## Setup of linux for either local dev box or cloud instance
- Cloud Setup: I use AWS Instance Ubuntu server, type t2.small. t2.micro can't seem to handle docker etc.  

- Vmware Setup:  **[Absolutely use a virtual workstation for this project because setup alters configuration. Don't use an actual machine you use for other things, otherwise you may break your machine!]**  
- This project works ok on the image **Ubuntu 21.10 (64bit).vmdk** downloaded from https://www.osboxes.org/ubuntu/
- ***DISABLE AUTOFILL FROM BROWSERS IN THE VM!***  
  ..in case you share your VM.
- After setting up an ubuntu vm on your computer, share a folder on the host with the vm:  
  Vmware Player menu at top of vmware player-> manage->Virtual-machine-settings->click option tab->Shared Folders->click add->put name as "remote" and host as "/mypc/sharedfolder" or whatever. A folder should appear on linux as */mnt/hgfs/remote*
  Create a shortcut to above (unix calls this a symbolic link): 
  ```
  ln -s /mnt/hgfs/remote /remote
  ```
  Now you have /remote under the linux root so your cloud and git login keys don't stay on the vm image. If share stops working, go back and "disable" share, then "enable again". 
- I made an effort to script setup of a new box in  **[Scripts/setupNewBox.sh](Scripts/setupNewBox.sh)**.   
You can try running this but errors may result and commands within may need to be run manually.   
Note that it installs VSCode, not needed on cloud box.  
As the ubuntu command **"apt install -y docker-compose"** installs an **outdated version** of docker, see the script for commented instructions for installing proper version.  
- Verify correct java jdk is installed, and that it's the jdk, not jre. If not, VScode and Gradle may fail with ambiguous error messages. If javac is not found, jre, not jdk was installed.  
  ```
  osboxes@osboxes$ java -version
  openjdk version "11.0.13" 2021-10-19
  OpenJDK Runtime Environment (build 11.0.13+8-Ubuntu-0ubuntu1.21.10)
  OpenJDK 64-Bit Server VM (build 11.0.13+8-Ubuntu-0ubuntu1.21.10, mixed mode, sharing)
  osboxes@osboxes$ javac -version 
  javac 11.0.13
  ```
 - **hhh alias**: Working this project requires many command line utilities with specific arguments. In order to speed this, there is a script 
**[Scripts/addHistory](Scripts/addHistory)** which **pushes command lines into bash history**.  To use it,  setup alias as shown below in ~/.bashrc and type "hhh", or just type "source Scripts/addHistory".
Then push up arrow to retrieve the desired command from history. 
- Below are some lines I use in ~/.bashrc
  ```
  alias h=history
  alias hhh='source Scripts/addHistory'
  alias gitpush='git add .; git commit -m "gitpushPc1"; git push;'
  # may need these also sometimes
  # cd gitproject
  # JAVA_HOME=/home/jdk/jdk-11.0.12-7
  # PS1=" > "
  # PATH=$PATH:$JAVA_HOME/bin
  ```
   
- Download zip file of this project and unzip to a working folder and proceed to next section.

## Setup of local linux for development
- ### first do setup in section **[Setup of linux for either local dev box or cloud instance](#setup-of-linux-for-either-local-dev-box-or-cloud-instance)**
- **IDE on linux:** I use visual studio code "VScode" for spring-boot and react.js. It works with gradle (used for spring-boot) and debugs ok. **FONT SIZE is important to me and vscode handles it better than other IDE's.** contl+ makes all fonts and icons larger so its usable by more people and on laptops.   
I run VSCode in 2 windows; one for spring-boot, other for react.js, both running servers within VSCode to enable debugging. To have both start at once, when exiting: file->exit on one instance and both will reopen upon next startup.  
**WARNING:** VScode uses java development kit (jdk) and setting up the path to it is weird. See section "*VSCode jdk path*" in notes/snafu section in this doc.  
**Extensions** needed for VScode for this project (Jan 2022):  
    - Gradle for Java v3.10.0  [gradle does not get installed on workstation. The gradlew script downloads & runs it somehow]
    - Spring Boot Dashboard v0.2.0  
*in VScode, install extensions by clicking on the blocks-shaped icon on the left and you get extension list*  
     - Debugger for Java v0.38.0


   VSCode gets run/debug configurations from files [containerSetups/backend/spboot/.vscode/launch.json](containerSetups/backend/spboot/.vscode/launch.json) and [containerSetups/frontend/react/.vscode/launch.json](containerSetups/frontend/react/.vscode/launch.json) respectively for the 2 projects.   
  When running spring boot within vscode, the hot-reload (lightning bolt) reloads code without
needing to rebuild the jar file, but doesnt apply config or CORS changes. [what is the mechanism?]  
- To open project in VScode, open a initial VScode window, open folder, and choose either *containerSetups/backend/spboot* or *containerSetups/frontend/react*. You can have both running at the same time, even having a react client using a spring-boot REST server running in their respective windows/debuggers.
 
- VScode and react.js:   
This project has a working VSCode react.js project in [containerSetups/frontend/react](containerSetups/frontend/react). To start debugging, click on the thing on the left which looks like a triangle with a bug on it. In the pulldown a top there are choices setup by file [containerSetups/frontend/react/.vscode/launch.json](containerSetups/frontend/react/.vscode/launch.json). Choose **"First Do This run chrome then 'npm start without browser' vscode"**. This opens a special browser connected to the VSCode npm debugger. Then choose **http 3008** which starts the react.js development server (without https).  
- Other ide's: **Eclipse** tree & menu font is too small for a lot of people to use.

## Build java and setup docker secrets
1) as a start, download zip of this project from github, unzip to local work folder but don't use git for now. Below is how to backup your work without losing too much disk space (be sure to verify the backup). Run from parent folder of full-stack-docr.  
Backs up full-stack-docr recursively (-r) while excluding (-x) build files which are disposable & get rebuilt.
    ```
    zip -r jan1backup.zip full-stack-docr -x *.git* */node_modules/**\* */spboot/build/**\* */mySqlWorkDir/**\*
    ```
1) The spring-boot project doesn't have a runnable jar because its excluded by the .gitignore file to save space when backing up on zipfile. Build the spring-boot runnable jar file using gradle. Do this with the command:  
    ```
    cd containerSetups/backend/spboot
    ./gradlew build
    # alternatively from project root:
    # Scripts/backEndSpringBootRedo.sh
    ```  
    File [containerSetups/backend/spboot/build.gradle](containerSetups/backend/spboot/build.gradle)
    controls the build process of gradle: *[it was created by Spring Initializr and modified several times. My approach to gradle is hit-and-miss and copy from examples, google error messages etc until it works. Gradle performs labelled tasks such as  :compileJava, :bootJarMainClassName, :jar, :startScripts, etc. I don't know where these are defined; Since it works for my purposes, I havent rtfm to figure this out. Comments appreciated!]*  
    
    The purpose of this gradle build is to create a jar file at `containerSetups/backend/spboot/build/libs/spring-boot-0.0.1-SNAPSHOT.jar` Later on, it gets copied into the container by the dockerfile during docker build (or secondhand by docker-compose) and later run by java at runtime. *an error will result when bringing up the container if this jar file is not present *

2) Docker Secrets 
  - Docker secrets get setup on your local dev and on the cloud instance. They appear as files on the docker container; to see them, login to docker container and run this:
    ```
    # from host running docker, login with:
    # docker-compose -f docker-compose-fullstackWithProfiles.yml exec webA sh
    # now you are on the docker container vm .. if not, container is not running!
    $ ls /run/secrets/
      dbUrl        mysqlPasswd    
    ```
  - this describes file-based docker secrets. There are other ways of setting up secrets.
  *WARNING: dont script secret-create scripts because github will get them and show them to everybody!* Instead follow these steps  
    
        ```
        # On cloud instance, you dont get a GUI editor so you need a terminal-based editor. nano is the easy linux editor. Use vi etc if wanted.
        # put in root password of your mysql installation
        # gets read once at first startup of db, then never again.
        nano secrets/docker/rootPass_newDBsetup.secret
        # user2 password to mysql installation. Used by spring-boot
        nano secrets/docker/mysqlPasswd.secret
        ```
    Now make the secret file the containing database URL, which varies between local (java cmd or visual studio) and cloud running of java code:  
    **first, cd to secrets/docker**, then **copy [secrets/docker/dbUrl.secret_blank](secrets/docker/dbUrl.secret_blank) to secrets/docker/dbUrl.secret** then edit this file as explained in existing comments (file is xml so it can have comments).  
  - Each of these secrets appear on the docker containers as file /run/secrets/mysecretABC. Config of these is directed by the docker-compose.yml files.


## Run docker and use scripts for code update

- CD to the top level of the project (where the docker-compose files are) and start the project using docker-compose shown below. A **"service"** in a docker-compose file can be spring-boot, a database, nginx web server etc.  
- Below are commands to start docker. Central to these docker-compose commands is file   
**[docker-compose-fullstackWithProfiles.yml](docker-compose-fullstackWithProfiles.yml)**  
which "extends" files: (see comments in these)  
**[docker-compose-backend..yml](docker-compose-backend.yml)**  
**[docker-compose-frontend.yml](docker-compose-frontend.yml)**  
After starting, run ***docker ps*** to see the ports where react.js or the web api's are visible. *preceed all commands with 'sudo' unless you did 'groupadd' described in this doc.*   
   <!--- below line needed to push below code block to the right --->  

   - shell commands; NOTE: starting docker for the first time takes a long time, depending on network speed because it downloads linux images from https://hub.docker.com, to serve as starting points for containers. The "FROM" thing in the dockerfile calls up this image.

      ```
      # Start all docker services: starts services having "dbOnly" or "allLayersA" tags
      docker-compose -f docker-compose-fullstackWithProfiles.yml --profile dbOnly --profile allLayersA up -
      # to see if containers successfully started, and to see what ports they use:
      docker ps
      # look for the line with "spbt_a" and "8086->8081/tcp". That's spring boot server running on port 8081 which docker made visible at port 8086. Now point browser to localhost:8086.
      # localhost:3008 shows react.js in similar manner
      # to view log of spring-boot container in real time (output of System.out.println from java code):
      docker-compose -f docker-compose-fullstackWithProfiles.yml logs -f webA
      # shut down all services
      docker-compose -f docker-compose-fullstackWithProfiles.yml down
      ```   
    - http://localhost:8086 You will be viewing an html page served by the spring-boot server; it tests spring-boot web api's using javascript fetch() or jquery ajax() commands. It's for testing only, as in a real setup react.js would serve frontend.
    To view from a server running on a cloud linux instance, substitute the assigned ip for *localhost*, also see snafu below concerning opening cloud ports.
    - ***at this point try out the "hhh" alias. Also, preceed commands with "sudo" unless you added user to group [search for "groupadd" in this file]*** 

      ```
      # OTHER COMMANDS
      # for only database to run, as for developing with ide locally. Starts only dbOnly tagged.
      docker-compose -f docker-compose-fullstackWithProfiles.yml --profile dbOnly up -
      # To interactive login to one of the containers just started called "webA". Lets you 
      #   do things like look at files such as /run/secrets files, put there by docker.
      # docker-compose -f docker-compose-fullstackWithProfiles.yml exec webA /bin/sh
      # from cloud svc: http://my.favorite.cloud.provider.instance:8086
      # To test db connection from cloud login shell:
      # curl -v telnet://localhost:3306 --output -
      ```

- Important tags in docker-compose.yml file:
    - **--profile** tag in docker-compose.yml: its a way to selectively activate some docker containers ["services"] and not others in the docker-compose.yml file. Look in the file to see the "profile names" such as allLayersA. (name chosen to show not a keyword).   
    - **Inheritance:** note that the file uses **extends** followed by the name of another dockerfile. This keeps the file small and readable by "inheriting" all attributes of that extend'ed file into this one, and overriding certain tags. 
    - ***SNAFU***: if you get message about docker-compose not recognizing tags in yml file, you may need another version of docker-compose application. To fix, search for "docComposeNotCompat" in SNAFU section of this doc.
    ***SNAFU: if cant connect, sometimes need to stop[down]/start[up -d] docker-compose again. If can't connect to page in cloud instance, see following:***
    - **SNAFU** When running on cloud only: cloud service must be configured to allow the chosen port to be visible on the internet, or it will be unreachable. Using the curl command when logged in on a cloud instance shell will verify it's running without needing to open the port. 



### Setup the test database:  
- **Database root password initialization**. 
At this point the root password of mysql is already setup using the password you supplied.  
This gets determined by the environment variable **MYSQL_ROOT_PASSWORD_FILE** defined in the docker-compose-xx.yml file. It gets used only once the first time the database is created and never again. Removing mysqlWorkDir will cause this to be used when docker is restarted.  

- Now docker is running with all the services, however mysql does not have the test database installed on it, or the user which spring-boot uses to connect to it, so web api's using the database will fail. These scripts will get used as shown below:
[Scripts/DatabaseCreateTestUserAndTable.sh](Scripts/DatabaseCreateTestUserAndTable.sh)     
[containerSetups/backend/mysql/dbscripts/createUserAndTable.sh](containerSetups/backend/mysql/dbscripts/createUserAndTable.sh)   
```
# docker must be up before running this
containerSetups/backend/mysql/dbscripts/createUserAndTable.sh
```
- Optional: Log in to the cloud instance from local [Scripts/RunCmdOnCloud.sh] and start docker and run the script. Start the cloud instance first, else there is nothing there to log into.  
  ``` 
  docker-compose -f docker-compose-fullstackWithProfiles.yml --profile dbOnly --profile allLayersA up -d
  Scripts/DatabaseCreateTestUserAndTable.sh
   ```  
  This script has a docker-compose command which logs into the mysql container and runs a script to load the db:      
  /dbscripts/createUserAndTable.sh 
- The above script is really doing the following, which you can do manually using [Scripts/RunCmdOnCloud.sh]  
  ```
  # Now login to the docker *container* which runs mysql. The "sh" command is the login shell.: 
  docker-compose -f docker-compose-fullstackWithProfiles.yml exec dbServiceA sh
  # Now from inside the container, run the script:
  /dbscripts/createUserAndTable.sh
  ```    
- A "docker volume" is used for db data, so if you delete/rebuild the container image you don't lose all your data [because it lives on the host computer].
So, if you really want to remove the old database files clear the shared volume as follows:  
      - First stop docker   
      - sudo rm -rf mysql/mySqlWorkDir/*  
      - Then start docker   
      - Then run the above script again.
   
- How to rebuild spring-boot server using new source code (uses the next script below):  
[Scripts/backEndSpringBootRedo.sh](Scripts/backEndSpringBootRedo.sh) 
- Generic container rebuild script. Run without args to see summary:  
[Scripts/rebuildContainerImage.sh](Scripts/rebuildContainerImage.sh) 

## Configuration of SSL HTTPS SSL Websocket wss
- I make no claim anything in this project is correct.  
- This section optional for this project.
- When the web audio api is used, except when running from localhost (as in using visual studio code), browser security requires **SSL, HTTPS, and ssl-websocket** configuration. 
- At project root, generate a "self signed" SSL certificate; make up a password for it and enter when prompted:  
\> *keytool -genkeypair -alias fsddkey -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore secrets/fsddkey.p12 -validity 99999*  
"secrets/fsddkey.p12" is the new certificate. It should not appear in git: [secrets](secrets)
The **[docker-compose-fullstackWithProfiles.yml](docker-compose-fullstackWithProfiles.yml)** file (and also Visual Studio code "launch.json") is setup to obtain the certificate password from the ".env" file in the folder where docker-compose it run. The problem is that git will show it to the world unless you have the proper setup. To address this, create a file 
"secrets/dockerEnvFile.env" in the secrets folder which should be excluded from git if things happen to be propery configured. Then make a link:  
\> *ln -s secrets/dockerEnvFile.env .env*  
Here are the contents of the .env file:  
sslHttpsPasswd=my-SSL-certificate-password  
HTTPS=true  
- Copy certificate file where it will by eaten by gradle and put inside the .jar file running spring boot:  
\> *cp secrets/fsddkey.p12 containerSetups/backend/spboot/src/main/resources/keystore*  
Verify .p12 file is excluded by git: [containerSetups/backend/spboot/src/main/resources/keystore](containerSetups/backend/spboot/src/main/resources/keystore) Its just plain embarrasing if its there in the archive. 
- Verify expiration date on certificate. It will always expire at the worst possible time without warning!  
\> *keytool -list -v -keystore secrets/fsddkey.p12*  
- NOTHING TAKES EFFECT UNTIL you rebuild the jar file so it contains the certificate
\> *Scripts/backEndSpringBootRedo.sh* Run on cloud instance if setting up there.
- VSCode optionally uses the certificate as setup in [containerSetups/backend/spboot/.vscode/launch.json](containerSetups/backend/spboot/.vscode/launch.json) and [containerSetups/frontend/react/.vscode/launch.json](containerSetups/frontend/react/.vscode/launch.json) respectively for the 2 projects. 

## Setup of ubuntu instance in cloud
- ignore all ssl setup unless you want the (advanced) web audio api pages to work properly; otherwise its not needed.
- because the cloud instance does not have a gui interface, you need to know some unix(linux) as outlined in prerequisites.
- Running cloud project requires local workstation and cloud instance to have access to the github repository, as it is used to propagate code updates from local to cloud. Refer to **[Github setup local and cloud instance](#github-setup-local-and-cloud-instance)**.  
- I use AWS Instance type t2.small, 8GB. First thing is to setup credentials for github and clone the project. Described in file **[HOWTO_FILES/setupCloudInstance](/HOWTO_FILES/setupCloudInstance)**.
- second do setup in section **[Setup of linux for either local dev box or cloud instance](#setup-of-linux-for-either-local-dev-box-or-cloud-instance)**. Login to the cloud requires setup of access keys described below.
- This project has a script **[Scripts/RunCmdOnCloud.sh](Scripts/RunCmdOnCloud.sh)** to remotely run things on the cloud instance from your local linux and to login to it. Before it will work, you need to setup a **secrets** file from which it obtains login credentials. *NOTE: not needed on cloud instance*  
- **Setup secrets for cloud commands:** All sensitive information used by **[Scripts/RunCmdOnCloud.sh](Scripts/RunCmdOnCloud.sh)** is in the secrets file. Use  **[secrets/root-level-remote](secrets/root-level-remote)** as a model for files appearing in /remote described below; all files in git are blank stand-ins. 
  - create file **/remote/cloudInstanceLogin.secret** by copying file **[secrets/root-level-remote/cloudInstanceLogin.secret_blank](secrets/root-level-remote/cloudInstanceLogin.secret_blank)** to /remote/cloudInstanceLogin.secret **same name without  "_blank"**. *this file is NOT a docker secret*
  - Then edit it per comments inside the file.
  - It sits on the /remote folder which the linux vm gets shared by the host computer. Done this way for security to keep login creds out of the linux image, in case you share it. 
  - Next, put the login keys you obtained for the cloud service when you created the instance into the vmware host's folder shared with /remote on the vm. You can optionally put github deploy keys here too, but edit ~/.ssh/config to set this up.  
  - **[Scripts/RunCmdOnCloud.sh](Scripts/RunCmdOnCloud.sh)** works by taking the command you want to run on the cloud as commd line argument. It can also be piped to and preceeded by local commands such as "git push", to provide a workflow from local code to the cloud in one line. Below are examples [before they will run, must setup secrets file shown next]:
  ```
  # login to cloud instance
  Scripts/RunCmdOnCloud.sh
  # run the "ls Scripts" command and return
  Scripts/RunCmdOnCloud.sh "ls Scripts"
  # see examples of usage
  Scripts/RunCmdOnCloud.sh --help
  # for backend dev, push local git then on cloud: git pull/build/springboot jar/rebuild docker image/restart docker service
  (gitpush) && Scripts/RunCmdOnCloud.sh "git pull && Scripts/backEndSpringBootRedo.sh"
  # for frontend dev, push local git then on cloud: git pull
  (gitpush) && Scripts/RunCmdOnCloud.sh "git pull"
  ``` 
  some examples using unix pipes:  
  ```
  echo cheese|Scripts/RunCmdOnCloud.sh "cat - > cheesefile"
  Scripts/RunCmdOnCloud.sh "cat cheesefile"
  Scripts/RunCmdOnCloud.sh "ls -l cheesefile && cat cheesefile"
  ```
## Github setup local and cloud instance
- The cloud instance uses github to update its code after the dev box pushes it. See [HOWTO_FILES/ssh_config_example](HOWTO_FILES/ssh_config_example) which has comments describing how to set it up.  
Below are optional remote copy commands/config to save redoing everything in the cloud again:  
[NOTE:] git commands shows here must be run from project root, not a subfolder!  
  ```
  cat ~/.ssh/config | Scripts/RunCmdOnCloud.sh "cat - > ~/.ssh/config.copied"
  # to verify copy:
  Scripts/RunCmdOnCloud.sh "ls -l ~/.ssh/config.copied"
  # copy git deploy key to cloud instance from local [is this a security problem??]:
  cat /remote/id_rsaXYZ.pub | Scripts/RunCmdOnCloud.sh "cat - > ~/.ssh/id_rsaXYZ.pub"
  cat /remote/id_rsaXYZ | Scripts/RunCmdOnCloud.sh "cat - > ~/.ssh/id_rsaXYZ"
  # to copy local .bashrc so you can copy/paste chosen lines into cloud instance
  cat ~/.bashrc | Scripts/RunCmdOnCloud.sh "cat - > ~/.bashrc_example_from_local"
  ```
## Production react.js
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

## Snafus and Notes 
- **SNAFU "vmware snafu":**  if **VMWARE PLAYER host folder sharing stops** working, go into vmware player->manage->virtual machine settings, click Options tab at top, choose shared folders. Then disable the shared folder, click ok, repeat and enable it and it works. Restarting vm does not fix this problem! Can do while its running. 
**Migrate vmware disk file vmdk on new pc and network doesn't work:** I fixed by suspending vm, when it restarted network worked ok. Huh?
- **SNAFU "Visual Studio Code suddenly wont run spring-boot/.js files stick on old version"** on project which used to run fine, with express train to nowhere message: *"Error: Unable to initialize main class com.example.springboot.Application"*. **Cause:** You did a git pull, but VSCode didn't know to build its own internal jar [where is it anyway? It's not in build.]. **Fix:** jog it by inserting a blank in a java/.js file, and it will rebuild the jar/recompile the new react.js file.
- **SNAFU ".eslintcache and nonexistent errors"** running nodejs for react causes warnings which you fixed weeks ago and havent been in the code for a while. Cause: the  .eslintcache file, even if excluded in .gitignore causes this, so delete it periodically.
#    problems which no longer exist, but are cached. So delete this file if that happens.
- **SNAFU "react docker or launch.json issues":**
   a) react.js dockerfile: command "npm install" sometimes fails with error about network connection. Fix it by rebooting computer (or vm). May be something about server blocking access?  
   b) react.js server: environment variables defined in launch.json or docker must begin with "REACT_APP_" or they are silently ignored. ie: "REACT_APP_flavor2": "peppermint2",
- SNAFU: "npx create-react-app my-app" requires node14.x (not installed using "apt install -y nodejs") To install node14.x on ubuntu:  
  https://nodejs.org/en/  has a download button on homepage, but also links to these below:
  ```
  # from https://github.com/nodesource/distributions/blob/master/README.md#deb
  curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -  
  sudo apt-get install -y nodejs
  ```
- NOTE: SSL/HTTPS served by docker-compose or react.js dev server.  
See notes in file docker-compose-fullstackWithProfiles.yml for how it's done, and how to hide the password for the certificate as a secret. For VSCode, see launch.json for entry; separate notation used for spring-boot vs react.js project here.  
- **SNAFU: "symbolic link javascript react"** If your react.js javascript code imports a javascript file which is a unix symbolic link to a real file, you then get led right into the quicksand by the resulting error message: *"Support for the experimental syntax 'classProperties' isn't currently enabled"*.
In containerSetups/frontend/react/src/webaudio/WebAudioApiTest.js, see line:  
*import { color, sndHelper, STOPNOW } from  "./sndHelperA_realcopy.js";*  
Fix: copy link to a real file and it works. Research appears to show its a bug.  
- **SNAFU: "javascript web service ssl unsigned** when calling REST websvc or websocket from react.js, connection will fail because of self-signed certificate; FIX: from SAME browser, browse directly to the spring-boot html pages it serves, browser will say "are you sure you want unverified website?", answer yes and access from websvc via react.js will work. It does not help to import the .p12 certificate to the browser.
- NOTE: "**VSCode jdk path**"   
*Setting up jdk path for Visual Studio Code.*  
  - be sure to install jdk [java dev kit], NOT jre [java runtime only]. If you install jre by mistake (I did), VSCode malfunctions with misleading error messages. If "java" can and "javac" cant be run from a shell, you installed jre.  
  - When first running VScode, it may complain no jdk is found; to fix, file->preferences->settings  ...  a gui editor now appears and is useless; now click the little rectangle on upper right (labeled open settings(JSON)) with little bumps on it, and it switches to a TEXT editor for the config file. Now insert line like:   
"**java.jdt.ls.java.home": "/usr/lib/jvm/java-11-openjdk-amd64**" or  
"**java.home": "/usr/lib/jvm/java-11-openjdk-amd64**"    
make sure you give the actual jdk installation folder, not link to java or javac. *A popup may also invoke the editor; be sure to switch to text mode or it is useless.*  
  - The above edit edits file ~/.config/Code/User/settings.json . This file can be overridden in a project by file .vscode/settings.json in a project root, but that is a bad idea.
- NOTE  
Spring-boot gradle file builds a jar with your code and app server built-in. This gets started by docker shown in later section, but if you want you can run it directly from the shell:  
*java -jar build/libs/spring-boot-0.0.1-SNAPSHOT.jar*   
When using thing in build.gradle:   ->   id 'org.springframework.boot' version '2.6.3'
*java -Dspring.main.allow-circular-references=true -Dserver.port=8086 -jar build/libs/spring-boot-0.0.1-SNAPSHOT.jar*
  Typically you run it directly from the IDE for debugging. The build.gradle entry:
**"id&nbsp;&nbsp;'org.springframework.boot'&nbsp;&nbsp;version&nbsp;'2.2.2.RELEASE'"** builds the jar with an embedded tomcat server. *[where is this defined or documented?]*
- NOTE    
VScode with private github repo [I dont use this instead use git command line]: setup ssh as described in [HOWTO_FILES/ssh_config_example](HOWTO_FILES/ssh_config_example). Then, open terminal window, type "ssh-add /remote/id_rsaABC" and then "code" (this starts vscode). This makes vscode inherit ssh key from shell and now can access via ssh using vscode's github stuff. 
- SNAFU lets say you add a new library to react.js, such as bootstrap, and run "npm i react-bootstrap bootstrap", and it works in the VScode but not in docker, which produces an error about a bootstrap css file not found. Thats because the docker image must be removed and rebuilt for the new package.json to take effect. In this case it's 2 images, "*docker image rm image_react_container image_react_node_modules_downloaded*".
- SNAFU  
  Gradle is setup in a project by scattering several scripts folders and .hidden  folders around your project root folder. 
    - I use the "gradle initializr" website to create these and copy to my project.
    - using the wrong version of gradle results in misleading errors. Version is defined in containerSetups/backend/spboot/gradle/wrapper/gradle-wrapper.properties
    - There is no gradle executable on your computer; instead gradle is run using "./gradlew build", or "./gradlew clean" etc, which is an above script which fetches a specific version of gradle specified in other above files and runs the build. VSCode gradle plugin shows all the many similar gradle tasks. These are defined somewhere; I dont know how to see where without mastering gradle. Gradle is a great tool I wish there was a good tutorial showing what is where and how. 

- NOTE Optional: how to setup a new react.js project from scratch ***project already has a react.js project***:
  ``` 
  # install node & npm first then, 
  npx create-react-app react_app1
  # then cd to the react_app1.
  # Following looks in package.json file created 
  # by above and loads 160 MB(!) of dependencies 
  # into node_modules folder so react.js can run.
  npm install
  # then, start the react.js development server
  npm start  
  # later on, do production build. Generates  
  # js files in the build folder. Nginx serves these
  # by way of docker-compose volumes (shared folders)
  npm run-script build  
  ```

- SNAFU: JDK11 WONT ALLOW APP TO RUN ON PORT LESS THAN 8000?
RUNNING ON PORT 80 GIVES A USELESS "PERMISSION DENIED" ERROR WITH NO CLUE!
USING PORT 8080 OR 8082 TESTS OK
- SNAFU: using vi editor (and maybe others) to edit secrets file:  
  ***problem: editor adds a newline to end of file without you knowing it***  
  This is a problem if your code reads the secrets file, and the newline breaks a password
  it contains.   
  NOTE: **MYSQL_ROOT_PASSWORD_FILE** defined in docker-compose-xx.yml) IT TRIMS THE NEWLINE!, so using vi edit is ok for that.   
  Fix: "echo -n "change\$me" > secrets/docker/mysqlPasswd.secret" [note the dollar sign needs to be escaped].   
  ANOTHER FIX USED IN THIS PROJECT: The CloudHelper.java function which reads secrets 
  trim()'s the newlines. It took a while to find this bug so what's why its a snafu.  
- SNAFU: "docComposeNotCompat" Docker-compose wont work with your docker-compose.yml file. Reason may be you file contains tags incompatable with default installed docker-compose.
  ```
  ******  default docker-compose may not work with docker-compose.yml files in this project *****
  docker-compose version problem This project's docker-compose files use the "profiles" and "donotstart" tags for easily disabling containers. The default docker-compose may not support these. If so, install docker-compose using the following instructions. Version is at top of docker-compose files. After uninstalling the current docker-compose, do this:
  # DO THIS TO INSTALL. Goto https://docs.docker.com/compose/install/, then
  # click LINUX tab and see the following, which copies into /usr/local/bin. 
  # The line is below, but copy/paste from here is not advisable as it may have been altered.  
  sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  # NOTE: https://github.com/docker has a git "verified" tag.
  ```
- SNAFU: **CORS CROSS BROWSER ERROR** In browser, which using javascript fetch() to get a spring-boot content, get error *...has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource...*  First of all, using **no-cors in fetch() results in BLANK** content so thats no good. The fix is to modify the spring-boot service, adding **@CrossOrigin** tag to code [search text for it] to fix this problem. Be sure to restart app after doing this. 

-SNAFU: the vi editor adds a linefeed to end of every file so make sure to trim() it first in the java code. When mysql reads the root secrets file (see **MYSQL_ROOT_PASSWORD_FILE** defined in docker-compose-xx.yml) IT TRIMS THE NEWLINE!, so using vi edit is ok for that. In code, be sure to trim passwords obtained from files in case the newline is present.

- SNAFU: when running "git pull" get error about needing remote and branch.
Fix: "git pull git@host_rsaABC:txtjqm/full-stack-docr.git"  

### MARKDOWN EXAMPLES  
### DO NOT DELETE!
readme.md is called **markdown**, described here  https://www.markdownguide.org/basic-syntax/
An online editor is at https://stackedit.io/app#


This is what github markdown calls "fenced code block":  
Make sure that this line ends with AT LEAST 2 SPACES!!!!
```
    ssh -i "/c/mywork/awsKeyPair123.pem" ubuntu@xx.xx.xx.xx "cd spboot-nginx-reactjs-compose && ./GitPullAndRebuildAndCopyToContainer"
```
weird, but putting it in a list indents it:
- example:  
   ```
   ssh -i "/c/mywork/awsKeyPair123.pem" ubuntu@xx.xx.xx.xx "cd spboot-nginx-reactjs-compose && ./GitPullAndRebuildAndCopyToContainer"
   ```

### how to indent code blocks in nested list:
3) first indent
bla blah blah
    ```
    # indented code
    blah3333 blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
    ```
   - second more indented
     ```
      blah222 blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
now normal text. Don't know why text block stops??
### end how to

end


