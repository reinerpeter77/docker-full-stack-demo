#!/bin/bash
tput bold
export TERM="xterm-256color" # to prevent error message when using tput command
DOCKERFILE=docker-compose-fullstackWithProfiles.yml
# DOCKERFILE=docker-compose-backend.yml
CONTAINERNAME=webA_container
IMAGENAME=spbt_a
DOCRCOMPOSE_SVCNAME=webA
# ref: https://linux.101hacks.com/ps1-examples/prompt-color-using-tput/
# to test colors:..... tput setab 7; tput setaf 0; tput bold; echo laksjdf
# edit this: these are from docker-compose*.yml
#echo DOCKERFILE=$DOCKERFILE, CONTAINERNAME=$CONTAINERNAME
#echo IMAGENAME=$IMAGENAME, DOCRCOMPOSE_SVCNAME=$DOCRCOMPOSE_SVCNAME
spbootHome="containerSetups/backend/spboot"
echo -e "[backEndSpringBootRedo.sh] \nNow cd to $spbootHome and \"./gradlew build\""
# rebuild spring boot jar with new code
cd $spbootHome
# echo files in containerSetups/backend/spboot:
# ls
./gradlew build
if [ $? != 0 ]
then
  echo gradle build failed. Exiting. Visual Studio shows filename in red if error!
  cd ../../..
  exit;
fi
echo JAR now built
cd ../../..
ls -l $spbootHome/build/libs/*.jar
echo "date now is: " $(eval date); 

webA_running=$(docker-compose -f $DOCKERFILE ps| grep $CONTAINERNAME | wc -l)
# this shuts down the container...
Scripts/rebuildContainerImage.sh $DOCKERFILE $CONTAINERNAME $IMAGENAME $DOCRCOMPOSE_SVCNAME

if [ $webA_running == 1 ] # WARNING leave blank after "["
then
  echo $(tput setaf 2)now bringing up container because it was running before calling this $(tput sgr0)
  docker-compose -f $DOCKERFILE up -d $DOCRCOMPOSE_SVCNAME
  # docker-compose -f $DOCKERFILE restart $DOCRCOMPOSE_SVCNAME [error bc not running]
fi

# echo -e $(tput setaf 3) $(tput setaf bold)

tput setaf 1; tput bold
# white background..   tput setab 7
echo THIS IS WHAT I JUST DID:
echo -e "[backEndSpringBootRedo.sh] \ncd containerSetups/backend/spboot\
     \n./gradlew build [builds jar file in build/libs] then calls:\
     \n$(tput setab 7; tput setaf 0; tput bold; )Scripts/rebuildContainerImage.sh $DOCKERFILE $CONTAINERNAME $IMAGENAME $DOCRCOMPOSE_SVCNAME$(tput sgr0; tput setaf 1; tput bold;)\
     \nwhich shuts down docker container, removes its docker image, \
     \nbuilds a new image and restarts docker container using new image"

echo -e $(tput sgr0)
# vi editor: :map + i# ^[j0    -- cntrl-v then press esc key to make ^[ thing 

