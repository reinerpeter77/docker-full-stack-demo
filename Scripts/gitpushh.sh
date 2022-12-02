#!/bin/bash

# ref: https://linux.101hacks.com/ps1-examples/prompt-color-using-tput/
# echo input item count = $#

# setup in .bashrc:   alias gitpushh=Scripts/gitpushh.sh

if [ $# -lt 1 ]  # USE SPACE EITHER SIDE OF BRACKET [  OR ] ELSE MISLEADING ERROR MESSAGE OCCURS
then
  echo $(tput setaf 3; tput bold)use form:
  echo $0 my commit message
  echo Typical line:
  echo $0 works ok but crashes a lot
  echo $(tput sgr0; tput bold)
  exit;
fi
# echo $(tput sgr0; tput bold)
commitMsg="$*"
echo $commitMsg
commd="git add .; git commit -m '$commitMsg'; git push;"
echo $(tput setaf 2; tput bold) command line: $(tput sgr0) $commd
echo $(tput setaf 2; tput bold) Starting remote command $(tput sgr0)
eval $commd

# vi editor: :map + i# ^[j0    -- cntrl-v then press esc key to make ^[ thing 

