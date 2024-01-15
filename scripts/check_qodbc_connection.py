import pyodbc
import sys


def check_qodbc_connection():
    try:
        conn_str = 'DSN=Production-Planner-DSN;'
        connection = pyodbc.connect(conn_str, timeout=10)
        cursor = connection.cursor()
        cursor.execute("SELECT TOP 1 * FROM SalesOrderLine")
        row = cursor.fetchone()
        print(row)
        connection.close()
        return True
    except pyodbc.Error as e:
        sys.exit(1)

if __name__ == "__main__":
    check_qodbc_connection()
    sys.exit(0)