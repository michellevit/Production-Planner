@echo off
REM Change directory to where your docker-compose.yml file is located
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

REM Stop the Docker Compose application
docker-compose down

REM Optional delay, can be adjusted or removed as needed
timeout /t 5

REM Start your Docker Compose application
docker-compose up -d

REM Print a message indicating the application has been restarted
echo Application has been restarted.

REM Automatically open the default web browser at localhost:3000 (optional)
start http://localhost:3000/

REM pause keeps the terminal window open after restarting the app (optional)
pause