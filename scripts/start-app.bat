@echo off

:: Check if Docker Desktop is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    REM Start Docker Desktop
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    REM Wait for Docker to initialize (adjust the sleep time if needed)
    timeout /t 120
)

:: Change directory to where your docker-compose.yml file is located
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

:: Start your Docker Compose application
docker-compose up -d

:: Print a message indicating the application is running
echo Backend started and running on http://localhost:8000/
echo Frontend started and running on http://localhost:3000/

:: Automatically open the default web browser at localhost:3000
start http://localhost:3000/
start http://localhost:8000/

:: keep the terminal window open after deploying the app
:: pause
