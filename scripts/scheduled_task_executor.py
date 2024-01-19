# scheduled_task_executor.py

import schedule
import time
from datetime import datetime
import os
import sys
import subprocess


# Global Variables
current_dir = os.path.dirname(os.path.abspath(__file__))
lock_file = os.path.join(current_dir, 'script.lock')
error_log_file = os.path.join(current_dir, 'error_scripts', 'error-log.txt')
check_log_file = os.path.join(current_dir, 'error_scripts', 'check-log.txt')


def main():
    # Schedule the run-app.bat file to run every 1 minute
    schedule.every(60).seconds.do(run_job)
    try:
        # Start an infinite loop to continuously run scheduled tasks
        while True:
            # Run any tasks that are scheduled to run at this time
            schedule.run_pending()
            # Check if the script should exit (e.g., if stop.flag is found)
            check_for_exit_flag()
            # Wait for 5 seconds before running the loop again
            time.sleep(5)
    # Handle a keyboard interrupt (e.g., Ctrl+C) gracefully
    except KeyboardInterrupt:
        delete_lock_file()
        sys.exit(0)
    # Handle any other exceptions
    except Exception as e:
        with open(error_log_file, 'a') as f:
            print(f"{datetime.now().strftime('%m/%d/%y %H:%M')} CRITICAL ERROR: scheduled_task_executor.py - stopped with an exception.\n{e}\n", file=f)
        delete_lock_file()
        sys.exit(1)
    

def create_lock_file():
    with open(lock_file, 'w') as f:
        f.write("")
    with open(check_log_file, 'a') as f:
        f.write(f"{datetime.now().strftime('%m/%d/%y %H:%M')} scheduled_task_executor.py - Lock file created.\n")

def delete_lock_file():
    if os.path.exists(lock_file):
        os.remove(lock_file)
        with open(check_log_file, 'a') as f:
            f.write(f"{datetime.now().strftime('%m/%d/%y %H:%M')} scheduled_task_executor.py - Lock file deleted.\n")
            

# Function to check for the existence of stop.flag file
def check_for_exit_flag():
    if os.path.exists("stop.flag"):
        os.remove("stop.flag") 
        delete_lock_file()
        with open(check_log_file, 'a') as f:
            print(f"{datetime.now().strftime('%m/%d/%y %H:%M')} scheduled_task_executor.py - Stop flag found, script has stopped.\n", file=f)
        sys.exit(0)


# Function that defines the job to be scheduled
def job():
    try:
        bat_file = os.path.join(current_dir, 'run-app.bat')
        result = subprocess.run(bat_file, shell=True)
        if result.returncode != 0:
            raise Exception(f"{datetime.now().strftime('%m/%d/%y %H:%M')} run-app.bat exited with return code {result.returncode}\n")
    except Exception as e:
        with open(error_log_file, 'a') as f:
            f.write(f"{datetime.now().strftime('%m/%d/%y %H:%M')} CRITICAL ERROR: scheduled_task_executor.py - issue with job execution.\n{e}\n")
        sys.exit(1)


# Function that decides whether to run the job based on current time
def run_job():
    now = datetime.now()
    if now.weekday() < 5: # and 6 <= now.hour < 23:
        job()
        with open(check_log_file, 'a') as f:
            print(f"{datetime.now().strftime('%m/%d/%y %H:%M')} scheduled_task_executor.py - Job executed\n", file=f)
    else:
        with open(check_log_file, 'a') as f:
            print(f"{datetime.now().strftime('%m/%d/%y %H:%M')} scheduled_task_executor.py - Job not executed - not working hours (Mon-Fri / 6AM-6PM)\n", file=f)


# Run the main function if this script is executed directly
if __name__ == "__main__":
    check_for_exit_flag()
    # Check if another instance of this script is already running
    if os.path.exists(lock_file):
        with open(check_log_file, 'a') as f:
            f.write(f"{datetime.now().strftime('%m/%d/%y %H:%M')} scheduled_task_executor.py - Existing lock file found. Exiting.\n")
        sys.exit(1)
    else:
        create_lock_file()
    main()
