Project Title: Production Planner


----------
Table of Contents: 
1. Project Description
2. Technologies Used
3. How To Run In Development
4. How To Deploy In Production
5. How To Use The Program
6. How To Clear The Database
6. Credits


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
--Open terminal, navigate/cd to project, use the command: # C:/Users/path/to/virtualenv/Scripts/Activate.ps1
-Go to the file django/Production_Planner/settings.py:
--Change the 'DEVELOPMENT_MODE' var to True
----This will switch the database to SQLite (unlike MySQL which requires Docker container to run)
--Change the 'DEBUG' to True
----Now print statements (in the backend) will output in the terminal where the server is running
-Initialize the database after updating the settings:
--In the terminal, navigate to the django folder and run: python manage.py migrate
-Start the server:
--Navigate to the django folder (in the terminal) and run: python manage.py runserver
--Browser: http://localhost:8000/
-Start the reactapp:
--Navigate to the reactapp folder (in the terminal) and run: npm start
--Browser: http://localhost:3000/
-To access django admin interface:
--Broswer: http://localhost:8000/admin/login/?next=/admin/
--Login details in .env file
--To create a superuser: python manage.py createsuperuser


----------
4. How To Deploy In Production:
-Go to the file django/Production_Planner/settings.py
--Change the 'DEVELOPMENT_MODE' var to False
---This will switch the database to MySQL (unlike SQLite which does not require Docker, but is less robust for production)
--Change the 'DEBUG' var to False
---Now print statements (in the backend) will output in the Docker 'backend' image logs
-Start the Docker container: 
--Double-click the start-app.bat file OR:
---Open terminal, navigate/cd to project, execute docker-compose build, then docker-compose up
--To stop the Docker container: 
---docker-compose down


----------
4. How to Use the Program:
1. Open the app...(in progress)
2. Navigate to the Home page -> 'Add Report' tab, and browse for the new order report
3. Production Team: Add order information for each order on the 'Open Orders' page
4. Administrator: Review order information on the 'All Orders' page


--------
5. Credits: 
Michelle Flandin
