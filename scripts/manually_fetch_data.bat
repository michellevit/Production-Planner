:: Run script to add QB data to DB
docker exec production-planner-backend-1 python /django/api/scripts/qb_data_to_db.py

:: Run script to update last_active field in LastUpdate model instance
docker exec production-planner-backend-1 python /django/api/scripts/initiate_last_active_command.py


exit /b
