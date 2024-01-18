@echo off
echo Starting Docker Containers...

:: Unpause or Start Docker containers
docker unpause production-planner-backend-1
docker unpause production-planner-nginx-1
docker unpause production-planner-frontend-1
docker unpause production-planner-db-1