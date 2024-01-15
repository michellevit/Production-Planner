import pyodbc
import sys


def check_qodbc_connection():
    try:
        conn_str = 'DSN=Production-Planner-DSN;'
        connection = pyodbc.connect(conn_str, autocommit=True, timeout=10)
        connection.close()
        return True
    except pyodbc.Error as e:
        print(f"Connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_qodbc_connection()
    sys.exit(0)