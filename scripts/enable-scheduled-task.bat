:: This .bat file will resume the scheduled task after it has been disabled (by stop-scheduled-task.bat)

:: NOTE: Make sure to run this as an administrator
:: i.e. right-click the file and click 'Run as administrator'


@echo off

:: Enabling Production-Planner-Batch-Script-Task...
schtasks /change /tn "Production-Planner-Batch-Script-Task" /enable
if %errorlevel% neq 0 (
    echo Error: Failed to enable the task.
    pause
    exit /b %errorlevel%
)

:: Starting Production-Planner-Batch-Script-Task...
schtasks /run /tn "Production-Planner-Batch-Script-Task"
if %errorlevel% neq 0 (
    echo Error: Failed to start the task.
    pause
    exit /b %errorlevel%
)

pause

:: Task enabled and started successfully.


:: To manually enable:
:: Go to Task Scheduler (program in Windows)
:: Find the scheduled task name
:: Right click and enable