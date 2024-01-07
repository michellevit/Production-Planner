import pyodbc
import json
from datetime import datetime

def main():
    conn_str = 'DSN=Production-Planner-DSN;'
    connection = pyodbc.connect(conn_str, autocommit=True)

    query = """
    SELECT RefNumber, ShipDate, CustomerRefFullName, SalesOrderLineItemRefFullName, SalesOrderLineDesc, SalesOrderLineQuantity 
    FROM SalesOrderLine
    WHERE IsFullyInvoiced = 0 AND IsManuallyClosed = 0
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
    with open(output_file_path, 'w') as file:
        json.dump(orders, file, indent=4)

if __name__ == "__main__":
    main()
