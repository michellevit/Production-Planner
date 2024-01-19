import sys
import os


current_dir = os.path.dirname(os.path.abspath(__file__))
error_log_file = os.path.join(current_dir, 'error-log.txt')
email_sent = False


try:
    with open(error_log_file, 'r') as file:
        for line in file:
            if 'email' in line:
                email_sent = True
                break

    if email_sent:
        sys.exit(0)  
    else:
        sys.exit(1)  


except FileNotFoundError:
    print(f"No log file found at {error_log_file}, continuing...")
    sys.exit(0)  
