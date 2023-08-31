from django.db import models


# Create your models here.
class Order(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    order_number = models.CharField(max_length=100)
    backorder = models.BooleanField(default=False)
    backorder_number = models.CharField(max_length=10, default="0")
    ship_date = models.DateField()
    delay = models.CharField(max_length=10, default="0")
    customer_name = models.CharField(max_length=100)
    item_type_dict = models.JSONField(default=dict)
    item_subtype_dict = models.JSONField(default=dict)
    packages_array = models.JSONField(default=list)
    notes_array = models.JSONField(default=list)
    ready = models.BooleanField(default=False)
    shipped = models.BooleanField(default=False)

    def __str__(self):
        return self.order_number[0:50]
