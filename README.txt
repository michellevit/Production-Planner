Project Title: Production Planner


----------
Table of Contents: 
1. Project Description
2. Technologies Used
3. First-Time Setup
4. Preparing To Run In Development
5. Preparing To Deploy In Production
6. How To Start The Program
7. How To Use The Program
8. How To Backup The Database (+ Restore)
9. How To Clear The Database
10. How To Fetch Updates
11. Credits


----------
1. Project Description

Summary: To help coordinate the sales, production and shipping of orders.
In-depth Overview: Every day new orders are entered into QuickBooks and the Production team must evaluate which orders are able to be shipped, and then prepare each order for shipping - this involves significant back-and-forth between the Administrator and Production team. Here is the sequence of events:
1. The Administrator enters new orders into QuickBooks in the morning, then creates an order report on QuickBooks, which is then uploaded to the Production Planner App.
2. The Production Planner app displays each order, allowing the Production team to easily mark it as delayed or add the dimensions/weight for the prepared package when it is ready (or any notes).
3. The Administrator can see which orders are ready for the day, check the notes for issues, or go ahead and use the package information to create the waybills for the daily shipments.
Note: This app replaces the previous process, which consisted of a paper report being printed each day, causing the Production team to have to prepare all orders at once, and causing the Administrator to have to wait for all the daily orders to be prepared before knowing if an order could be shipped.


----------
2. Technologies Used
-Windows
-Django Rest Framework
-Python
-JavaScript
-React
-HTML
-CSS
-JSON
-SQLite
-MySQL
-Docker


----------
3. First-Time Setup
-Install Git: 
--Download the Git installer for Windows: https://git-scm.com/download/win
-Open a PowerShell Terminal (if using VSCode make sure to close + open VSCode after installing Git to apply path changes)
-Clone the project repository from GitHub:
--Open a Terminal and navigate to the folder you want to save the Production Planner app to
--In the terminal, run: git clone https://github.com/michellevit/Production-Planner.git
-Set the environment variables:
--Create a new file, in the project's root directory, named '.env'
--Copy-paste the data from the existing 'env.txt' file into the new '.env' file
--Replace the 'xyz' placeholders with real values
---Note: the env.txt file includes instructions to get new secret keys, etc
--Change the file name from 'env.txt' to '.env'
-Follow instructions for 'Preparing To Run In Development' (step 4) OR 'Preparing To Deploy In Production' (step 5)
-Create a superuser to access Django admin site:
--python manage.py createsuperuser
--Use credentials from the .env file
--To access Django's admin interface - go to broswer url: http://localhost:8000/admin/login/?next=/admin/


----------
4. Preparing To Run In Development
-Go to the file django/Production_Planner/settings.py:
--Change the 'DEVELOPMENT_MODE' var to True
----This will switch the database to SQLite (unlike MySQL which requires Docker container to run)
--Change the 'DEBUG' to True
----Now print statements (in the backend) will output in the terminal where the server is running
-Activate the virtual environment: 
--Open terminal and navigate/cd to the project's root folder
--use the command: # C:/Users/path/to/virtualenv/Scripts/Activate.ps1
-Initialize the Database: 
--In the terminal, navigate to the django folder and run: python manage.py makemigrations
--Then run: python manage.py migrate
-Populate the 'Dimension' DB Table:
--In the terminal, navigate to the folder: Production-Planner/django
--Run: python manage.py import_dimensions_to_db
-Populate the 'Product' DB Table:
--In the terminal, navigate to the folder: Production-Planner/django
--Run: python manage.py import_dimensions_to_db
-Complete the 'Preparing To Run In Development' (step 4) instructions


----------
5. Preparing To Deploy In Production
-Go to the file django/Production_Planner/settings.py
--Change the 'DEVELOPMENT_MODE' var to False
---This will switch the database to MySQL (unlike SQLite which does not require Docker, but is less robust for production)
--Change the 'DEBUG' var to False
---Now print statements (in the backend) will output in the Docker 'backend' image logs
-Download Docker
-Enable Virtual Machine Platform on Windows
--Open PowerShell as an administrator
--Run: dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
--Then Run: dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
-Install WSL 2 (if not already installed)
--In the terminal - run: wsl --install
-Enable virtualization in computer's BIOS
--Access the Bios: restart the computer and enter BIOS (Look for a message on your screen during boot that tells you which key to press to enter the BIOS/UEFI setup - usually F2, F12, Delete, or Esc)
--Navigate to Advanced settings
--Locate Virtualization Technology and enable it
--Save and Exit
--Restart computer
-Start the Docker container: 
-Open the terminal and navigate/cd into the project
--Start Docker (or make sure it is already running)
--Run 'docker-compose build'
--Then run 'docker-compose up'
--Note: it may take ~5-8 minutes for the react server to start
-Initialize the Database: 
--Run migrations for the database:
---In the terminal, navigate to the project root directory 
---Run: docker-compose exec backend python manage.py migrate
-Populate the 'Dimension' DB Table:
--In the terminal, navigate to the project root directory
--Run: docker-compose exec backend python manage.py import_dimensions_to_db
-Populate the 'Product' DB Table:
--In the terminal, navigate to the project root directory
--Run: docker-compose exec backend python manage.py import_dimensions_to_db
-Complete the 'Preparing To Run In Development' (step 4) instructions


----------
6. How To Start The Program
-In PRODUCTION:
--Option 1 (via Docker): 
---Open the app by double-clicking the 'start-app.bat' file 
---*Note: it may take several minutes for the frontend to boot up
---The frontend browser url should automatically open:  http://localhost:3000/
---Open the backend using the browser url: http://localhost:8000/
--Option 2 (via Terminal):
---In the terminal, navigate to the project's root directory
---Run: docker-compose up
--To stop the Docker container: 
---Option 1 (via Docker): 
----In the Docker application, click the stop button
---Option 2  (via Terminal):
----In the PowerShell where Docker was started: execute ctrl-c
-----To clean/reset the Docker environment:
------In the PowerShell where Docker was started: execute ctrl-c then run 'docker-compose down'
------After updating static files, navigate to the root directory and run: docker-compose exec backend python manage.py collectstatic --no-input
-In DEVELOPMENT:
--Start the server:
---Navigate to the django folder (in the terminal) 
---Run: python manage.py runserver
---Browser: http://localhost:8000/ OR http://aw1.gtc.local:8000/
--Start the reactapp:
---Navigate to the reactapp folder (in the terminal)
---Run: npm start
---Browser: http://localhost:3000/ OR http://aw1.gtc.local:3000/
--To access django admin interface:
---Broswer: http://localhost:8000/admin/login/?next=/admin/


----------
7. How To Use The Program
-Production Team:
--Navigate to the Open Orders page to add shipping details for the unshipped orders
--Navigate to the Home -> Add Report tab to see when the latest report was added
--Navigate to the Home -> Add Dimensions tab to add more dimensions to the open-orders order options
-Administrator: 
--Navigate to the Home -> Add Report tab to upload the latest order report (only the last 5 are recorded in 'Previous Uploads' section)
--Navigate to the Home -> Add Order tab to manually add an order/quote, or get a dimensions/weight quote for an order
--Navigate to the All Orders page to review shipping details


----------
8. How To Backup The Database + Restore (for Production mode)
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
9. How To Clear The Database
-Option 1: 
--*To delete one entry at a time (works in both Production/MySQL or Development/SQLite)
--Go to the Django Admin interface (http://localhost:8000/admin) 
--Manually delete entries
-Option 2:
--*To delete the Order table data only (works in both Production/MySQL or Development/SQLite)
--Open the django/api/script/check_order_report.py file
--Uncomment lines 161-167
--In the terminal, navigate to the django folder and run 'python manage.py check_order_report.py'
--Return to the check_order_report.py script and comment out lines 161-167
-Option 3:
--*To delete the database through the terminal (works only in Development/SQLite)
--Open the terminal and navigate to the 'django' folder of the project
--Run 'python manage.py flush' and confirm yes
-Option 4: 
--*To delete when using Docker/MySQL (works only in Production/MySQL)
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
10. How To Fetch Updates
-Open a Terminal and navigate to the Production-Planner directory
-Select the main branch: git checkout main
-Run: git pull origin main
-Run: docker-compose build
-Start the Docker app again to see changes
--To update ALL services - run: 
        docker-compose down
        docker-compose up -d
--To update affected services - run:
        docker-compose up --build [backend/frontend/db]
        (e.g. docker-compose up --build backend)
-Cleanup (Optional):
--If you're certain that the changes are working as expected, you can remove any old or unused containers and images to save disk space:
--Run: docker-compose down --rmi local  
--Note: This removes containers and images not in use


-----------
11. Credits
Michelle Flandin