import pyodbc
import sys



def check_qodbc_connection():
    try:
        conn_str = 'DSN=Production-Planner-DSN;'
        connection = pyodbc.connect(conn_str, autocommit=True)
        query = """SELECT TOP 1 RefNumber FROM SalesOrderLine"""
        cursor = connection.cursor()
        cursor.execute(query)
        for row in cursor:
            print(row)
        cursor.close()
        connection.close()
        with open('error-log-file.txt', 'a') as f:
            log_msg = "SUCCESS"
            print(log_msg, file=f)
        return True
    except pyodbc.Error as e:
        with open('error-log-file.txt', 'a') as f:
            log_msg = "FAILURE"
            print(log_msg, file=f)
        sys.exit(1)


if __name__ == "__main__":
    check_qodbc_connection()
    sys.exit(0)


# Verifiying connection directly works if calling run-app.bat from terminal (or manually) but for some reason does not work via Task manager - connection always fails.
# Alternative is to try fetching some data and if that does not work then it means that QuickBooks is likely not logged in / QODBC can't connect
# import pyodbc
# import sys
# import os
# def check_qodbc_connection():
#     try:
#         conn_str = 'DSN=Production-Planner-DSN;'
#         connection = pyodbc.connect(conn_str, autocommit=True, timeout=20)
#         connection.close()
#         log_msg = "A"
#         print_error(log_msg)
#         return True
#     except pyodbc.Error as e:
#         log_msg = "B"
#         print_error(log_msg, e)
#         sys.exit(1)

# def print_error(log_msg, e):
#     with open('error-log-file.txt', 'a') as f:
#         if log_msg == "A":
#             log_msg = "Connection successful."
#             print(log_msg, file=f)
#         else:
#             log_msg = f"Connection failed: {e}"
#             print(log_msg, file=f)


# if __name__ == "__main__":
#     check_qodbc_connection()
#     sys.exit(0)
