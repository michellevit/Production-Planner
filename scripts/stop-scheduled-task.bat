@echo off


:: set file paths
cd "%~dp0\error_scripts"
set checkLog="%~dp0\error_scripts\check-log.txt"
set stopExistingTasks="%~dp0\error_scripts\stop-all-instances-of-task.bat"


:: Create the stop.flag file
cd "%~dp0"
echo.>stop.flag


cd "%~dp0\error_scripts"
call %stopExistingTasks%
set checkLog=check-log.txt
echo %DATE% %TIME% stop-scheduled-task.bat - executed >> %checkLog%


exit /b 0