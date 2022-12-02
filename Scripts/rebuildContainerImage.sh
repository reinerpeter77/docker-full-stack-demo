#!/bin/bash

# ref: https://linux.101hacks.com/ps1-examples/prompt-color-using-tput/
echo -e $(tput setaf 3; tput bold); echo "starting [rebuildContainerImage.sh] "

if [ $# != 4 ]  # USE SPACE EITHER SIDE OF BRACKET [  OR ] ELSE MISLEADING ERROR MESSAGE OCCURS
then
  echo $(tput setaf 3; tput bold)use form DOCKERCOMPOSEFILE CONTAINERNAME IMAGENAME DOCRCOMPOSE_SVCNAME
  echo Typical lines:
  echo $0 docker-compose-backend.yml IGNORED mysql_dockerfile dbServiceA
  echo $0 docker-compose-backend.yml IGNORED spbt_a webA
  exit;
fi
# echo $(tput sgr0; tput bold)

DOCKERFILE=$1
CONTAINERNAME=$2
IMAGENAME=$3
DOCRCOMPOSE_SVCNAME=$4

cmdA="docker-compose -f $DOCKERFILE stop $DOCRCOMPOSE_SVCNAME"
eval $cmdA; 
cmdB="docker-compose -f $DOCKERFILE rm -f $DOCRCOMPOSE_SVCNAME"
eval $cmdB; 
cmdC="docker image rm -f $IMAGENAME" 
eval $cmdC;   
cmdD="docker-compose -f $DOCKERFILE build $DOCRCOMPOSE_SVCNAME"
eval $cmdD; 

echo $(tput setaf 3; tput bold) 
echo "[rebuildContainerImage.sh]  I just ran these commands:"
echo $cmdA
echo $cmdB
echo $cmdC
echo $cmdD 
echo [rebuildContainerImage.sh] END 
# vi editor: :map + i# ^[j0    -- cntrl-v then press esc key to make ^[ thing 

