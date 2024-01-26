@echo off
setlocal enabledelayedexpansion


:: set file paths
set errorLog="%~dp0\error_scripts\error-log.txt"
set sendErrorEmail="%~dp0\error_scripts\send_error_email.py"


:: Initialize error flag
set "errorOccurred=0"
set "errorMessage="


:: Activate the virtual environment
cd "%~dp0"
cd "..\venv\Scripts"
call activate.bat
if not defined VIRTUAL_ENV (
    echo %DATE% %TIME% ERROR: backup-database.bat - Virtual environment was not properly activated. >> %errorLog%
    exit /b 1
)


:: Load .env file
cd "%~dp0.."
for /f "tokens=1* delims== " %%a in ('type ".env"') do (
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
        set "errorMessage=%DATE% %TIME% ERROR: backup-database.bat - Backup could not be completed because Docker is not running."
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
            set "errorMessage=%DATE% %TIME% ERROR: backup-database.bat - Backup could not be completed becausen Docker database image is not running."
            goto handleError
        )
    )
)


:: Define backup file name and path
cd "%~dp0.."
set BACKUP_DIR=database_backups\
set BACKUP_FILE=%BACKUP_DIR%\%DATE_FOR_BACKUP%_%TIME_FOR_BACKUP%_backup.sql


:: Create the backup using mysqldump
cd "%~dp0.."
docker exec production-planner-db-1 mysqldump -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% > "%BACKUP_FILE%"


:: Check if mysqldump command was successful
if %ERRORLEVEL% equ 1 (
    set "errorOccurred=1"
    set "errorMessage=%DATE% %TIME% ERROR: backup-database.bat -  Backup could not be completed because Mysqldump command failed."
    if exist "%BACKUP_FILE%" del "%BACKUP_FILE%"
    goto handleError
)


:: Check the number of backup files. If more than 10, delete the oldest ones.
cd "%~dp0"
cd "..\database_backups"
set /a filecount=0
for %%x in (*.sql) do set /a filecount+=1
if %filecount% GTR 10 (
    for /f "skip=10 delims=" %%F in ('dir /b /o-d *.sql') do del "%%F"
) 


:: Handle errors
:handleError
if !errorOccurred! equ 1 (
    echo ERROR: backup-database.bat - Database backup could not be completed - !errorMessage! >> %errorLog%
    python %sendErrorEmail% "Backup"
    if !ERRORLEVEL! equ 1 (
        echo %DATE% %TIME% ERROR: backup-database.bat - Database backup error notification e-mail FAILED to send. >> %errorLog%
    )
    exit /b 0
)

:end_script
endlocal
exit /b 0