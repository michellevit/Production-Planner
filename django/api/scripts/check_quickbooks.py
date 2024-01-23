import pyodbc
import json
import sys
import os

def main():
    current_dir = os.path.dirname(os.path.realpath(__file__))
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
                "name": row.SalesOrderLineItemRefFullName,
                "description": row.SalesOrderLineDesc,
                "requested_qty": int(row.SalesOrderLineQuantity) if row.SalesOrderLineQuantity is not None else 0,
                "ship_qty": int(row.CustomFieldSalesOrderLineOther1) if row.CustomFieldSalesOrderLineOther1 is not None else 0,
                "backorder_qty": int(row.CustomFieldSalesOrderLineOther2) if row.CustomFieldSalesOrderLineOther2 is not None else 0,
                "previously_invoiced_qty": int(row.SalesOrderLineInvoiced) if row.SalesOrderLineInvoiced is not None else 0
                }
            orders.append(order)
        cursor.close()
        connection.close()
        output_file = os.path.join(current_dir, '..', 'data', 'qb_order_data.json')     
        with open(output_file, 'w') as file:
            json.dump(orders, file, indent=4)
    except pyodbc.Error as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

