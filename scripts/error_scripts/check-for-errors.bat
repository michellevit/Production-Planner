:: scripts/check-for-errors.bat


:: Notes for manual debugging: 
:: Add " >> %errorLog% 2>&1" after python commands to get more error details
:: e.g. python check_quickbooks.py >> %errorLog% 2>&1
:: Causes write-failures to error-log.txt if used too often, so only use if debugging specific features


@echo off
setlocal EnableDelayedExpansion


:: set file paths
set errorLog="%~dp0\error-log.txt"
set processLog="%~dp0\process-log.txt"
set sendErrorEmail="%~dp0\send_error_email.py"
set stopExistingTasks="%~dp0\stop-all-instances-of-task.bat"
set checkQodbcConnection="%~dp0\check_qodbc_connection.py"
set cleanupLogsScript="%~dp0\cleanup_logs.ps1"
set dockerComposeUp="%~dp0..\docker_scripts\docker-compose-up.bat"


:: Format the Date/Time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
:: Extract HH and MM separately from the datetime
set HOUR=!datetime:~8,2!
set MIN=!datetime:~10,2!
:: Combine HH and MM to get HH:MM format
set TIME=!HOUR!:!MIN!


echo %DATE% %TIME% check-for-errors.bat - started >> %processLog%


:: Activate the virtual environment
cd "%~dp0..\..\venv\Scripts"
call activate.bat
if not defined VIRTUAL_ENV (
    echo %DATE% %TIME% ERROR: check-for-errors.bat - virtual environment was not properly activated. >> %errorLog%
    exit /b 1
)
echo %DATE% %TIME% check-for-errors.bat - virtual environment activated >> %processLog%


:: Check if Docker is running
cd "%~dp0"
docker info >nul 2>&1
if %errorlevel% neq 0 (
    :: Docker is not running, attempt to start
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
)


:: Check if Docker is running again
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo %DATE% %TIME% ERROR: check-for-errors.bat - attempted to start Docker, but Docker could not be started. >> %errorLog%
    exit /b 1
)
echo %DATE% %TIME% check-for-errors.bat - Docker is running. >> %processLog%


:: Check if all the Docker containers are running
set containers=production-planner-backend-1 production-planner-db-1 production-planner-nginx-1 production-planner-frontend-1
for %%c in (%containers%) do (
    docker ps --filter "name=%%c" --filter "status=running" | findstr /C:"%%c" > nul
    if !errorlevel! neq 0 (
        docker start %%c
        timeout /t 5
        docker ps --filter "name=%%c" --filter "status=running" | findstr /C:"%%c" > nul
        if !errorlevel! neq 0 (
            echo %DATE% %TIME% ERROR: Failed to start container %%c. >> %errorLog%
            exit /b 1
        ) 
    ) 
)
echo %DATE% %TIME% check-for-errors.bat - Docker containers are running >> %processLog%


:: Check if QuickBooks is running 
tasklist /FI "IMAGENAME eq QBW.EXE" 2>NUL | find /I /N "QBW.EXE" >NUL
if %errorlevel% neq 0 (
    echo %DATE% %TIME% ERROR: check-for-errors.bat - QuickBooks is not running. Please start QuickBooks and login. >> %errorLog%
    exit /b 1
)
echo %DATE% %TIME% check-for-errors.bat - QuickBooks is running>> %processLog%


:: Check if QODBC is able to connect
python %checkQodbcConnection% 
if %errorlevel% neq 0 (
    echo %DATE% %TIME% ERROR: check-for-errors.bat - QODBC connection failed. Please login to QuickBooks. >> %errorLog%
    exit /b 1
)
echo %DATE% %TIME% check-for-errors.bat - QODBC is connected >> %processLog%


echo %DATE% %TIME% check-for-errors.bat - complete, no errors detected. >> %processLog%


exit /b 0
