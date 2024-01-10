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

:: Check if the Docker containers for the project are running
docker-compose ps -q
if not "%errorlevel%"=="0" (
    :: Stop running containers
    docker-compose down
    :: Wait for containers to stop
    timeout /t 10
)

:: Build or rebuild the Docker images
docker-compose build --no-cache

:: Start the containers
docker-compose up -d

:: Execute any necessary migration or setup commands
docker-compose exec backend python manage.py migrate

:: Remove dangling/unused Docker images
docker image prune -f

:: Troubleshooting:
:: You may need to manually stop + start the container after rebuild-app.bat is run
:: Check if you need to apply migrations 
:: -- In terminal - run: 
:: ---- docker-compose exec backend python manage.py makemigrations
:: ---- docker-compose exec backend python manage.py migrate

pause
