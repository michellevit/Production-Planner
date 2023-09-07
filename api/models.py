from django.db import models
from django.utils import timezone


# Create your models here.
class Order(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    order_number = models.CharField(max_length=100)
    backorder = models.BooleanField(default=False)
    backorder_number = models.CharField(max_length=10, default="0")
    ship_date = models.DateField()
    delay_date = models.DateField(null=True, blank=True)
    customer_name = models.CharField(max_length=100)
    item_type_dict = models.JSONField(default=dict)
    item_subtype_dict = models.JSONField(default=dict)
    packages_array = models.JSONField(default=list, null=True, blank=True)
    notes_array = models.JSONField(default=list, null=True, blank=True)
    ready = models.BooleanField(default=False)
    shipped = models.BooleanField(default=False)

    def __str__(self):
        return self.order_number[0:50]
