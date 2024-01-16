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

:: Define backup directory
set BACKUP_DIR=C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\database_backups\

:: Find the most recent backup file
set LATEST_BACKUP=
for /f "delims=" %%x in ('dir "%BACKUP_DIR%*.sql" /b /o-d') do (
    set LATEST_BACKUP=%%x
    goto confirm
)

:confirm
echo The most recent backup file is: %LATEST_BACKUP%
echo Are you sure you want to restore from this backup? [Y/N]
set /p CONFIRM=
if /i not "!CONFIRM!"=="Y" (
    echo Restore cancelled.
    goto end_script
)

:restore
if not defined LATEST_BACKUP (
    echo No backup file found.
    goto end_script
)

echo Restoring database from: %LATEST_BACKUP%
docker exec -i production-planner-db-1 mysql -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < "%BACKUP_DIR%%LATEST_BACKUP%"

:: Check if mysql command was successful
if %ERRORLEVEL% neq 0 (
    echo ERROR: Database restore failed
) else (
    echo Database restored successfully from: %LATEST_BACKUP%
)

:end_script
endlocal
pause
