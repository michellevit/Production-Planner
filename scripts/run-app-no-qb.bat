@echo off
setlocal EnableDelayedExpansion


:: Activate the virtual environment (for pyodbc / check_quickbooks.py / check_qodbc_coinnection.py)
call "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\activate.bat"


:: Check error log for critical errors
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts
set logFile=error-log-file.txt
:: Call PowerShell to clean up old log entries
powershell -NoProfile -ExecutionPolicy Bypass -File "cleanup_logs.ps1"
:: Call Python script to check for critical errors
python check_critical_errors.py
if !ERRORLEVEL! neq 0 (
    @REM schtasks /change /tn "Production-Planner-Batch-Script-Task" /disable
    start cmd /c "echo Critical error(s) detected, stopping scheduled task & echo: & type "%logFile%" & echo: & pause"
    exit /b 1
)


:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    timeout /t 20 
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo %DATE% %TIME% ERROR: Attempted to start Docker- but Docker could not be started. >> %logFile%
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