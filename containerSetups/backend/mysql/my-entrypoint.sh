#!/bin/bash
# this is a failed attempt to start mysql using a custom script
# which sets up a sample databae/user


echo now starting mysql from my-entrypoint.sh 345
# this is default entrypoint from dockerfile pointed to by dockerhub mysql
# it is a link (ln -s) pointing to the real one.


###exec /entrypoint.sh "$@"
# WARNING: NEVER GETS HERE BC ABOVE NEVER RETURNS!
###exec containerSetups/mysql/dbscripts/createUserAndTable
###echo after starting mysql
# ok:   exec /usr/local/bin/docker-entrypoint.sh "$@"
