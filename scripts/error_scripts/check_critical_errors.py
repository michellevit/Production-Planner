import sys

log_file_path = 'error-log.txt'
critical_error_found = False
line_count = 0
threshold = 8

try:
    with open(log_file_path, 'r') as file:
        for line in file:
            line_count += 1
            if 'CRITICAL' in line:
                critical_error_found = True
                break

    if line_count > threshold or critical_error_found:
        sys.exit(1)  
    else:
        sys.exit(0)  

except FileNotFoundError:
    print(f"No log file found at {log_file_path}, continuing...")
    sys.exit(0)  
    
