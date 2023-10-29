import hashlib
import json

def sort_dict(d):
    return {k: d[k] for k in sorted(d)}

def hash_item_type_dict(input_dict):
    input_string = json.dumps(input_dict)
    return hashlib.md5(input_string.encode()).hexdigest()