@echo off
setlocal EnableDelayedExpansion


:: Activate the virtual environment (for pyodbc / check_quickbooks.py / check_qodbc_connection.py)
call "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\activate.bat"


:: Format the Date/Time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
:: Extract HH and MM separately from the datetime
set HOUR=!datetime:~8,2!
set MIN=!datetime:~10,2!
:: Combine HH and MM to get HH:MM format
set TIME=!HOUR!:!MIN!


:: Check error log for critical errors
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts\error_scripts
set logFile=error-log-file.txt
:: Call PowerShell to clean up old log entries
powershell -NoProfile -ExecutionPolicy Bypass -File "cleanup_logs.ps1"
:: Call Python script to check for critical errors
python check_critical_errors.py
if !ERRORLEVEL! equ 1 (
    python check_email_sent.py
    if !ERRORLEVEL! equ 1 (
        python send_critical_error_email.py "Application" >> %logFile% 2>&1
        if !ERRORLEVEL! equ 1 (
            echo %DATE% %TIME% Application error notification email FAILED to send. >> %logFile%
        )
        else (
            echo %DATE% %TIME% Application error notification email sent. >> %logFile%
        )     
        exit /b 0   
    )
)

:: Check if QuickBooks is running 
tasklist /FI "IMAGENAME eq QBW.EXE" 2>NUL | find /I /N "QBW.EXE" >NUL
if not "%ERRORLEVEL%"=="0" (
    echo %DATE% %TIME% CRITICAL ERROR: QuickBooks is not running. Please start QuickBooks and login. >> %logFile%
    exit /b 0
)

echo A >> %logFile%
:: Check if QODBC is able to connect
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts\error_scripts
@REM python check_qodbc_connection.py

if %ERRORLEVEL% equ 1 (
    echo %DATE% %TIME% ERROR: QODBC connection failed. Please login to QuickBooks. >> %logFile%
    exit /b 0
)

echo B >> %logFile%
:: Check if scheduled task is enabled
schtasks /query /tn "Production-Planner-Batch-Script-Task" /fo list | find "Status:"
:: Check if scheduled task is enabled
set "taskDisabled=0"
for /f "tokens=*" %%a in ('schtasks /query /tn "Production-Planner-Batch-Script-Task" /fo list ^| find "Status:"') do (
echo %%a | find "Disabled" > nul
if not errorlevel 1 set "taskDisabled=1"
)
if "!taskDisabled!"=="1" (
    echo %DATE% %TIME% CRITICAL ERROR: Production-Planner-Batch-Script-Task is disabled. Enable it to continue. >> %logFile%
    exit /b 0
)

echo C >> %logFile%
:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    timeout /t 20 
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo %DATE% %TIME% ERROR: Attempted to start Docker - but Docker could not be started. >> %logFile%
        exit /b 0
    )
)

echo D >> %logFile%
:: Check if all the Docker containers are running
:: Define Docker containers
set containers=production-planner-backend-1 production-planner-db-1 production-planner-nginx-1 production-planner-frontend-1
:: Loop through each container
for %%c in (!containers!) do (
    docker ps --filter "name=%%c" --filter "status=running" | findstr "%%c" >nul
    if !errorlevel! neq 0 (
        docker start %%c
        docker ps --filter "name=%%c" --filter "status=running" | findstr "%%c" >nul
        if !errorlevel! neq 0 (
            echo %DATE% %TIME% ERROR: Failed to start %%c. >> %logFile%
        )
    )
)

echo E >> %logFile%
::  Run script to fetch data from QB
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner
echo E1 >> %logFile%
python .\django\api\scripts\check_quickbooks.py
echo %errorlevel% >> %logFile%
if %errorlevel% neq 0 (
    echo %DATE% %TIME% ERROR: Could not execute check_quickbooks.py successfully. >> %logFile%
    exit /b 0
)

echo F >> %logFile%
:: Run script to add QB data to DB
docker exec production-planner-backend-1 python /django/api/scripts/qb_data_to_db.py

echo G >> %logFile%

exit /b 0
