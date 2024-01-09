@echo off

REM Change directory to where your docker-compose.yml file is located
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

REM Pause the Docker Compose application
docker-compose pause

REM Print a message indicating the application has been paused
echo The Production Planner application has been paused.

REM pause keeps the terminal window open after pausing the app (optional)
pause