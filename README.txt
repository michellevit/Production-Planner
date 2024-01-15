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
12. Credits


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
- Windows Task Scheduler (for automating script execution)

----------
3. First-Time Setup
- Install Git: 
  - Download the Git installer for Windows: https://git-scm.com/download/win
- Open a PowerShell Terminal (if using VSCode make sure to close + open VSCode after installing Git to apply path changes)
- Clone the project repository from GitHub:
  - Open a Terminal and navigate to the folder you want to save the Production Planner app to
  - In the terminal, run: git clone https://github.com/michellevit/Production-Planner.git
 - Set the environment variables:
  - Create a new file, in the project's root directory, named '.env'
  - Copy-paste the data from the existing 'env.txt' file into the new '.env' file
  - Replace the 'xyz' placeholders with real values
    * Note: the env.txt file includes instructions to get new secret keys, etc
  - Change the file name from 'env.txt' to '.env'
- Update the file paths for the .bat scripts
- Install node:
  - https://nodejs.org/en
- Follow instructions for 'Preparing To Run In Development' (step 4) OR 'Preparing To Deploy In Production' (step 5)
- Create a superuser to access Django admin site:
  - cd into the django folder
  - python manage.py createsuperuser
  - Use credentials from the .env file
  - To access Django's admin interface - go to broswer url: http://localhost:8000/admin/login/?next=/admin/
- Create a virtual environment in the main folder:
  - cd into the project's main folder (i.e. Production-Planner)
  - create the virtual environment:
    - Open: scripts/create-virtual-env.bat
    - Uncomment line 4-7 (commented out to prevent accidental deployment)
    - Run: create-virtual-env.bat
    - Note: the reason for this is because QODBC is difficult to install in the Docker container, so instead this script runs outside of Docker on the system on a schedule, and updates a json file that Docker can access.


----------
4. Preparing To Run In Development
- Go to the file django/Production_Planner/settings.py:
  - Change the 'DEVELOPMENT_MODE' var to True
    - This will switch the database to SQLite (unlike MySQL which requires Docker container to run)
  - Change the 'DEBUG' to True
    - Now print statements (in the backend) will output in the terminal where the server is running
- Activate the virtual environment: 
  - Open terminal and navigate/cd to the project's root folder
  - Use the command: # C:/Users/path/to/virtualenv/Scripts/Activate.ps1
- Initialize the Database: 
  - In the terminal, navigate to the django folder and run: python manage.py makemigrations
  - Then run: python manage.py migrate
- Populate the 'Dimension' DB Table:
  - In the terminal, navigate to the folder: Production-Planner/django
  - Run: python manage.py import_dimensions_to_db
- Populate the 'Product' DB Table:
  - In the terminal, navigate to the folder: Production-Planner/django
  - Run: python manage.py import_products_to_db
- Complete the 'Preparing To Run In Development' instructions (starting at 'Create a superuser to access Django admin site')


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
- Create a Task on Windows Task Scheduler to run 'get-qb-data.bat' periodically
  - Click on the Start menu and type "Task Scheduler" in the search bar
  - Open the Task Scheduler application
  - In the Task Scheduler, go to the "Action" menu and select "Create Basic Task..."
    - Name the task "Production-Planner-Batch-Script-Task"
      - Note: it is important that this is the exact name of the task
    - Choose "Daily"
    - Set start date + time (6:00AM)
    - Set frequency: repeat task every 2 minutes
    - For the duration of: 12 hours
    - Set the script: click browse and select the batch file + click open
    - Review settings + click "Finish"
    - Customize for Weekdays only: 
      - In the Task Scheduler Library, find the task you just created and right-click on it.
      - Select "Properties".
      - Go to the "Triggers" tab and edit the trigger you created.
      - Under "Advanced settings", click on "Weekly".
      - Choose Monday, Tuesday, Wednesday, Thursday, and Friday.
      - Click "OK" to save the changes.
      - Complete the 'Preparing To Run In Development' instructions (starting at 'Create a superuser to access Django admin site')


----------
6. How To Start The Program
- In PRODUCTION:
  - Option 1 (via batch file):
    - Navigate to the project's 'scripts' folder
    - Double-click the 'qb-data-to-app.bat' file
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
     - Broswer: http://localhost:8000/admin/login/?next=/admin/


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
- To backup the database:
  - In the project's root directory, double click the 'backup-database.bat' file
  - The backup will be saved in the 'db-backups' folder
- To restore from a backup:
  - Access the Docker container running the MySQL db:  docker exec -it production-planner-db-1 bash
    * Note: username/password is in the .env file
  - Copy the backup file into the Docker container - run: docker cp "C:\Users\Michelle\Documents\Coding_Projects\Production-Planner\db-backups\20231115_backup.sql" production-planner-db-1:/db_backups/20231115_backup.sql
  - Enter the following command in the bash-4.4# prompt: mysql -u [username] -p[password] Production_Planner_DB < /db-backups/[YYYYMMMDD]_backup.sql
    * Note: replace the [username] and [password] with data from the .env file, and [YYYYMMDD] with the backup date you want to restore to
  - Enter: exit;


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
- If changes were made to the models.py file:
  - Make sure the Docker container is running
  - CD into the project's root directory
    - Run: docker exec -it production-planner-backend-1 python manage.py makemigrations
    - Run: docker exec -it production-planner-backend-1 python manage.py migrate
- If changes were made to a static file (e.g. django/api/static/welcome.css): 
  - Delete all the welcome.css file versions in django/static
  - CD into the project's root directory
  - Run: docker exec -it production-planner-backend-1 python manage.py collectstatic --noinput
- If changes were made to the entire app in VSCode:
  - docker-compose down
  - docker-compose build
    - Add '--no-cache' to build from scratch, ignoring previuous builds
  - docker-compose up
- If changes were just made to one image: 
  - docker build -t your_image_name .


-----------
11. Troubleshooting
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

-----------
12. Credits
Michelle Flandin