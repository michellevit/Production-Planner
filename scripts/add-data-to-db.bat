@echo off
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

:: Activate the virtual environment
call powershell -NoProfile -ExecutionPolicy Bypass -Command ".\venv\Scripts\Activate.ps1"

python .\django\api\scripts\qb_data_to_db.py

pause