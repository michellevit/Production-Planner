@echo off
REM Change directory to where your docker-compose.yml file is located
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

REM Stop the Docker Compose application
docker-compose down

REM Print a message indicating the application has been stopped
echo The Production Planner application has been stopped.

REM Optionally, you can include commands to clean up any unused Docker resources
docker system prune -af

REM pause keeps the terminal window open after stopping the app (optional)
pause