@echo off
setlocal enabledelayedexpansion

:: Load .env file
for /f "tokens=1* delims== " %%a in ('type "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\.env"') do (
    set %%a=%%b
)

:: Remove quotes from environment variables
for %%i in (DB_USER DB_PASSWORD DB_NAME) do (
    set %%i=!%%i:'=!
)

:: Get the current date and time in the desired format (YYYYMMDD_HHMM)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do (
    set datetime=%%I
)
set DATE=!datetime:~0,8!
set TIME=!datetime:~8,4!

:: Define backup file name and path
set BACKUP_DIR=C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\database_backups
set BACKUP_FILE=%BACKUP_DIR%\%DATE%_%TIME%_backup.sql

:: Create the backup using mysqldump
docker exec production-planner-db-1 mysqldump -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% > "%BACKUP_FILE%"

:: Check if mysqldump command was successful
if %ERRORLEVEL% neq 0 (
    echo ERROR: Database backup failed
    goto end_script
) else (
    echo Database backup completed successfully: %BACKUP_FILE%
)

:: Check the number of backup files. If more than 10, delete the oldest ones.
cd %BACKUP_DIR%
set /a filecount=0
for %%x in (*.sql) do set /a filecount+=1
if %filecount% GTR 10 (
    for /f "skip=10 delims=" %%F in ('dir /b /o-d *.sql') do del "%%F"
) 

:end_script
endlocal