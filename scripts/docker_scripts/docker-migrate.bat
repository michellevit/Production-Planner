cd C:\Users\Michelle Flandin\Documents\Coding_Projects\Production-Planner\scripts\error_scripts
docker exec -it production-planner-backend-1 python manage.py makemigrations
docker exec -it production-planner-backend-1 python manage.py migrate
pause