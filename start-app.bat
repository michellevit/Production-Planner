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
REM cd /path/to/your/docker-compose
cd C:\Users\Michelle\Documents\Coding_Projects\Production-Planner

REM Build or rebuild the Docker images
REM Only needed for first time deployment or if changes have been made to app
REM docker-compose build
REM docker-compose exec backend python manage.py migrate

REM Start your Docker Compose application
docker-compose up -d

REM Print a message indicating the application is running
echo Backend started and running on http://localhost:8000/
echo Frontend started and running on http://localhost

REM You can add more commands here, such as logging or notifications
pause