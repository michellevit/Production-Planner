:: scripts/run-app.bat

@echo off
setlocal EnableDelayedExpansion


:: Get Error Log
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts\error_scripts
set logFile=error-log.txt


:: Activate the virtual environment (for pyodbc / check_quickbooks.py / check_qodbc_connection.py)
call "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\activate.bat"
if not defined VIRTUAL_ENV (
    echo %DATE% %TIME% ERROR: Virtual environment was not properly activated. >> %logFile%
    exit /b 1
)

:: Format the Date/Time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
:: Extract HH and MM separately from the datetime
set HOUR=!datetime:~8,2!
set MIN=!datetime:~10,2!
:: Combine HH and MM to get HH:MM format
set TIME=!HOUR!:!MIN!


:: Call PowerShell to clean up old log entries
powershell -NoProfile -ExecutionPolicy Bypass -File "cleanup_logs.ps1"
:: Call Python script to check for critical errors
"C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\python.exe" check_critical_errors.py
if !ERRORLEVEL! equ 1 (
    python check_email_sent.py
    if !ERRORLEVEL! equ 1 (
        python send_critical_error_email.py "Application" >> %logFile% 2>&1
        if !ERRORLEVEL! equ 1 (
            echo %DATE% %TIME% ERROR: Application error notification email FAILED to send. >> %logFile%
        )
        else (
            echo %DATE% %TIME% ERROR: Application error notification email sent. >> %logFile%
        )     
    )
)


:: Check if QuickBooks is running 
tasklist /FI "IMAGENAME eq QBW.EXE" 2>NUL | find /I /N "QBW.EXE" >NUL
if not "%ERRORLEVEL%"=="0" (
    echo %DATE% %TIME% CRITICAL ERROR: QuickBooks is not running. Please start QuickBooks and login. >> %logFile%
    exit /b 0
)

:: Check if QODBC is able to connect
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts\error_scripts
"C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\python.exe" check_qodbc_connection.py
if %ERRORLEVEL% equ 1 (
    echo %DATE% %TIME% ERROR: QODBC connection failed. Please login to QuickBooks. >> %logFile%
    exit /b 0
)


:: Check if scheduled task is enabled
schtasks /query /tn "Production-Planner-Batch-Script-Task" /fo list | find "Status:"
:: Check if scheduled task is enabled
set "taskDisabled=0"
for /f "tokens=*" %%a in ('schtasks /query /tn "Production-Planner-Batch-Script-Task" /fo list ^| find "Status:"') do (
echo %%a | find "Disabled" > nul
if not errorlevel 1 set "taskDisabled=1"
)
if "!taskDisabled!"=="1" (
    echo %DATE% %TIME% CRITICAL ERROR: Production-Planner-Batch-Script-Task is disabled. Enable it to continue. >> %logFile%
    exit /b 0
)


for /f "tokens=*" %%v in ('where python 2^>^&1') do (
    set "pythonPath=%%v"
)
:: Run script to get data from QuickBooks
"C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\python.exe" "..\..\django\api\scripts\check_quickbooks.py"
if %errorlevel% neq 0 (
    echo %DATE% %TIME% ERROR: Could not execute check_quickbooks.py successfully. >> %logFile%
    exit /b 0
)


:: Run script to add QB data to DB
docker exec production-planner-backend-1 python /django/api/scripts/qb_data_to_db.py


:: Run script to update last_active field in LastUpdate model instance
docker exec production-planner-backend-1 python /django/api/scripts/initiate_last_active_command.py


exit /b
