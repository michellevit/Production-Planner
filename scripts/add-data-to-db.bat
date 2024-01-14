:: add-data-to-db.bat

@echo off

:: Run qb_data_to_db.py inside Docker container

docker exec production-planner-backend-1 python /django/api/scripts/qb_data_to_db.py
