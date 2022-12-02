#!/bin/bash

# edit this:
DOCKERFILE=docker-compose-backend.yml

echo dockerfile \"$DOCKERFILE\" is used in this script. Edit if wrong.
echo running script on mysql container "dbServiceA" which creates
echo a test database. This is done using the docker-compose "exec" command.
echo It does NOT use a msql client on the host!
echo 
# notice: this runs on the container so the script was copied by dockerfile

#  commd='ssh -i '$keyFileForCloudRemoteInstance' '$remoteInstanceUrl' '$remoteCmdLine
commd='docker-compose -f '$DOCKERFILE' exec dbServiceA /dbscripts/createUserAndTable.sh'

echo command line:
echo $commd
$commd

echo done
