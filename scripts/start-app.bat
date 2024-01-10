@echo off

:: Change directory to where your docker-compose.yml file is located
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

:: Start your Docker Compose application
docker-compose up -d

:: Print a message indicating the application is running
echo Backend started and running on http://localhost:8000/
echo Frontend started and running on http://localhost:3000/

:: Automatically open the default web browser at localhost:3000
start http://localhost:3000/

:: pause keeps the terminal window open after deploying the app (optional)
:: pause
