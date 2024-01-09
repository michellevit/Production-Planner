@echo off
REM Check if Docker Desktop is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    REM Start Docker Desktop
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    REM Wait for Docker to initialize (adjust the sleep time if needed)
    timeout /t 120
)

REM Change directory to where your docker-compose.yml file is located
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

REM Check if the Docker containers for the project are running
docker-compose ps -q
if not "%errorlevel%"=="0" (
    REM Stop running containers
    docker-compose down
    REM Wait for containers to stop
    timeout /t 10
)

REM Build or rebuild the Docker images
docker-compose build --no-cache

REM Start the containers
docker-compose up -d

REM Execute any necessary migration or setup commands
docker-compose exec backend python manage.py migrate

REM Remove dangling/unused Docker images
docker image prune -f

REM Troubleshooting:
REM You may need to manually stop + start the container after rebuild-app.bat is run
REM Check if you need to apply migrations 
REM -- In terminal - run: 
REM ---- docker-compose exec backend python manage.py makemigrations
REM ---- docker-compose exec backend python manage.py migrate

pause
