@echo off
setlocal EnableDelayedExpansion

docker pause production-planner-backend-1
docker pause production-planner-nginx-1
docker pause production-planner-frontend-1
docker pause production-planner-db-1