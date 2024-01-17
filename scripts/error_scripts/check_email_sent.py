import sys

log_file_path = 'error-log-file.txt'
email_sent = False

try:
    with open(log_file_path, 'r') as file:
        for line in file:
            if 'email' in line:
                email_sent = True
                break

    if email_sent:
        sys.exit(0)  
    else:
        sys.exit(1)  

except FileNotFoundError:
    print(f"No log file found at {log_file_path}, continuing...")
    sys.exit(0)  
