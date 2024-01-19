import pyodbc
import sys
import os


def check_qodbc_connection():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    error_log_file = os.path.join(current_dir, 'error-log.txt')

    try:
        conn_str = 'DSN=Production-Planner-DSN;'
        connection = pyodbc.connect(conn_str, autocommit=True)
        query = """SELECT TOP 1 RefNumber FROM SalesOrderLine"""
        cursor = connection.cursor()
        cursor.execute(query)
        cursor.close()
        connection.close()
        return True

    except pyodbc.Error as e:
        with open(error_log_file, 'a') as f:
            f.write("An error occurred: {}\n".format(e))
        sys.exit(1)

if __name__ == "__main__":
    check_qodbc_connection()
    sys.exit(0)
