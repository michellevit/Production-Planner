:: sync-data.bat


@echo off
setlocal EnableDelayedExpansion


:: Set file paths
set processLog="%~dp0\error_scripts\process-log.txt"
set errorLog="%~dp0\error_scripts\error-log.txt"


:: Format the Date/Time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
:: Extract HH and MM separately from the datetime
set HOUR=!datetime:~8,2!
set MIN=!datetime:~10,2!
:: Combine HH and MM to get HH:MM format
set TIME=!HOUR!:!MIN!


echo %DATE% %TIME% sync-data.bat - started >> %processLog%


:: Activate the virtual environment
cd "%~dp0"
cd "..\venv\Scripts"
call activate.bat
if not defined VIRTUAL_ENV (
    echo %DATE% %TIME% ERROR: sync-data.bat - Virtual environment was not properly activated. >> %errorLog%
    exit /b 1
)


:: Run script to add QB data to DB
cd "%~dp0..\django\api\scripts"
python check_quickbooks.py >> %errorLog% 2>&1
if %ERRORLEVEL% neq 0 (
    echo %DATE% %TIME% ERROR: sync-data.bat - check_quickbooks.py failed. >> %errorLog%
    exit /b 1
)


:: Run script to add QB data to DB
docker exec -it production-planner-backend-1 python /django/api/scripts/qb_data_to_db.py >> %errorLog%
if %ERRORLEVEL% neq 0 (
    echo %DATE% %TIME% ERROR: sync-data.bat - qb_data_to_db.py failed. >> %errorLog%
    exit /b 1
)


:: Run script to update last_active field in LastUpdate model instance
docker exec production-planner-backend-1 python /django/api/scripts/initiate_last_active_command.py >> %errorLog% 2>&1
if %ERRORLEVEL% neq 0 (
    echo %DATE% %TIME% ERROR: sync-data.bat - initiate_last_active_command.py failed. >> %errorLog%
    exit /b 1
)


:: Call PowerShell to clean up old log entries (at the end so there are no filee access conflicts)
cd "%~dp0\error_scripts"
powershell -NoProfile -ExecutionPolicy Bypass -File cleanup_logs.ps1
if %errorlevel% neq 0 (
    echo %DATE% %TIME% ERROR: sync-data.bat - cleanupLogs.ps1 encountered an error. >> %errorLog%
    exit /b 1
) 
echo %DATE% %TIME% sync-data.bat - logs cleaned. >> %processLog%


echo %DATE% %TIME% sync-data.bat - complete, no errors detected. >> %processLog%


exit /b