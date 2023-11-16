Project Title: Production Planner


----------
Table of Contents: 
1. Project Description
2. Technologies Used
3. How To Run In Development
4. How To Deploy In Production
5. Initial Setup (For Development + Production)
6. How To Use The Program
7. How To Backup The Database (+ Restore)
8. How To Clear The Database
9. Credits


----------
1. Project Description: 

Summary: 
To help coordinate the sales, production and shipping of orders.

In-depth Overview:
Every day new orders are entered into QuickBooks and the Production team must evaluate which orders are able to be shipped, and then prepare each order for shipping - this involves significant back-and-forth between the Administrator and Production team. Here is the sequence of events:

1. The Administrator enters new orders into QuickBooks in the morning, then creates an order report on QuickBooks, which is then uploaded to the Production Planner App.
2. The Production Planner app displays each order, allowing the Production team to easily mark it as delayed or add the dimensions/weight for the prepared package when it is ready (or any notes).
3. The Administrator can see which orders are ready for the day, check the notes for issues, or go ahead and use the package information to create the waybills for the daily shipments.

This app replaces the previous process, which consisted of a paper report being printed each day, causing the Production team to have to prepare all orders at once, and causing the Administrator to have to wait for all the daily orders to be prepared before knowing if an order could be shipped.


----------
2. Technologies Used:
-Django Rest Framework
-Python
-JavaScript
-React
-HTML
-CSS
-JSON


----------
3. How To Run In Development:
-Activate the virtual environment: 
--Open terminal, navigate/cd to project
--use the command: # C:/Users/path/to/virtualenv/Scripts/Activate.ps1
-Go to the file django/Production_Planner/settings.py:
--Change the 'DEVELOPMENT_MODE' var to True
----This will switch the database to SQLite (unlike MySQL which requires Docker container to run)
--Change the 'DEBUG' to True
----Now print statements (in the backend) will output in the terminal where the server is running
-If initializing the database for the first time: 
--In the terminal, navigate to the django folder and run: python manage.py makemigrations
--Then run: python manage.py migrate
-Start the server:
--Navigate to the django folder (in the terminal) 
--Run: python manage.py runserver
--Browser: http://localhost:8000/
-Start the reactapp:
--Navigate to the reactapp folder (in the terminal)
--Run: npm start
--Browser: http://localhost:3000/
-To access django admin interface:
--Broswer: http://localhost:8000/admin/login/?next=/admin/


----------
4. How To Deploy In Production:
-Go to the file django/Production_Planner/settings.py
--Change the 'DEVELOPMENT_MODE' var to False
---This will switch the database to MySQL (unlike SQLite which does not require Docker, but is less robust for production)
--Change the 'DEBUG' var to False
---Now print statements (in the backend) will output in the Docker 'backend' image logs
-Start the Docker container: 
--Option 1: Double-click the start-app.bat file (only on Windows)
--Option 2: 
---Start the Docker application
---Open the terminal and navigate/cd into the project
---Run 'docker-compose build'
---Then run 'docker-compose up'
---Note: it usually takes ~6 minutes for the react server to start

-If initializing the database/volume for the first time: 
--Run migrations for the database:
---In the terminal, navigate to the project root directory 
---Run: docker-compose exec backend python manage.py migrate
---Run: docker-compose exec backend python manage.py import_products_to_db

-To stop the Docker container: 
--In the powershell where Docker was started: execute ctrl-c
-To clean/reset the Docker environment:
--In the powershell where Docker was started: execute ctrl-c then run 'docker-compose down'
-After updating static files, navigate to the root directory and run: docker-compose exec backend python manage.py collectstatic --no-input


----------
5. Initial Setup (For Development + Production)
-Set the environment variables:
--Open the .env file
--Add the following data with the correct values:
    django_secret_key = '[key here]'
    DB_ROOT_PASSWORD = '[password here]'
    MYSQL_DB_NAME = '[db name here]'
    DB_USER = '[db user here]'
    DB_PASSWORD = '[db apssword here]'
--Populate the 'Dimension' DB Table:
---In the terminal, navigate to the project root directory
---Run: docker-compose exec backend python manage.py import_dimensions_to_db
--Populate the 'Product' DB Table:
---In the terminal, navigate to the project root directory
--Create a superuser to access Django admin site (use credentials in .env file):
---python manage.py createsuperuser
---To access Django's admin interface - go to broswer url: http://localhost:8000/admin/login/?next=/admin/


----------
6. How To Use The Program:
-Open the app by double-clicking the 'start-app.bat' file 
--*Note: it may take several minutes for the frontend to boot up
--Open the frontend using the browser url:  http://localhost:3000/
--Open the backend using the browser url: http://localhost:8000/
-Production Team:
--Navigate to the Open Orders page to add shipping details for the unshipped orders
--Navigate to the Home -> Add Report tab to see when the latest report was added
--Navigate to the Home -> Add Dimensions tab to add more dimensions to the open-orders order options
-Administrator: 
--Navigate to the Home -> Add Report tab to upload the latest order report (only the last 5 are recorded in 'Previous Uploads' section)
--Navigate to the Home -> Add Order tab to manually add an order/quote, or get a dimensions/weight quote for an order
--Navigate to the All Orders page to review shipping details


----------
7. How To Backup The Database (+ Restore)
-Note: The backup-database.bat script will delete old backups, keeping only the 10 most recent backups
-To backup the database:
--In the project's root directory, double click the 'backup-database.bat' file
--The backup will be saved in the 'db-backups' folder
-To restore from a backup:
--Access the Docker container running the MySQL db:  docker exec -it production-planner-db-1 bash
---Note: username/password is in the .env file
--Copy the backup file into the Docker container - run: docker cp "C:\Users\Michelle\Documents\Coding_Projects\Production-Planner\db-backups\20231115_backup.sql" production-planner-db-1:/db_backups/20231115_backup.sql
--Enter the following command in the bash-4.4# prompt: mysql -u [username] -p[password] Production_Planner_DB < /db-backups/[YYYYMMMDD]_backup.sql
---Note: replace the [username] and [password] with data from the .env file, and [YYYYMMDD] with the backup date you want to restore to
--Enter: exit;

----------
8. How To Clear The Database
-Option 1: 
--*To delete one entry at a time
--Go to the Django Admin interface (http://localhost:8000/admin) 
--Manually delete entries
-Option 2:
--*For the Order table data only
--Open the django/api/script/check_order_report.py file
--Uncomment lines 161-167
--In the terminal, navigate to the django folder and run 'python manage.py check_order_report.py'
--Return to the check_order_report.py script and comment out lines 161-167
-Option 3: 
--*If using Docker
--Navigate to the project's root folder
--Run: docker exec -it production-planner-db-1 bash
--Connect to mysql: mysql -u username -p
---Note: username/password is in the .env file
--Select the database: USE Production_Planner_DB
--List all the tables in the db: SHOW TABLES;
--Delete data from each table: DELETE FROM table_name;
--Exit MySQL: EXIT;
--Exit the container shell: exit


-----------
9. Credits: 
Michelle Flandin