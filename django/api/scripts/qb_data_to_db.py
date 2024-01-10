import json
import os

def main():
    script_dir = os.path.dirname(os.path.realpath(__file__))
    json_file_path = os.path.join(script_dir, '..', 'data', 'qb_order_data.json')
    
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)
    orders_dict = iterate_through_queried_orders(data)
    check_for_new_or_modified_orders(orders_dict)
    update_current_open_orders_json_file(orders_dict)



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



def check_for_new_or_modified_orders(orders_dict):
    script_dir = os.path.dirname(os.path.realpath(__file__))
    json_file_path = os.path.join(script_dir, '..', 'data', 'current_open_orders.json')
    with open(json_file_path, 'r') as current_orders_file:
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
    print(order_number)



def update_current_open_orders_json_file(orders_dict):
    print('HI')



if __name__ == "__main__":
    main()






# Iterate through the queried orders: 
# Save the data into orders_dict

# check_if_order_new_or_modified()
# -For each: is the order in the current_open_orders.json file?
# --YES: Is the time modified the same?
# ----YES: pass
# ----NO: check_if_order_in_database()
# --NO: check_if_order_in_database()

# check_if_order_number_in_database()
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
# ----Check if all have a backorder_qty
# ------YES: 
# --------Check if the most recent one has the same previously_invoiced_qty for all items
# ----------YES: PASS
# ----------NO: Create a new order with backorder# = qty of orders in db
# ------NO: PASS

# wipe_and_add_data_to_current_open_orders_json_file():
# -create a dictionary with orders array:
# --key:order_number, value: time_modified
# -add data to current_open_orders.json 






# order_data = {
#     "order_number"
#     "ship_date"
#     "customer_name"
#     "item_array"
# }

# item_dict =  {
#     "name"
#     "subname"
#     "description"
#     "requested_qty"
#     "ship_qty"
#     "backorder_qty" 
#     "previously_invoiced_qty"
# }

