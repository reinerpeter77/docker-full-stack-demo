#!/bin/bash

# 2/1/2022
echo MUST RUN AS:  sudo ./setupNewBox
echo This script sets up software on a new box for the project
export TERM="xterm-256color" # to prevent error message when using tput command

# first change password from default
# sudo passwd

apt install -y curl
#
echo -e $(tput setaf 1) # set color to red
commd='curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose'
echo default docker-compose cant handle \"profile\" tags, so now getting newer version from github. Command:
echo $commd
echo WARNING THIS COPIES A WEB LOCATION AS AN EXECUTABLE TO LOCAL MACHINE!
echo "***" DO YOU TRUST THIS FILE AS AN EXECUTABLE ON YOUR MACHINE? "***"
echo enter y to continue, anything else to quit
read userInputA
if [[ $userInputA != y ]] 
then echo exiting;  exit; fi
eval $commd
# curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
echo $(tput sgr0) # sets color to default. Works for all backgrounds so text wont be invisible
echo done with curl download command

sudo apt install -y openjdk-11-jdk-headless
# puts it in ls /usr/lib/jvm/java-11-openjdk-amd64/
# warning: dont install "apt install -y openjdk-11-jre-headless" by mistake otherwise VScode mysteriously fails. JDK vs JRE. If you run java on ubuntu, it tells you to install jre, not jdk. Why do they name it with jdk followed by jre in its name??

echo making docker group, adding user to it
# some of these snippets are from
# https://docs.docker.com/engine/install/linux-postinstall/
# now add group "docker" and add self to it
sudo groupadd docker
# -a means add user to group; -G means the list of groups follows; 
# $USER is enviroment var set to current user.
 usermod -aG docker $USER
# commands to verify new group created and user is in it.
cat /etc/passwd- |grep osboxes
cat /etc/group|grep docker

# put custom stuff at end of .bashrc
# cp .bashrc .bashrc.orig
# vi .bashrc


# vstudio code:  snap install --classic code
 snap install --classic code
 
# once running vscode, install extensions :
#    run->install additional debuggers->and chose "Spring Boot Dashboard for VSCode" 
#    new...??  "Extension Pack for Java v0.21.0"
#    new ..?? Gradle for Java

 apt install -y nodejs
 # UPDATE: april 2022 installs nodejs version 12, which wont work with "npx create-react-app my-app"
 # from https://github.com/nodesource/distributions/blob/master/README.md#deb
 # curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -  
 # sudo apt-get install -y nodejs
 ## update: july 2022 above fails instead download
 # download node binary from nodejs website and put into
 # /usr/local/node-v16.16.0-linux-x64/
 # in ~/.bashrc:
 # export NODEJS_HOME=/usr/local/node-v16.16.0-linux-x64
 # PATH=$PATH:$NODEJS_HOME/bin
 # may need to uninstall node (something like this):  apt-get remove nodejs


# apt install -y git
 
apt install -y docker.io
##################  apt install -y docker-compose
# this does not work with docker-compose files using the
# "profile" tag/argument docker-compose. instead:
 apt install -y curl

 apt install -y npm
 
 
# history | cut -c 8- > setupHist_2

#####echo Now go to vmware setup and share folder with host [manage->settings->options]
#####echo and re-run these commands:
# verify folder is setup
#####ls /mnt/hgfs/  
# make available as /remote. This will fail until you do above vmware setup
#### this was probably done before getting this file ->    ln -s /mnt/hgfs/remote /remote

#####################
echo this part builds node_modules in react project using package.json
cd containerSetups/frontend/react
currFolder=$(echo `pwd`| sed -n 's/.*\/\(.*\)/\1/p')
echo $currFolder
if [[ $currFolder != 'react' ]] 
then echo not finding containerSetups/frontend/react folder. exiting.s;  exit; fi
# read package.json to install all the react.js node.js stuff
npm install
echo npm install done in 'pwd'
# this was run once, and it put entries into package.json for react-bootstrap so it never needs to be run again -> npm i react-bootstrap bootstrap
cd ../../../
################ END... this part builds node_modules in react project using package.json


echo end of setupNewBox.sh

