@echo off
setlocal EnableDelayedExpansion


:: Format the Date/Time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
:: Extract HH and MM separately from the datetime
set HOUR=!datetime:~8,2!
set MIN=!datetime:~10,2!
:: Combine HH and MM to get HH:MM format
set TIME=!HOUR!:!MIN!


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