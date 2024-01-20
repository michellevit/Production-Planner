@echo off


:: set file paths
cd "%~dp0\error_scripts"
set processLog="%~dp0\error_scripts\process-log.txt"
set stopExistingTasks="%~dp0\error_scripts\stop-all-instances-of-task.bat"


:: Create the stop.flag file
cd "%~dp0"
echo.>stop.flag


cd "%~dp0\error_scripts"
call %stopExistingTasks%
set processLog=process-log.txt
echo %DATE% %TIME% stop-app.bat - executed >> %processLog%

echo THE PRODUCTION PLANNER SYNC HAS STOPPED

pause
exit /b 0