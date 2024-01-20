:: start-app.bat


:: Notes for manual debugging: 
:: Add " >> %errorLog% 2>&1" after python commands to get more error details
:: e.g. python check_quickbooks.py >> %errorLog% 2>&1
:: Causes write-failures to error-log.txt if used too often, so only use if debugging specific features


@echo off
setlocal EnableDelayedExpansion


:: Set file paths
set errorLog="%~dp0\error_scripts\error-log.txt"
set processLog="%~dp0\error_scripts\process-log.txt"
set sendErrorEmail="%~dp0\error_scripts\send_error_email.py"
set stopExistingTasks="%~dp0\error_scripts\stop-all-instances-of-task.bat"
set scheduledTaskExecutor="%~dp0\scheduled_task_executor.py"


:: Stop all prior instances of app + check if stop.flag or script.lock exists and delete them
call %stopExistingTasks%
cls
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
echo %DATE% %TIME% start-app.bat - Started >> %processLog%


:: Activate the virtual environment
cd "%~dp0"
cd "..\venv\Scripts"
call activate.bat
if not defined VIRTUAL_ENV (
    echo %DATE% %TIME% ERROR: start-app.bat - virtual environment was not properly activated. >> %errorLog%
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
echo --2. a critical error occurs
echo --3. stop-scheduled-task.bat runs
echo --4. this computer shuts down
echo -------------------------------
echo -------------------------------


:: Directly use the Python executable from the virtual environment
python -u %scheduledTaskExecutor%
set exitStatus=%errorlevel%


:: Check the exit status of the Python script
if %exitStatus% neq 0 (
    echo %DATE% %TIME% ERROR: start-app.bat - scheduled_task_executor.py stopped with error. >> %errorLog%
    cd "%~dp0"
)


if %exitStatus% neq 0 (
    python %sendErrorEmail%
    if !ERRORLEVEL! equ 1 (
        echo %DATE% %TIME% ERROR: start-app.bat - error notification email FAILED to send. >> %errorLog%
    )
)


if %exitStatus% neq 0 (
    echo **APPLICATION HAS STOPPED**
    echo A critical error occurred and the scheduled task has been stopped. 
    echo %DATE% %TIME% ALERT: error notification email sent.
    echo -------------------------------
    echo -------------------------------
    echo ERROR LOG:
    type %errorLog%
    echo -------------------------------
    echo -------------------------------
    echo PROCESS LOG:
    type %processLog%
    echo -------------------------------
    echo -------------------------------
)     


if %exitStatus% neq 1 (
    :: Stop all instances of task + delete stop.flag + lock.file
    call %stopExistingTasks% 
    echo %DATE% %TIME% start-app.bat - stopped via stop-all-instances-of-task.bat >> %processLog%
    echo **APPLICATION HAS STOPPED**
    echo The sync was stopped intentionally, with no error.
    echo Production Planner is no longer synced with QuickBooks.
    echo All instances of scheduled_task_executor.py have been terminated.
    echo -------------------------------
    echo -------------------------------
)


pause

exit /b