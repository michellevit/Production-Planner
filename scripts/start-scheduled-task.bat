:: start-scheduled-task.bat

@echo off
setlocal EnableDelayedExpansion

:: Get Error Log
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts\error_scripts
set logFile=error-log.txt

:: Activate Virtual Environment
call "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\venv\Scripts\activate.bat"

:: Navigate to the scripts directory
cd "C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts"


echo run-app.bat has been started. 
echo This script will run until:
echo --1. stop-scheduled-task.bat runs 
echo --2. this command prompt is closed
echo --3. this computer shuts down
echo -------------------------------
echo **WARNING** 
echo This script is tied to the lifecycle of the terminal / Command Prompt window in which this message is displayed 
echo This means that if you close this terminal window, any script running in that window will be terminated.
echo -------------------------------
echo -------------------------------


:: Directly use the Python executable from the virtual environment
python -u scheduled_task_executor.py
if !errorlevel! equ 1 (
    echo ERROR: scheduled_task_executor failed. >> %logFile%
    echo %DATE% %TIME% ERROR: scheduled_task_executor has stopped. >> %logFile%
    exit /b 0
) else (
    echo scheduled_task_executor.py has been intentionally stopped.
)

echo scheduled_task_executor failed has stopped.

pause