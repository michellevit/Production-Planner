# qb_data_to_db.py

import django
import os

# Initialize Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Production_Planner.settings')
django.setup()

from api.models import Order

def main():
    print('hi')
    return
    script_dir = os.path.dirname(os.path.realpath(__file__))
    qb_data_json_file_path = os.path.join(script_dir, '..', 'data', 'qb_order_data.json')
    current_open_orders_json_file_path = os.path.join(script_dir, '..', 'data', 'current_open_orders.json')
    with open(qb_data_json_file_path, 'r') as json_file:
        data = json.load(json_file)
    orders_dict = iterate_through_queried_orders(data)
    check_for_new_or_modified_orders(current_open_orders_json_file_path, orders_dict)
    update_current_open_orders_json_file(current_open_orders_json_file_path, orders_dict)



def iterate_through_queried_orders(data):
    orders_dict = {}

    for order_json in data:
        order_number = order_json["order_number"]
        time_modified = order_json["time_modified"]
        ship_date = order_json["ship_date"]
        customer_name = order_json["customer_name"]
        item_name = order_json["item"]
        if ":" in item_name:
            item_name, item_subname = item_name.split(":", 1)
        else:
            item_subname = item_name
        item_description = order_json["description"]
        item_requested_qty = int(order_json["requested_qty"])
        item_ship_qty = int(order_json["ship_qty"])
        item_backorder_qty = int(order_json["backorder_qty"]) if order_json["backorder_qty"] != "None" else 0
        item_invoiced_qty = int(order_json["invoiced_qty"])
        if order_number in orders_dict:
            existing_order = orders_dict[order_number]
            if existing_order["time_modified"] != time_modified:
                existing_order["time_modified"] = time_modified
            existing_order["item_array"].append({
                "name": item_name,
                "subname": item_subname,
                "description": item_description,
                "requested_qty": item_requested_qty,
                "ship_qty": item_ship_qty,
                "backorder_qty": item_backorder_qty,
                "previously_invoiced_qty": item_invoiced_qty
            })
        else:
            orders_dict[order_number] = {
                "order_number": order_number,
                "time_modified": time_modified,
                "ship_date": ship_date,
                "customer_name": customer_name,
                "item_array": [{
                    "name": item_name,
                    "subname": item_subname,
                    "description": item_description,
                    "requested_qty": item_requested_qty,
                    "ship_qty": item_ship_qty,
                    "backorder_qty": item_backorder_qty,
                    "previously_invoiced_qty": item_invoiced_qty
                }]
            }
    return orders_dict



def check_for_new_or_modified_orders(current_open_orders_json_file_path, orders_dict):
    with open(current_open_orders_json_file_path, 'r') as current_orders_file:
        current_open_orders = json.load(current_orders_file)
    
    for order_number, order_data in orders_dict.items():
        order_exists = any(json_order['order_number'] == order_number for json_order in current_open_orders)
        if order_exists:
            existing_order = next(json_order for json_order in current_open_orders if json_order['order_number'] == order_number)
            # If the order has NOT been modified since the last check...
            if existing_order['time_modified'] == order_data['time_modified']:
                continue
            # If the order HAS been modified since the last check...
            else:
                check_if_order_in_database(order_number, orders_dict)
        # If the order_number is not in the file...
        else:
            check_if_order_in_database(order_number, orders_dict)



def check_if_order_in_database(order_number, orders_dict):
    existing_orders = Order.objects.filter(order_number=order_number)
    count = existing_orders.count()
    if count == 0:
        print(f"Order {order_number} does not exist in the database.")
    else:
        print(f"Order {order_number} exists in the database {count} times.")
        print("Data for existing orders:")
        for order in existing_orders:
            print(f"Order ID: {order.id}")
            print(f"Order Number: {order.order_number}")
            print(f"Backorder: {order.backorder}")
            print(f"Ship Date: {order.ship_date}")
            print(f"Customer Name: {order.customer_name}")
            # Print other fields as needed

            # Example of printing item_type_dict
            print("Item Type Dict:")
            for key, value in order.item_type_dict.items():
                print(f"{key}: {value}")

            # Example of printing item_subtype_dict
            print("Item Subtype Dict:")
            for key, value in order.item_subtype_dict.items():
                print(f"{key}: {value}")
            print("-------------------")



def update_current_open_orders_json_file(current_open_orders_json_file_path, orders_dict):
    updated_orders = []
    for order_number, order_data in orders_dict.items():
        updated_order = {
            "order_number": order_number,
            "time_modified": order_data["time_modified"]
        }
        updated_orders.append(updated_order)
    with open(current_open_orders_json_file_path, 'w') as current_orders_file:
        json.dump(updated_orders, current_orders_file, indent=4)



if __name__ == "__main__":
    main()