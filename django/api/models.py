from django.db import models
from .utils import *


class Order(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    order_number = models.CharField(max_length=100, default="none")
    backorder = models.BooleanField(default=False)
    backorder_number = models.IntegerField(default=0)
    ship_date = models.DateField(null=True, blank=True)
    confirmed = models.BooleanField(default=False)
    delay_date = models.DateField(null=True, default=None)
    delay_tbd = models.BooleanField(null=True, default=False)
    customer_name = models.CharField(max_length=100)
    item_array = models.JSONField(default=list)
    item_array_hash = models.CharField(max_length=32, db_index=True, blank=True, null=True)
    packages_array = models.JSONField(default=list, null=True, blank=True)
    notes_array = models.JSONField(default=list, null=True, blank=True)
    quote = models.BooleanField(default=False)
    ready = models.BooleanField(default=False)
    shipped = models.BooleanField(default=False, db_index=True)
    def __str__(self):
        return self.order_number[0:50]
    def save(self, *args, **kwargs):
        if self.pk is None:
            sorted_item_array = sort_item(self.item_array)
            self.item_array_hash = hash_item_array(sorted_item_array)
        elif self.item_array != self._original_values['item_array']:
            sorted_item_array = sort_item(self.item_array)
            self.item_array_hash = hash_item_array(sorted_item_array)
        super(Order, self).save(*args, **kwargs)
    

class Dimension(models.Model):
    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    package_size = models.CharField(max_length=50)
    def __str__(self):
        return self.package_size[0:50]
    class Meta:
        verbose_name_plural = "Dimensions"
        unique_together = [['length', 'width', 'height', 'package_size']]
        ordering = ['length', 'width', 'height']


class Product(models.Model):
    item_name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.item_name 
    class Meta:
        verbose_name_plural = "Products"
        ordering = ['item_name']
        

