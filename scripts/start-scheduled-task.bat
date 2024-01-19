:: start-scheduled-task.bat


@echo off
setlocal EnableDelayedExpansion


:: set file paths
set errorLog="%~dp0\error_scripts\error-log.txt"
set checkLog="%~dp0\error_scripts\check-log.txt"
set sendErrorEmail="%~dp0\error_scripts\send_critical_error_email.py"
set stopExistingTasks="%~dp0\error_scripts\stop-all-instances-of-task.bat"
set scheduledTaskExecutor="%~dp0\scheduled_task_executor.py"


:: Stop all prior instances of app + check if stop.flag or script.lock exists and delete them
call %stopExistingTasks%
echo Starting...
echo :____
timeout /t 1 /nobreak > NUL
cls
echo Starting...
echo ::___
timeout /t 1 /nobreak > NUL
cls
echo Starting...
echo :::__
timeout /t 1 /nobreak > NUL
cls
echo Starting...
echo ::::_
timeout /t 1 /nobreak > NUL
cls
echo Starting...
echo :::::
timeout /t 1 /nobreak > NUL
cls


:: Format the Date/Time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
:: Extract HH and MM separately from the datetime
set HOUR=!datetime:~8,2!
set MIN=!datetime:~10,2!
:: Combine HH and MM to get HH:MM format
set TIME=!HOUR!:!MIN!


:: Log a start message
echo %DATE% %TIME% start-scheduled-task.bat - Started >> %checkLog%


:: Activate the virtual environment
cd "%~dp0"
cd "..\venv\Scripts"
call activate.bat
if not defined VIRTUAL_ENV (
    echo %DATE% %TIME% ERROR: start-scheduled-task.bat - virtual environment was not properly activated. >> %errorLog%
    exit /b 1
)


echo -------------------------------
echo -------------------------------
echo Production Planner is running and synced to QuickBooks (Mon-Fri, 6AM-6PM). 
echo -------------------------------
echo **WARNING** 
echo If you close this window, the Production Planner sync with QuickBooks will be closed too.
echo This script will run until:
echo --1. this command prompt is closed
echo --2. stop-scheduled-task.bat runs
echo --3. this computer shuts down
echo -------------------------------
echo -------------------------------



:: Directly use the Python executable from the virtual environment
python -u %scheduledTaskExecutor% >> %errorLog% 2>&1
set exitStatus=%errorlevel%


:: Check the exit status of the Python script
if %exitStatus% neq 0 (
    cd "%~dp0\error_scripts"
    echo %DATE% %TIME% ERROR: scheduled_task_executor.py - Stopped with error. >> %errorLog%
    cd "%~dp0"
    goto sendEmail
)


:sendEmail
python %sendErrorEmail% Scheduled >> %errorLog% 2>&1
if !ERRORLEVEL! equ 1 (
    echo %DATE% %TIME% ERROR: start-scheduled-task.bat - Scheduled Task error notification email FAILED to send. >> %errorLog%
)


if %exitStatus% neq 0 (
    echo STOPPED:
    echo A critical error occurred and the scheduled task has been stopped. 
    echo An 'Error' notification email has been sent to the administrator. 
    echo %DATE% %TIME% ERROR: start-scheduled-task.bat - Scheduled Task error notification email sent. >> %errorLog%
    echo -------------------------------
    echo -------------------------------
    echo Error Log:
    type %errorLog%
    echo -------------------------------
    echo -------------------------------
) 


:: Stop all instances of task + delete stop.flag + lock.file
call %stopExistingTasks% 
echo %DATE% %TIME% start-scheduled-task.bat - stopped via stop-all-instances-of-task.bat >> %checkLog%
echo STOPPED:
echo Production Planner is no longer synced with QuickBooks.
echo All instances of scheduled_task_executor.py have been terminated.


pause
