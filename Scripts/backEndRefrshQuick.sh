#!/bin/bash

echo QUICK BUILD PUSHES CODE TO CONTAINER. CHANGES LOST WHEN CONTAINER STOPPED!
echo "***Now rebuilding spboot JAR file, and pushing to running container " $CONTAINERNAME
echo "***WARNING: ephemeral: change gets LOST when container is stopped."
echo "***For permanent change, see script backEndSpringBootRedoAll.sh"

# edit this:
DOCKERFILE=docker-compose-backend.yml
CONTAINERNAME=webA_container
DOCRCOMPOSE_SVCNAME=webA
# note: above things get named in docker-compose.yml
echo "*** example:  docker-compose -f " $DOCKERFILE " up -d"
webA_running=$(docker-compose -f $DOCKERFILE ps| grep $CONTAINERNAME|wc -l)
if [ $webA_running != 1 ]   # WARNING leave blank after "["
then
  echo "*** " $CONTAINERNAME " is not running on docker. Container needs to be started. Exiting.."
  exit
else
  echo "*** building spboot and pushing jar to running container " $CONTAINERNAME
fi

cd containerSetups/backend/spboot
./gradlew build
cd ../../..

# copy jar to container using CONTAINER NAME (not service) name:
docker cp containerSetups/backend/spboot/build/libs/spring-boot-0.0.1-SNAPSHOT.jar $CONTAINERNAME:testApp.jar
# copy is not enough, need to restart to make it take effect
docker-compose -f $DOCKERFILE restart $DOCRCOMPOSE_SVCNAME
echo "*** docker-compose -f " $DOCKERFILE " ps"

