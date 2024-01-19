:: manually-fetch-data.bat


@echo off
setlocal EnableDelayedExpansion


:: Set file paths
set checkLog="%~dp0\error_scripts\check-log.txt"
set errorLog="%~dp0\error_scripts\error-log.txt"


:: Activate the virtual environment
cd "%~dp0"
cd "..\venv\Scripts"
call activate.bat
if not defined VIRTUAL_ENV (
    echo %DATE% %TIME% ERROR: run-app - Virtual environment was not properly activated. >> %errorLog%
    exit /b 1
)


:: Navigate to the correct directory
cd "%~dp0..\django\api\scripts"


:: Run script to add QB data to DB
python check_quickbooks.py >> %errorLog% 2>&1
if %ERRORLEVEL% equ 1 (
    echo %DATE% %TIME% ERROR: run-app - check_quickbooks.py failed. >> %errorLog%
    echo Unable to connect to QuickBooks - please make sure QB is open and logged in.
    echo manually-fetch-data.bat exited with an error - check error-log.txt for details
    exit /b 0
)
echo Data has has been fetched from QuickBooks


:: Run script to add QB data to DB
docker exec -it production-planner-backend-1 python /django/api/scripts/qb_data_to_db.py >> %errorLog%
if %ERRORLEVEL% equ 1 (
    echo %DATE% %TIME% ERROR: run-app - qb_data_to_db.py failed. >> %errorLog%
    echo QuickBooks data was not added to the Production Planner database.
    echo manually-fetch-data.bat exited with an error - check error-log.txt for details
    exit /b 0
)
echo QuickBooks data has been added to the Production Planner database.


:: Run script to update last_active field in LastUpdate model instance
docker exec production-planner-backend-1 python /django/api/scripts/initiate_last_active_command.py >> %errorLog% 2>&1
if %ERRORLEVEL% equ 1 (
    echo %DATE% %TIME% ERROR: run-app - initiate_last_active_command.py failed. >> %errorLog%
    echo The Last Active field was not updated.
    echo manually-fetch-data.bat exited with an error - check error-log.txt for details
    exit /b 0
)
echo The Last Active field has been updated.


echo manually-fetch-data COMPLETE


pause
exit /b

