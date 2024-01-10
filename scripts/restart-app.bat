@echo off
:: Change directory to where your docker-compose.yml file is located
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

:: Stop Docker Compose application
docker-compose down

:: Optional delay, can be adjusted or removed as needed
timeout /t 5

:: Start Docker Compose application
docker-compose up -d

:: Print a message indicating the application has been restarted
echo Application has been restarted.

:: Automatically open the default web browser at localhost:3000 (optional)
start http://localhost:3000/

:: pause keeps the terminal window open after restarting the app (optional)
pause