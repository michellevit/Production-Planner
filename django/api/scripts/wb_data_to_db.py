order_data = {
    "order_number"
    "ship_date"
    "customer_name"
    "item_type_dict"
    "item_subtype_dict"
    "quantity"
}

item_dict =  {
    "item_name"
    "quantity"
}

orders_array = []



# Save all the orders + data to the orders array (adding new items to item_dict)

# Check to see if the order has been added to the database already
## IF YES: check if the same items
#### IF YES: don't add order
#### IF NO: Check if the order was shipped
##### IF YES: create a new entry in db with backorder as backorder qty + 1
##### IF NO: Update the db items
## IF NO: add order as new entry into db


    # created = models.DateTimeField(auto_now_add=True)
    # updated = models.DateTimeField(auto_now=True)
    # order_number = models.CharField(max_length=100, default="none")
    # backorder = models.BooleanField(default=False)
    # backorder_number = models.IntegerField(default=0)
    # ship_date = models.DateField(null=True, blank=True)
    # confirmed = models.BooleanField(default=False)
    # delay_date = models.DateField(null=True, default=None)
    # delay_tbd = models.BooleanField(null=True, default=False)
    # customer_name = models.CharField(max_length=100)
    # item_dict = models.JSONField(default=dict)
    # item_dict_hash = models.CharField(max_length=32, db_index=True, blank=True, null=True)
    # packages_array = models.JSONField(default=list, null=True, blank=True)
    # notes_array = models.JSONField(default=list, null=True, blank=True)
    # quote = models.BooleanField(default=False)
    # ready = models.BooleanField(default=False)
    # shipped = models.BooleanField(default=False, db_index=True)