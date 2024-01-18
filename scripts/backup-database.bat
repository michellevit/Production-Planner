@echo off
setlocal enabledelayedexpansion

:: Initialize error flag
set "errorOccurred=0"
set "errorMessage="

:: Start virtual environment
call "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\activate.bat"


:: Load error log file
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts\error_scripts
set logFile=error-log.txt


:: Load .env file
for /f "tokens=1* delims== " %%a in ('type "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\.env"') do (
    set %%a=%%b
)


:: Remove quotes from environment variables
for %%i in (DB_USER DB_PASSWORD DB_NAME) do (
    set %%i=!%%i:'=!
)

:: Format the Date/Time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set DATE_FOR_BACKUP=!datetime:~0,8!
:: Extract HH and MM separately from the datetime
set HOUR=!datetime:~8,2!
set MIN=!datetime:~10,2!
set SEC=!datetime:~12,2!
:: Combine HH and MM to get HH:MM format
set TIME=!HOUR!:!MIN!
set TIME_FOR_BACKUP=!HOUR!!MIN!!SEC!


:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    timeout /t 20 
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        set "errorOccurred=1"
        set "errorMessage=%DATE% %TIME% ERROR: Backup could not be completed because Docker is not running."
        goto handleError
    )
)


:: Check if Docker database image is running
docker ps --filter "name=production-planner-db-1" --filter "status=running" | findstr "production-planner-db-1" >nul
if !errorlevel! neq 0 (
    if !errorlevel! neq 0 (
        docker start production-planner-db-1
        docker ps --filter "name=production-planner-db-1" --filter "status=running" | findstr "production-planner-db-1" >nul
        if !errorlevel! neq 0 (
            set "errorOccurred=1"
            set "errorMessage=%DATE% %TIME% ERROR: Backup could not be completed becausen Docker database image is not running."
            goto handleError
        )
    )
)


:: Define backup file name and path
set BACKUP_DIR=C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\database_backups
set BACKUP_FILE=%BACKUP_DIR%\%DATE_FOR_BACKUP%_%TIME_FOR_BACKUP%_backup.sql


:: Create the backup using mysqldump
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner
docker exec production-planner-db-1 mysqldump -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% > "%BACKUP_FILE%"


:: Check if mysqldump command was successful
if %ERRORLEVEL% equ 1 (
    set "errorOccurred=1"
    set "errorMessage=%DATE% %TIME% ERROR:  Backup could not be completed because Mysqldump command failed."
    if exist "%BACKUP_FILE%" del "%BACKUP_FILE%"
    goto handleError
)


:: Check the number of backup files. If more than 10, delete the oldest ones.
cd %BACKUP_DIR%
set /a filecount=0
for %%x in (*.sql) do set /a filecount+=1
if %filecount% GTR 10 (
    for /f "skip=10 delims=" %%F in ('dir /b /o-d *.sql') do del "%%F"
) 


:: Handle errors
:handleError
if !errorOccurred! equ 1 (
    call "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\activate.bat"
    cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts\error_scripts
    echo !errorMessage! >> %logFile%
    python send_critical_error_email.py "Backup"
    if !ERRORLEVEL! equ 1 (
        echo %DATE% %TIME% Error notification e-mail FAILED to send. >> %logFile%
    )
    exit /b 0
)


:end_script
endlocal