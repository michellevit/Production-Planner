:: scripts/run-app.bat


@echo off
setlocal EnableDelayedExpansion


:: set file paths
set errorLog="%~dp0\error_scripts\terror-log.txt"
set checkLog="%~dp0\error_scripts\check-log.txt"
set sendErrorEmail="%~dp0\error_scripts\send_critical_error_email.py"
set stopExistingTasks="%~dp0\error_scripts\stop-all-instances-of-task.bat"
set checkEmailSent="%~dp0\error_scripts\check_email_sent.py"
set checkCriticalErrors="%~dp0\error_scripts\check_critical_errors.py"
set checkQodbcConnection="%~dp0\error_scripts\check_qodbc_connection.py"
set cleanupLogsScript="%~dp0\error_scripts\cleanup_logs.ps1"


:: Format the Date/Time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
:: Extract HH and MM separately from the datetime
set HOUR=!datetime:~8,2!
set MIN=!datetime:~10,2!
:: Combine HH and MM to get HH:MM format
set TIME=!HOUR!:!MIN!


echo %DATE% %TIME% run-app - Started >> %checkLog%


:: Activate the virtual environment
cd "%~dp0"
cd "..\venv\Scripts"
call activate.bat
if not defined VIRTUAL_ENV (
    cd "%~dp0\error_scripts"
    echo %DATE% %TIME% ERROR: run-app - Virtual environment was not properly activated. >> %errorLog%
    exit /b 1
)


:: Call Python script to send an email if there is a critical error
set critical_exit=False
python %checkCriticalErrors% 
if !ERRORLEVEL! equ 1 (
    set critical_exit=True
    python %checkEmailSent%
    if !ERRORLEVEL! equ 1 (
        python %sendErrorEmail% Application
        if !ERRORLEVEL! equ 1 (
            echo %DATE% %TIME% ERROR: run-app - Application error notification email FAILED to send. >> %errorLog%
        )
        else (
            echo %DATE% %TIME% ERROR: run-app - Application error notification email sent. >> %errorLog%
        )     
    )
)


:: Exit script if critical error has been detected
if "%critical_exit%"=="True" (
    exit /b 1
)


:: Check if QuickBooks is running 
tasklist /FI "IMAGENAME eq QBW.EXE" 2>NUL | find /I /N "QBW.EXE" >NUL
if not "%ERRORLEVEL%"=="0" (
    echo %DATE% %TIME% CRITICAL ERROR: run-app - QuickBooks is not running. Please start QuickBooks and login. >> %errorLog%
    exit /b 0
)



:: Check if QODBC is able to connect
python %checkQodbcConnection% 
if %ERRORLEVEL% equ 1 (
    echo %DATE% %TIME% ERROR: run-app - QODBC connection failed. Please login to QuickBooks. >> %errorLog%
    exit /b 0
)


:: Navigate to the correct directory
cd "%~dp0..\django\api\scripts"


:: Run script to get data from QuickBooks
python check_quickbooks.py >> %errorLog% 2>&1
if %ERRORLEVEL% neq 0 (
    echo %DATE% %TIME% ERROR: run-app - check_quickbooks.py - Failed to get data from QuickBooks, make sure QB is open/logged-in. >> %errorLog%
)


:: Navigate to the root directory
cd "%~dp0.."


:: Run script to add QB data to DB
docker exec -it production-planner-backend-1 python /django/api/scripts/qb_data_to_db.py >> %errorLog% 2>&1
if %ERRORLEVEL% neq 0 (
    echo %DATE% %TIME% ERROR: run-app - Failed to add QB data to DB - qb_data_to_db.py >> %errorLog%
)
echo %DATE% %TIME% run-app - qb_data_to_db.py  executed >> %checkLog%
exit /b


:: Run script to update last_active field in LastUpdate model instance
docker exec production-planner-backend-1 python /django/api/scripts/initiate_last_active_command.py >> %errorLog% 2>&1
if %ERRORLEVEL% neq 0 (
    echo %DATE% %TIME% ERROR: run-app - Failed to update last_active field - initiate_last_active_command.py >> %errorLog%
)
echo %DATE% %TIME% run-app - initiate_last_active_command.py executed >> %checkLog%



:: Call PowerShell to clean up old log entries (at the end so there are no filee access conflicts)
cd "%~dp0\error_scripts"
powershell -NoProfile -ExecutionPolicy Bypass -File cleanup_logs.ps1 >> %errorLog% 2>&1
if %ERRORLEVEL% neq 0 (
    echo %DATE% %TIME% ERROR: run-app - cleanupLogs.ps1 encountered an error. >> %errorLog%
) 
echo %DATE% %TIME% run-app - cleanup_logs.ps1 executed >> %checkLog%


echo %DATE% %TIME%  run-app - Made it to the end >> %checkLog%


exit /b
