# qb_data_to_db.py

import django
import json
import os
from django.utils import timezone
from api.utils import *
import pytz

# Initialize Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Production_Planner.settings')
django.setup()

from api.models import Order, LastUpdate

def main():
    orders_updated_flag = False
    script_dir = os.path.dirname(os.path.realpath(__file__))
    qb_data_json_file_path = os.path.join(script_dir, '..', 'data', 'qb_order_data.json')
    current_open_orders_json_file_path = os.path.join(script_dir, '..', 'data', 'current_open_orders.json')
    with open(qb_data_json_file_path, 'r') as json_file:
        try:
            data = json.load(json_file)
            orders_dict = iterate_through_queried_orders(data)
        except json.JSONDecodeError: 
            pass
    if orders_dict:
        orders_updated_flag = check_for_new_or_modified_orders(current_open_orders_json_file_path, orders_dict, orders_updated_flag)
        update_current_open_orders_json_file(current_open_orders_json_file_path, orders_dict)
    if orders_updated_flag:
        update_last_update_timestamp()


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
        item_previously_invoiced_qty = int(order_json["previously_invoiced_qty"])
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
                "previously_invoiced_qty": item_previously_invoiced_qty
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
                    "previously_invoiced_qty": item_previously_invoiced_qty
                }]
            }
    return orders_dict



def check_for_new_or_modified_orders(current_open_orders_json_file_path, orders_dict, orders_updated_flag):
    if os.path.getsize(current_open_orders_json_file_path) == 0:
        if not Order.objects.exists():
            for order_number, order_data in orders_dict.items():
                new_order = Order(
                    order_number=order_data["order_number"],
                    ship_date=order_data["ship_date"],
                    customer_name=order_data["customer_name"],
                    item_array=order_data["item_array"]
                )
                new_order.save()
                orders_updated_flag = True
        else:
            return
    else:
       with open(current_open_orders_json_file_path, 'r') as current_orders_file:
            try:
                current_open_orders = json.load(current_orders_file)
            except json.JSONDecodeError:
                print("Error: JSON file is not in the correct format.")
                return
            for order_number, order_data in orders_dict.items():
                order_exists = any(json_order['order_number'] == order_number for json_order in current_open_orders)
                if order_exists:
                    existing_order = next(json_order for json_order in current_open_orders if json_order['order_number'] == order_number)
                    # If the order has NOT been modified since the last check...
                    if existing_order['time_modified'] == order_data['time_modified']:
                        continue
                    # If the order HAS been modified since the last check...
                    else:
                        orders_updated_flag = check_if_order_in_database(order_number, orders_dict, orders_updated_flag)
                # If the order_number is not in the file...
                else:
                    orders_updated_flag = check_if_order_in_database(order_number, orders_dict, orders_updated_flag)
    return orders_updated_flag


def check_if_order_in_database(order_number, orders_dict, orders_updated_flag):
    existing_orders = Order.objects.filter(order_number=order_number)
    count = existing_orders.count()
    order_data = orders_dict[order_number]
    order_number = order_data["order_number"]
    ship_date = order_data["ship_date"]
    customer_name = order_data["customer_name"]
    item_array = sort_item(order_data["item_array"])
    item_array_hash = hash_item_array(item_array)
    total_previously_invoiced_qb = sum(item["previously_invoiced_qty"] for item in order_data["item_array"])
    # If the order is NOT in the database table 'Order'
    if count == 0:
        new_order = Order(
            order_number=order_number,
            ship_date=ship_date,
            customer_name=customer_name,
            item_array=item_array,
        ) 
        new_order.save()
        orders_updated_flag = True
    # If the order IS in the database table 'Order'
    else:
        if count == 1:
            db_order = existing_orders[0]
            if db_order.shipped == False:
                if total_previously_invoiced_qb == 0: 
                    if db_order.ship_date != ship_date or db_order.item_array_hash != item_array_hash:
                        db_order.ship_date = ship_date
                        db_order.item_array = item_array
                        db_order.confirmed = False
                        db_order.save()
                        orders_updated_flag = True
            elif db_order.shipped == True:
                if total_previously_invoiced_qb > 0:
                    new_order = Order(
                    order_number=order_number,
                    ship_date=ship_date,
                    customer_name=customer_name,
                    item_array=item_array,
                    ) 
                    new_order.save()
                    orders_updated_flag = True
        elif count > 0:
            any_unshipped_orders = any(db_order.shipped is False for db_order in existing_orders)
            # check if there are any non-shipped orders with the same order_number in existing_orders
            if any_unshipped_orders:
                for db_order in existing_orders: 
                    if not db_order.shipped:
                        total_previously_invoiced_db = sum(item["previously_invoiced_qty"] for item in db_order.item_array)
                        if total_previously_invoiced_qb >= total_previously_invoiced_db:
                            if db_order.ship_date != ship_date or db_order.item_array_hash != item_array_hash:
                                db_order.ship_date = ship_date
                                db_order.item_array = item_array
                                db_order.confirmed = False
                                db_order.save()
                                orders_updated_flag = True
            # else - if all the orders in existing_orders have been shipped
            else: 
                total_previously_invoiced_quantities = {}
                for order in existing_orders: 
                    total_previously_invoiced_qty = sum(item["previously_invoiced_qty"] for item in order.item_array)
                    total_previously_invoiced_quantities[order.order_number] = total_previously_invoiced_qty
                highest_previously_invoiced_order_number = max(total_previously_invoiced_quantities, key=total_previously_invoiced_quantities.get)
                highest_previously_invoiced_order = existing_orders.filter(order_number=highest_previously_invoiced_order_number).first()
                highest_previously_invoiced_order_total_backorder_quantity = sum(item["backorder_qty"] for item in highest_previously_invoiced_order.item_array)
                if highest_previously_invoiced_order_total_backorder_quantity > 0:
                    total_previously_invoiced_highest_order = sum(item["previously_invoiced_qty"] for item in highest_previously_invoiced_order.item_array)
                    if total_previously_invoiced_highest_order < total_previously_invoiced_db:
                        current_backorder_number = highest_previously_invoiced_order.backorder_number
                        new_order = Order(
                        order_number=order_number,
                        backorder_number=current_backorder_number,
                        ship_date=ship_date,
                        customer_name=customer_name,
                        item_array=item_array,
                        ) 
                        new_order.save()
                        orders_updated_flag = True
    return orders_updated_flag
    







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



def update_last_update_timestamp():
    vancouver_tz = pytz.timezone('America/Vancouver')
    last_update, created = LastUpdate.objects.get_or_create(id=1)
    last_update.last_updated = timezone.now().astimezone(vancouver_tz)
    last_update.save()



if __name__ == "__main__":
    main()




# LOGIC OVERVIEW: 
    
    
# Iterate through the queried orders: 
# Save the data into orders_dict

# check_if_order_new_or_modified()
# -For each: is the order in the current_open_orders.json file?
# --YES: Is the time modified the same?
# ----YES: pass
# ----NO: check_if_order_in_database()
# --NO: check_if_order_in_database()

# check_if_order_in_database()
# --make a list of the instances that the order_number is already in the database + iterate
# --IF NONE: create a new order
# --ELSE IF: there is only 1 matching order_number in the db with the same number and shipped=false
# ----> check if the new order has any items with a previously_invoiced_qty > 0
# ------> IF YES: PASS
# ------> IF NO: update the ship_date + item_array if they are different (+ if different then mark confirmed=false)
# --ELSE IF: there is only 1 matching order_number in the db with the same number and shipped=true
# ----> are there any items in the new order query with previously_invoiced_qty > 0?
# ------> IF YES: Create new order w/ backorder# 1 
# ------> IF NO: PASS 
# # --ELSE IF: there are multiple orders in the db but one order is shipped=false
# ----Check if the existing order total items' previously_invoiced_qty amount is less than the new order's total items' previously_invoiced_qty
# ------YES: PASS
# ------NO: update the ship_date + item_array if they are different (+ if different then mark confirmed=false)
# --ELSE IF: there are multiple orders in the db but all are shipped=true
# ----Find the most recent order (will have the highest iterm_array total invoiced_quantity)
# ------check if the most recent one has a backorder qty
# --------Check if the most recent one has the same previously_invoiced_qty for all items as the current qb order
# ----------YES: PASS
# ----------NO: Create a new order with backorder# = qty of orders in db
# ------NO: PASS