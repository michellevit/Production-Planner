@echo off

REM Change directory to where your docker-compose.yml file is located
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

REM Start your Docker Compose application
docker-compose up -d

REM Print a message indicating the application is running
echo Backend started and running on http://localhost:8000/
echo Frontend started and running on http://localhost:3000/

REM Automatically open the default web browser at localhost:3000
start http://localhost:3000/

REM pause keeps the terminal window open after deploying the app (optional)
REM pause
