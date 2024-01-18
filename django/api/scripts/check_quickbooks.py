import pyodbc
import json
import ctypes
import sys
import os

def main():
    try:
        conn_str = 'DSN=Production-Planner-DSN;'
        connection = pyodbc.connect(conn_str, autocommit=True)
        query = """
        SELECT RefNumber, TimeModified, ShipDate, CustomerRefFullName, SalesOrderLineItemRefFullName, SalesOrderLineDesc, SalesOrderLineQuantity, SalesOrderLineInvoiced, CustomFieldSalesOrderLineOther1, CustomFieldSalesOrderLineOther2 
        FROM SalesOrderLine
        WHERE IsFullyInvoiced = 0 AND IsManuallyClosed = 0 AND SalesOrderLineItemRefFullName IS NOT NULL AND SalesOrderLineItemRefFullName <> 'Shipping'
        ORDER BY RefNumber ASC
        """
        cursor = connection.cursor()
        cursor.execute(query)
        orders = []
        for row in cursor:
            order = {
                "order_number": row.RefNumber,
                "time_modified": row.TimeModified.strftime("%Y-%m-%d %H:%M:%S"),  
                "ship_date": row.ShipDate.strftime("%Y-%m-%d") if row.ShipDate else None,
                "customer_name": row.CustomerRefFullName,
                "item": row.SalesOrderLineItemRefFullName,
                "description": row.SalesOrderLineDesc,
                "requested_qty": int(row.SalesOrderLineQuantity) if row.SalesOrderLineQuantity is not None else 0,
                "ship_qty": int(row.CustomFieldSalesOrderLineOther1) if row.CustomFieldSalesOrderLineOther1 is not None else 0,
                "backorder_qty": int(row.CustomFieldSalesOrderLineOther2) if row.CustomFieldSalesOrderLineOther2 is not None else 0,
                "previously_invoiced_qty": int(row.SalesOrderLineInvoiced) if row.SalesOrderLineInvoiced is not None else 0
                }
            orders.append(order)
        cursor.close()
        connection.close()
        current_dir = os.path.dirname(os.path.realpath(__file__))
        output_file = os.path.join(current_dir, '..', 'data', 'qb_order_data.json')     
        with open(output_file, 'w') as file:
            json.dump(orders, file, indent=4)
        error_log = os.path.join(current_dir, '..', '..', '..', 'scripts', 'error_scripts', 'error-log-file.txt')
        with open(error_log, 'a') as f:
            log_msg = "check_quickbooks.py = SUCCESS"
            print(log_msg, file=f)
    except pyodbc.Error as e:
        error_message = (
            f"Error details: {str(e)}\n\ncheck_quickbooks = failed"
            "Note: Please make sure QuickBooks is open and you are logged in before running this script."
        )
        with open('error-log.txt', 'a') as f:
            print(error_message, file=f)
        ctypes.windll.user32.MessageBoxW(0, error_message, "Error", 0x10) 
        sys.exit(1)

if __name__ == "__main__":
    main()
    sys.exit(0)
