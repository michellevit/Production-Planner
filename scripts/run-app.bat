@echo off
setlocal EnableDelayedExpansion


:: Activate the virtual environment (for pyodbc / check_quickbooks.py / check_qodbc_coinnection.py)
call "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\activate.bat"

:: Check error log for critical errors
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts\error_scripts
set logFile=error-log-file.txt
:: Call PowerShell to clean up old log entries
powershell -NoProfile -ExecutionPolicy Bypass -File "cleanup_logs.ps1"
:: Call Python script to check for critical errors
python check_critical_errors.py
if !ERRORLEVEL! neq 0 (
    @REM schtasks /change /tn "Production-Planner-Batch-Script-Task" /disable
    start cmd /c "echo Critical error(s) detected, stopping scheduled task & echo: & type "%logFile%" & echo: & pause"
    python send_critical_error_email.py "Application"
    exit /b 1
)


:: Check if QuickBooks is running 
tasklist /FI "IMAGENAME eq QBW.EXE" 2>NUL | find /I /N "QBW.EXE" >NUL
if not "%ERRORLEVEL%"=="0" (
    echo %DATE% %TIME% CRITICAL ERROR: QuickBooks is not running. Please start QuickBooks and login. >> %logFile%
    exit /b 1
)


:: Check if QODBC is able to connect
python check_qodbc_connection.py
if %ERRORLEVEL% equ 1 (
    pause
    echo %DATE% %TIME% CRITICAL ERROR: QODBC connection failed. Please login to QuickBooks. >> %logFile%
    exit /b 1
)


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
    exit /b 1
)


:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    timeout /t 20 
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo %DATE% %TIME% ERROR: Attempted to start Docker - but Docker could not be started. >> %logFile%
        exit /b 1
    )
)


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


::  Fetch data from QB and add to database
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner
python .\django\api\scripts\check_quickbooks.py
docker exec production-planner-backend-1 python /django/api/scripts/qb_data_to_db.py

pause