@echo off
setlocal enabledelayedexpansion

set DB_USER=db_user
set DB_PASSWORD=20231028-pass
set DB_HOST=db
set DB_PORT=3306
set DB_NAME=Production_Planner_DB

:: Get the current date in the desired format (YYYYMMDD)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do (
    set datetime=%%I
)
set DATE=!datetime:~0,8!

:: Define backup file name and path
set BACKUP_DIR=C:\Users\Michelle\Documents\Coding_Projects\Production-Planner\db-backups
set BACKUP_FILE=%BACKUP_DIR%\%DATE%_backup.sql

:: Create the backup using mysqldump
docker exec production-planner-db-1 mysqldump -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% > "%BACKUP_FILE%"

echo Database backup completed: %BACKUP_FILE%

endlocal