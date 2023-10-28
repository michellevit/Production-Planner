@echo off
setlocal enabledelayedexpansion

:: Define database connection details
set DB_HOST=db
set DB_PORT=3306
set DB_NAME=%MYSQL_DB_NAME%
set DB_USER=%DB_USER%
set DB_PASSWORD=%DB_PASSWORD%

:: Get the current date in the desired format (YYYYMMDD)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do (
    set datetime=%%I
)
set DATE=!datetime:~0,8!

:: Define backup file name and path
set BACKUP_DIR=C:\Users\Michelle\Documents\Coding_Projects\Production-Planner\db-backups
set BACKUP_FILE=%BACKUP_DIR%\backup_%DATE%.sql

:: Create the backup using mysqldump
mysqldump -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% > %BACKUP_FILE%

echo Database backup completed: %BACKUP_FILE%

endlocal
