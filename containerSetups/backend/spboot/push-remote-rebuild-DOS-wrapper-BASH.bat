

echo 01-07
echo THIS IS A DOS BATCH FILE WHICH CALLS THE BASH SHELL INSTALLED BY GIT, WHEN INSTALLED ON A PC
echo THE BASH SCRIPT CALLED BY THIS WRAPPER DOES GIT PUSH ETC, THEN CALLS REMOTE SCRIPT ON CLOUD MACHINE TO REBUILD/RESET
rem here is the weurd place git installs bash.exe:
set GITBASH=%HOMEPATH%\AppData\Local\Programs\Git\bin\bash.exe
if not exist %GITBASH% (
    echo this batch file depends on git-bash being installed at:
    echo  %GITBASH% 
    echo It was not found there. git-bash gets installed on windows by installing git, 
    echo which automatically installs git-bash in addition to git.
    echo Either git is not installed on this pc or the bash.exe is in a different location, maybe for a different user.
    pause
    exit
) 
echo %GITBASH% exists
rem %GITBASH% -c "date; pwd; read -n1 -s -r -p $'Press key to continue...\n' key"
rem NOW CALL THE BASH SCRIPT THAT DOES THE ACTUAL WORK
%GITBASH% -c "./push-remote-rebuild"
