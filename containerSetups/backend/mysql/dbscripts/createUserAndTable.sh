#!/bin/bash

# This script makes a sample user, sample schema and sample table and loads with sample data.
# DB passwords are obtained from the docker secrets mechanism.
# It produces files in /run/secrets with are used here in the command
# line to provide passwords to mysql commands.
# These secrets are setup by docker-compose.yml
# They are not stored on the github repo because of this line in .gitignore:
#    *.secret
# Because of this they must be setup after git clone.
# NOTE: See file AmakeSecretFiles to see how to avoid linefeeds in secrets file, which messes up passwords!

# below, mysql is the db schema to use.
# creates a new user from script
cat newUser.sql | sed "s/\*\*\*/$(cat /run/secrets/mysqlPasswd)/" | mysql -h localhost --port 3306 -u root --password=$(cat /run/secrets/rootPass_newDBsetup) mysql
# creates a new table and loads with test data
cat dbexport.sql |  mysql -h localhost --port 3306 -u dbUser2 --password=$(cat /run/secrets/mysqlPasswd) dbUser2

# this logs in as root
# mysql -h localhost --port 3306 -u root --password=$(cat /run/secrets/rootPass_newDBsetup) mysql

# shows how to use sed to substitute xxx in scripts with the real password.
# echo helxxo | sed "s/xx/$(cat /run/secrets/mysqlPasswd)/"
# echo hel**o | sed "s/\*\*/$(cat /run/secrets/mysqlPasswd)/"

