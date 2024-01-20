# send_error_email.py

import os
import sys
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl


load_dotenv()


def set_custom_message():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    error_log_path = os.path.join(current_dir, 'error-log.txt')
    process_log_path = os.path.join(current_dir, 'process-log.txt')
    with open(error_log_path, 'r') as log_file:
        error_log_contents = log_file.read()
    with open(process_log_path, 'r') as log_file:
        process_log_contents = log_file.read()
    return f"The Production Planner Application has encountered an error.\n\nERROR LOG:\n{error_log_contents}\n\nPROCESS LOG:\n{process_log_contents}"
    

def send_email(custom_message):
    context = ssl.create_default_context()
    port = int(os.getenv('ERROR_ALERT_EMAIL_SMTP_PORT'))
    smtp_server = os.getenv('ERROR_ALERT_EMAIL_SMTP_SERVER')
    sender_email = os.getenv('ERROR_ALERT_FROM_EMAIL')
    receiver_email = os.getenv('ERROR_ALERT_TO_EMAIL')
    password = os.getenv('ERROR_ALERT_EMAIL_PASSWORD')
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = 'Production Planner - Error Alert' 
    msg.attach(MIMEText(custom_message, 'plain'))
    try:
        with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
            server.login(sender_email, password)
            result = server.sendmail(sender_email, receiver_email, msg.as_string())
            if result:
                print(f"Failed to send email to: {result}")
                sys.exit(1)
            else:
                sys.exit(0)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)  


if __name__ == "__main__":
    custom_message = set_custom_message()
    send_email(custom_message)