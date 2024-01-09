import pyodbc
import json
import ctypes

def main():
    try:
        conn_str = 'DSN=Production-Planner-DSN;'
        connection = pyodbc.connect(conn_str, autocommit=True)

        query = """
        SELECT RefNumber, ShipDate, CustomerRefFullName, SalesOrderLineItemRefFullName, SalesOrderLineDesc, SalesOrderLineQuantity 
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
                "ship_date": row.ShipDate.strftime("%Y-%m-%d") if row.ShipDate else None,
                "customer_name": row.CustomerRefFullName,
                "item": row.SalesOrderLineItemRefFullName,
                "description": row.SalesOrderLineDesc,
                "quantity": str(row.SalesOrderLineQuantity)
            }
            orders.append(order)

        cursor.close()
        connection.close()

        output_file_path = 'django/api/data/qb_order_data.json'
        
        # Open the file in 'write' mode and truncate it to delete existing contents
        with open(output_file_path, 'w') as file:
            json.dump(orders, file, indent=4)
    except pyodbc.Error as e:
        error_message = (
            f"Error details: {str(e)}\n\n"
            "Note: Please make sure QuickBooks is open and you are logged in before running this script."

        )
        ctypes.windll.user32.MessageBoxW(0, error_message, "Error", 0x10)  # Show a message box with an error message

if __name__ == "__main__":
    main()
