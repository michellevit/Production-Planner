:: Disable the scheduled task from running indefinitely (until start-scheduled.task.bat is run)

@echo off

echo Disabling Production-Planner-Batch-Script-Task...
schtasks /change /tn "Production-Planner-Batch-Script-Task" /disable
if %errorlevel% neq 0 (
    echo Error: Failed to disable the task.
    pause
    exit /b %errorlevel%
)

:: Task enabled and started successfully.


:: To manually disable:
:: Go to Task Scheduler (program in Windows)
:: Find the scheduled task name
:: Right click and disable