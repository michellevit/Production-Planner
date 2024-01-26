@echo off
setlocal EnableDelayedExpansion


for /f "tokens=2" %%i in ('tasklist /nh /fi "IMAGENAME eq python.exe" /fo csv ^| findstr /i "scheduled_task_executor.py"') do (
    set pid=%%i
    taskkill /PID !pid! /F
    echo Terminated process PID: !pid!
)


for /f "tokens=2" %%i in ('tasklist /nh /fi "IMAGENAME eq python3.10.exe" /fo csv ^| findstr /i "scheduled_task_executor.py"') do (
    set pid=%%i
    taskkill /PID !pid! /F
    echo Terminated process PID: !pid!
)

for /f "tokens=2" %%i in ('tasklist /nh /fi "IMAGENAME eq cmd.exe" /fo csv ^| findstr /i "scheduled_task_executor.py"') do (
    set pid=%%i
    taskkill /PID !pid! /F
    echo Terminated process PID: !pid!
)

:: Navigate to the originalstop.flag's directory
cd "%~dp0.."
if exist stop.flag del stop.flag
if exist script.lock del script.lock


exit /b 0