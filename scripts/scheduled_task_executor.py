# scheduled_task_executor.py

import schedule
import time
from datetime import datetime
import os
import sys
import subprocess


def main():
    # Check immediately if the script should exit
    check_for_exit_flag()
    try:
        # Start an infinite loop to continuously run scheduled tasks
        while True:
            # Run any tasks that are scheduled to run at this time
            schedule.run_pending()
            # Check if the script should exit (e.g., if stop.flag is found)
            check_for_exit_flag()
            # Wait for 1 second before running the loop again
            time.sleep(5)
    # Handle a keyboard interrupt (e.g., Ctrl+C) gracefully
    except KeyboardInterrupt:
        delete_lock_file()
        sys.exit(0)
    # Handle any other exceptions
    except Exception as e:
        with open('error-log.txt', 'a') as f:
            print(f"CRITICAL ERROR: Task scheduler stopped with an exception: {e}", file=f)
        delete_lock_file()
        error_script_path = os.path.join(os.path.dirname(__file__), '..', 'error_scripts', 'send_critical_email.py')
        subprocess.run(['python', error_script_path, 'Scheduled'])
        sys.exit(1)
    

# Path to the lock file used to ensure the script only runs once
lock_file_path = os.path.join(os.path.dirname(__file__), 'script.lock')


# Check if another instance of this script is already running
if os.path.exists(lock_file_path):
    print("Another instance of the script is already running.")
    sys.exit(1)

# Create a lock file to mark this instance of the script as running
with open(lock_file_path, 'w') as lock_file:
    lock_file.write("")

# Function to delete the lock file
def delete_lock_file():
    if os.path.exists(lock_file_path):
        os.remove(lock_file_path)

# Function to check for the existence of stop.flag file
def check_for_exit_flag():
    if os.path.exists("stop.flag"):
        os.remove("stop.flag") 
        delete_lock_file()
        sys.exit(0)


# Function that defines the job to be scheduled
def job():
    bat_file = os.path.join(os.path.dirname(__file__), 'run-app.bat')
    subprocess.run(bat_file, shell=True)

# Function that decides whether to run the job based on current time
def run_job():
    now = datetime.now()
    # Check if current time is within the specified range (weekdays, 6 AM to 11 PM)
    if now.weekday() < 5 and 6 <= now.hour < 18:
        job()

# Schedule the job to run every 10 seconds
schedule.every(150).seconds.do(run_job)

# Run the main function if this script is executed directly
if __name__ == "__main__":
    main()
