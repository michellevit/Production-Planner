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
8. How To Backup The Database + Restore (for Production mode)
9. How To Clear The Database
10. How To Fetch Updates from GitHub
11. How to Update Docker Container / Database
12. Decoding the Error Log
13. General Troubleshooting
14. Credits


----------
1. Project Description

Summary: To help coordinate the sales, production and shipping of orders.
In-depth Overview: Every day new orders are entered into QuickBooks and the Production team must evaluate which orders are able to be shipped, and then prepare each order for shipping - this involves significant back-and-forth between the Administrator and Production team. Here is the sequence of events:
- The Administrator enters new orders into QuickBooks in the morning
- The Production Planner app runs between 6AM-7PM weekdays and checks for updates to the open orders in QuickBooks, and if there are updates it adds them to the database
- The Production Planner app displays each order, allowing the Production team to easily mark it as delayed or add the dimensions/weight for the prepared package when it is ready (or any notes).
- The Administrator can see which orders are ready for the day, check the notes for issues, or go ahead and use the package information to create the waybills for the daily shipments.
* Note: This app replaces the previous process, which consisted of a paper report being printed each day, causing the Production team to have to prepare all orders at once, and causing the Administrator to have to wait for all the daily orders to be prepared before knowing if an order could be shipped.


----------
2. Technologies Used
- Django Rest Framework
- Python
- JavaScript
- React
- HTML/CSS
- JSON
- Server-Sent Events (SSE)
- SQLite (Development)
- MySQL (Production)
- Docker
- Windows Batch Scripting (for scheduled tasks and automation)


----------
3. First-Time Setup
- Install Git: 
  - Download the Git installer for Windows: https://git-scm.com/download/win
- Open a PowerShell Terminal (if using VSCode make sure to close + open VSCode after installing Git to apply path changes)
- Clone the project repository from GitHub:
  - Open a Terminal and navigate to the folder you want to save the Production Planner app to
  - In the terminal, run: git clone https://github.com/michellevit/Production-Planner.git
 - Set the environment variables:
  - ROOT DIRECTORY .env FILE: 
    - Create a new file, in the project's root directory, named '.env'
    - Copy-paste the data from the existing 'env.txt' file into the new '.env' file
    - Replace the placeholder data with real values
      * Note: the env.txt file includes instructions to get new secret keys, etc
    - Change the file name from 'env.txt' to '.env'
  - REACTAPP .env FILE: 
    - Create a new file, in the project's reactapp folder, named '.env'
    - Copy-paste the data from the existing 'env.txt' file into the new '.env' file
    - Replace the x's in the URLs with 'localhost' or your network's IP address
      * Note: this can be found by opening a command prompt on your computer and run: 'ipconfig' and the IPv4 Address should be the address you need
    - Change the file name from 'env.txt' to '.env'
- Update the file paths for the .bat scripts
- Install node:
  - https://nodejs.org/en
- Create a virtual environment in the main folder:
  - Run: cd C:\path\to\project\Production-Planner 
  - Run: python -m venv venv
  - Run: cd C:\path\to\project\Production-Planner
  - Run: .\venv\Scripts\activate
  - Run: pip install -r requirements.txt
- Update the file paths for the scripts:
  - Go to the main folder, and open the scripts folder
  - Go through each file (including files in the error_scripts subfolder) and update the file paths
- Follow instructions for 'Preparing To Run In Development' (step 4) OR 'Preparing To Deploy In Production' (step 5)


----------
4. Preparing To Run In Development
- Go to the file django/Production_Planner/settings.py:
  - Change the 'DEVELOPMENT_MODE' var to True
    - This will switch the database to SQLite (unlike MySQL which requires Docker container to run)
  - Change the 'DEBUG' to True
    - Now print statements (in the backend) will output in the terminal where the server is running
- Activate the virtual environment: 
  - Open terminal and navigate/cd to the project's root folder
  - Use the command: # C:/path/to/project/Production-Planner/venv/Scripts/Activate.ps1
- Initialize the Database: 
  - In the terminal, navigate to the django folder and run: python manage.py makemigrations
  - Then run: python manage.py migrate
- Populate the 'Dimension' DB Table:
  - In the terminal, navigate to the folder: Production-Planner/django
  - Run: python manage.py import_dimensions_to_db
- Populate the 'Product' DB Table:
  - In the terminal, navigate to the folder: Production-Planner/django
  - Run: python manage.py import_products_to_db
- Create a superuser to access Django admin site:
  - cd into the django folder
  - python manage.py createsuperuser
  - Use credentials from the .env file
  - To access Django's admin interface - go to broswer url: http://localhost:8000/admin


----------
5. Preparing To Deploy In Production
- Go to the file django/Production_Planner/settings.py
  - Change the 'DEVELOPMENT_MODE' var to False
    - This will switch the database to MySQL (unlike SQLite which does not require Docker, but is less robust for production)
  - Change the 'DEBUG' var to False
    - Now print statements (in the backend) will output in the Docker 'backend' image logs
- Download Docker
- Enable Virtual Machine Platform on Windows
  - Open PowerShell as an administrator
  - Run: dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
  - Then Run: dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
- Install WSL 2 (if not already installed)
  - In the terminal - run: wsl --install
- Enable virtualization in computer's BIOS
  - Access the Bios: restart the computer and enter BIOS (Look for a message on your screen during boot that tells you which key to press to enter the BIOS/UEFI setup - usually F2, F12, Delete, or Esc)
- Navigate to Advanced settings
  - Locate Virtualization Technology and enable it
  - Save and Exit
  - Restart computer
- Start the Docker container: 
  - Open the terminal and navigate/cd into the project
  - Start Docker (or make sure it is already running)
  - Run 'docker-compose build'
  - Then run 'docker-compose up'
  * Note: it may take ~5-8 minutes for the react server to start
- Install MySQL client tools:
  - In the terminal, run the following command to install the MySQL client (default-mysql-client): 
    - docker exec -it production-planner-backend-1 bash
    - apt-get update
    - apt-get install default-mysql-client
- Initialize the Database: 
  - Run migrations for the database:
    - In the terminal, navigate to the project root directory 
    - Run: docker-compose exec backend python manage.py migrate
- Populate the 'Dimension' DB Table:
  - In the terminal, navigate to the project root directory
  - Run: docker-compose exec backend python manage.py import_dimensions_to_db
- Populate the 'Product' DB Table:
  - In the terminal, navigate to the project root directory
  - Run: docker-compose exec backend python manage.py import_products_to_db
- Create a superuser to access Django admin site:
  - cd into the django folder
  - python manage.py createsuperuser
  - Use credentials from the .env file
  - To access Django's admin interface - go to broswer url: http://localhost:8000/admin
- Setup QODBC DSN Connection 
  - Install QODBC (link at bottom of webpage): https://qodbc.com/what-is-qodbc/
  - Search for "QODBC" in Windows search bar and right-click 'Open file location'
  - Open file 'Configure 64-Bit QODBC Driver'
    - Select 'System DSN' tab
    - Click Add
    - Select QODBC Driver for QuickBooks
    - Click Finish
    - Locate the company file (open QuickBooks, login, click F2, file location will appear here)
    - Data Source Name: 'Production-Planner-DSN'
      - Note: it is important to use this exact data source name
    - Select 'Multi-user Mode'
    - Test Connection to QuickBooks (make sure it's successful)
    - Click OK
    - Click OK
- Create a Task on Windows Task Scheduler to run 'backup-database.bat' every morning at 6:15 AM:
  - Click on the Start menu and type "Task Scheduler" in the search bar
  - Open the Task Scheduler application
  - In the Task Scheduler, go to the "Action" menu and select "Create Basic Task..."
    - Name the task "Production-Planner-Backup-Database-Batch-Task"
    - Choose "Daily"
    - Set start date + time (6:15AM)
    - Set frequency: repeat task every day
    - Set the script: click browse and select the batch file (in the scripts folder) + click open
    - Review settings + click "Finish"
    - Customize for Weekdays only: 
      - In the Task Scheduler Library, find the task you just created and right-click on it.
      - Select "Properties".
      - Go to the "Triggers" tab and edit the trigger you created.
      - Under "Advanced settings", click on "Weekly".
      - Choose Monday, Tuesday, Wednesday, Thursday, and Friday.
      - Click "OK" to save the changes.
- NOTE: the start-scheduled-task.bat does not run via Windows Task Scheduler because to run QODBC via the Task Scheduler requires the (paid) QODBC Remote version


----------
6. How To Start The Program
- In PRODUCTION:
  - Option 1 (via batch file):
    - Navigate to the project's 'scripts' folder
    - Double-click the 'start-scheduled-task.bat' file
    - This script will run until:
      - stop-scheduled-task.bat runs 
      - this command prompt is closed
      - this computer shuts down

  - Option 2 (via Docker): 
    - Open the app by double-clicking the 'start-app.bat' file 
    * Note: it may take several minutes for the frontend to boot up
    - The frontend browser url should automatically open:  http://localhost:3000/
        - Open the backend using the browser url: http://localhost:8000/
  - Option 3 (via Terminal):
    - In the terminal, navigate to the project's root directory
    - Run: docker-compose up
  - To stop the Docker container: 
    - Option 1 (via Docker): 
      - In the Docker application, click the stop button
    - Option 2  (via Terminal):
      - In the PowerShell where Docker was started: execute ctrl-c
        - To clean/reset the Docker environment:
        - In the PowerShell where Docker was started: execute ctrl-c then run 'docker-compose down'
      - After updating static files, navigate to the root directory and run: docker-compose exec backend python manage.py collectstatic --no-input
- In DEVELOPMENT:
  - Start the server:
    - Navigate to the django folder (in the terminal) 
    - Run: python manage.py runserver
    - Browser: http://localhost:8000/ OR http://aw1.gtc.local:8000/
  - Start the reactapp:
    - Navigate to the reactapp folder (in the terminal)
    - Run: npm start
    - Browser: http://localhost:3000/ OR http://aw1.gtc.local:3000/
  - To access django admin interface:
     - Broswer: http://localhost:8000/admin/


----------
7. How To Use The Program
- Production Team:
  - Navigate to the Open Orders page to add shipping details for the unshipped orders
  - Navigate to the Home -> Latest Upload tab to see when the latest report was added
  - Navigate to the Home -> Add Dimensions tab to add more dimensions to the open-orders order options
- Administrator: 
  - Navigate to the Home -> Latest Upload tab to upload the latest order report (only the last 5 are recorded in 'Previous Uploads' section)
  - Navigate to the Home -> Add Order tab to manually add an order/quote, or get a dimensions/weight quote for an order
  - Navigate to the All Orders page to review shipping details


----------
8. How To Backup The Database + Restore (for Production mode)
 * Note: The backup-database.bat script will delete old backups, keeping only the 10 most recent backups
 * Note: the backup-database.bat file is scheduled to run at 6AM each week day
- To backup the database:
  - In the project's root directory, double click the 'backup-database.bat' file
  - The backup will be saved in the 'db-backups' folder
- To restore from the most recent backup:
  - Go to the scripts/error_scripts folder
  - Double-click the 'restore-database-from-latest-backup.bat' 
  - A command prompt will appear with the name/date of the latest backup and ask if you are sure you want to restore
    - Type "Y" and press enter (to confirm and restore the database)
    - Close the prompt
  -NOTE: If there is an issue with getting data the next time, it may have something to do with django/api/data/current_open_orders.json (you may need to clear this file)  


----------
9. How To Clear The Database
- Option 1: 
  * To delete entries via Django Admin Interface (works in both Production/MySQL or Development/SQLite)
  - Go to http://localhost:8000/admin
  - Login with credentials in .env file
  - Manually delete entries
- Option 2:
  * To delete the entire database through the terminal (works only in Development/SQLite)
  - Open the terminal and navigate to the 'django' folder of the project
  - Run 'python manage.py flush' and confirm yes
- Option 3: 
  - *To delete when using Docker/MySQL (works only in Production/MySQL)
  - Navigate to the project's root folder
  - Run: docker exec -it production-planner-db-1 bash
  - mysql -u *username (in .env file)* -p
  - Enter password (in .env file)
  - Select the database: USE Production_Planner_DB
    - To list all the tables in the db: SHOW TABLES;
  - Delete data from each table (and reset index): TRUNCATE TABLE *table name (i.e. api_order)*;
  - Exit MySQL: EXIT;
  - Exit the container shell: exit


-----------
10. How To Fetch Updates from GitHub
- Open a Terminal and navigate to the Production-Planner directory
- Select the main branch: git checkout main
- Run: git pull origin main
- Run: docker-compose down
- Run: docker-compose build --no-cache
- Run: docker-compose up


-----------
11. How to Update Docker Container / Database
- If changes were made to the entire app in VSCode:
  -Automated way:
    - Go to scripts/docker_scripts
    - Run docker-migrate.bat
  - Manual way:
    - docker-compose down
    - docker-compose build
      - Add '--no-cache' to build from scratch, ignoring previuous builds
    - docker-compose up
- If changes were just made to one image: 
  - docker build -t your_image_name .
- If changes were made to the models.py file:
  - Make sure the Docker container is running
  -Automated way:
    - Go to scripts/docker_scripts
    - Run docker-migrate.bat
  - Manual way:
    - CD into the project's root directory
    - Run: docker exec -it production-planner-backend-1 python manage.py makemigrations
    - Run: docker exec -it production-planner-backend-1 python manage.py migrate
- If changes were made to a static file (e.g. django/api/static/welcome.css): 
  - Delete all the welcome.css file versions in django/static
  - CD into the project's root directory
  - Run: docker exec -it production-planner-backend-1 python manage.py collectstatic --noinput


-----------
12. Decoding the Error Log
- If a critical error email was received:
  - Open the scripts/error_scripts/error-log-file.txt + read / delete it's Contents


-----------
13. Troubleshooting
- docker-compose build not working: 
  - Make sure there is no node_modules folder accidentally in the root directory 
  - Make sure there is a .dockerignore file in the reactapp to ignore the node_momdules folder
- If running docker-compose build a lot:
  - Make sure to delete dangling images in Docker occassionally:
    - Run: docker image prune -f
  - Build w/o cache to ensure all changes are implemented: 
    - Run: docker-compose build --no-cache
- If the welcome.css (or other static) file changes don't implement:
  - Delete the multiple welcome.css files (+ cached variations - e.g. welcome.98433745.css) in django/static:
  - cd into the django folder and run: python manage.py collectstatic
- If the start-scheduled-task.bat stops working: 
  - Make sure there isn't a stale script.lock or stop.flag file in the scripts folder
  - This can occur if: 
    - The computer unexpectedly shuts down (power outtage)
    - The command prompt, running start-scheduled-task.bat is unexepectedly closed
    - An unexpected error occurs in the code


-----------
14. Credits
Michelle Flandin