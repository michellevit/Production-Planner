@echo off

:: Navigate to the directory containing your docker-compose.yml file
cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner

docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker image prune -f