@echo off
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

:: Activate the virtual environment
call powershell -NoProfile -ExecutionPolicy Bypass -Command ".\venv\Scripts\Activate.ps1"

:: For first time app deployment:
:: python -m venv venv
:: cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\django 
:: pip install -r requirements.txt

:: Run Python script
python .\django\api\scripts\check_quickbooks.py

@REM: Make sure QuickBooks is running and you are logged in 

:: pause keeps the terminal window open after pausing the app (optional)
