
#!/bin/bash

# .........SEE DOCUMENTATION AT END 
# TERM="xterm-256color"
CLOUD_INSTANCE_SECRETSFILE=/remote/cloudInstanceLogin.secret
# if [[ ! -f $keyFileForCloudRemoteInstance ]]; then
# check if vmware player dropped the folder sharing. Happens sometimes.
if [[ $(ls -l /remote/* | wc -l) -eq 0 ]]; then
    echo
    echo FAILURE: shared vmware folder \"/remote\" is empty.
    echo It contains keys for remotely running commands in cloud instance,
    echo while avoiding putting sensitive keys on the guest OS image. It also contains
    echo a config file for this script \""$CLOUD_INSTANCE_SECRETSFILE"\".
    echo Fix: see documentation in this script "$0"
    echo Now Exiting.
    exit
fi
if [ "$1" == '--help' ] || [ "$1" == '-help' ]  # USE SPACE EITHER SIDE OF BRACKET [  OR ] ELSE MISLEADING ERROR MESSAGE OCCURS
then
  echo $(tput setaf 1) # set font color 1==red
  echo This script remotely runs commands on cloud instance 
  echo examples: $(tput setaf 4)
  echo 1\) "$0"                   \# open a shell in cloud instance
  echo 2\) "$0 \"ls secrets\" "   \# list secrets folder
  echo 3\) "(gitpush) && $0 \"git pull\" " \# gitpush local then git pull on cloud 
  echo 4\) "(git add .; git commit -m 'abcd'; git push;) && $0 \"git pull\"" \# same without using alias
  echo 5\) "Scripts/RunCmdOnCloud.sh \"cat Scripts/RunCmdOnCloud.sh\""
  echo 6\) push local code then tell cloud instance to git pull and build backend code and reload docker
  echo     "(gitpush) && Scripts/RunCmdOnCloud.sh \"git pull && Scripts/backEndSpringBootRedo.sh\""
  # (gitpush) && Scripts/RunCmdOnCloud.sh "git pull && Scripts/backEndSpringBootRedo.sh"
  echo $(tput sgr0)
  exit;
fi
echo $(tput sgr0)
# echo command: $@
# command to cd to project home on instance
# cdCmd="cd /home/ubuntu/full-stack-docr/full-stack-docr"
cdCmd="cd ~/projs/full-stack-docr"

if [ $# == 0 ] # just do a login shell
then 
  remoteCmdLine="$@"
else
  remoteCmdLine="$cdCmd && $@"
fi
echo remoteCmdLine: 
echo $(tput setaf 1) "$remoteCmdLine" $(tput sgr0)

# this is the file with the <addr> and <key> tags and must not be public.
# Excluded from git using entry in .gitignore, and also on a shared folder with vmware host, so
# local linux image never has this file.
if !(test -f "$CLOUD_INSTANCE_SECRETSFILE"); then
  echo $CLOUD_INSTANCE_SECRETSFILE + " not found. You may need to create one using " $CLOUD_INSTANCE_SECRETSFILE"_blank"
  echo or your vmware host is not sharing to linux the /remote folder. See snafu section of docs.
  exit;
fi
# Obtain tags from file: sed command uses regex using capture, in this case the first capture is used.
remoteInstanceUrl=$(sed -n 's/.*<addr>\(.*\)<\/addr>.*/\1/p' $CLOUD_INSTANCE_SECRETSFILE )
#                             ^^ eat everything up until this tag  
#                                       ^^ capture all between tags
#                                                      ^^ output capture
#                        ^^ -n dont print nonmatch lines  ^p=print the match (match 1)
keyFileForCloudRemoteInstance=$(sed -n 's/.*<key>\(.*\)<\/key>.*/\1/p' $CLOUD_INSTANCE_SECRETSFILE )
echo POSSIBLY MAY WANT TO REMOVE THESE MESSAGES ON PROD.
echo using secrets file: $CLOUD_INSTANCE_SECRETSFILE
echo remoteInstanceUrl: $remoteInstanceUrl
echo keyFileForCloudRemoteInstance: $keyFileForCloudRemoteInstance

# now assemble the full ssh command with access key, remote url and command to be run on it:
# NOTE: error result when quotation marks accidentally get included in the string variables!
commd="ssh -i '$keyFileForCloudRemoteInstance' '$remoteInstanceUrl' '$remoteCmdLine'"

echo $(tput setaf 2) command line: $(tput sgr0)
echo $commd
echo $(tput setaf 2) Starting remote command $(tput sgr0)
# NOW RUN THE COMMAND
# exit
eval $commd
echo $(tput setaf 2) Done on remote $(tput sgr0)

exit

# this script uses cloud login key in a file at /remote, shared with vmware host.
# It shares at /mnt/hgfs/remote. Use below to create symbolic link.
# sudo ln -s /mnt/hgfs/remote /remote
# SNAFU: if host folder sharing stops working, to into vmware player->
# manage->virtual machine settings, click Options tab at top, choose
# shared folders. Then disable the shared folder, click ok, repeat and
# enable it and it works. Restarting vm does not fix this problem!



