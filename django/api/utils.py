import hashlib


def sort_item(item_array):
    sorted_item = sorted(item_array, key=lambda x: x['name'])
    return sorted_item

def hash_item_array(item_array):
    item_strings = [f"{item['name']}:{item['ship_qty']}" for item in item_array]
    item_strings.sort()
    concatenated_items = ",".join(item_strings)
    item_hash = hashlib.md5(concatenated_items.encode()).hexdigest()
    return item_hash