import sys
import os


current_dir = os.path.dirname(os.path.abspath(__file__))
error_log_file = os.path.join(current_dir, 'error-log.txt')
critical_error_found = False
line_count = 0
threshold = 12


try:
    with open(error_log_file, 'r') as file:
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
    print(f"No log file found at {error_log_file}, continuing...")
    sys.exit(0)  
    
