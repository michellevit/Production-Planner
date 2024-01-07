@echo off
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

:: Activate the virtual environment
call powershell -NoProfile -ExecutionPolicy Bypass -Command ".\venv\Scripts\Activate.ps1"

:: Run your Python script
@REM for first time app deployment: pip install pyodbc
python .\django\api\scripts\check_quickbooks.py

:: Pause to see the output
pause
