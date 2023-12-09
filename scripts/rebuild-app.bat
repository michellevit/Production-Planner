REM This script is meant for first-time deployment or when changes are made to the app.


@echo off
REM Check if Docker Desktop is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    REM Start Docker Desktop
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    REM Wait for Docker to initialize (adjust the sleep time if needed)
    timeout /t 30
)

REM Change directory to where your docker-compose.yml file is located
cd C:\Users\Michelle\Documents\Coding_Projects\Production-Planner

REM Build or rebuild the Docker images
docker-compose build

REM Execute any necessary migration or setup commands
docker-compose exec backend python manage.py migrate

REM Print a message indicating the build process is complete
echo Build and migration complete.

REM pause keeps the terminal window open after building the app (optional)
pause
