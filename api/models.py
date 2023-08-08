from django.db import models

# Create your models here.


class Note(models.Model):
    body = models.TextField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.id + " " + self.body


class Order(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    order_number = models.CharField(max_length=100)
    ship_date = models.DateField()
    customer_name = models.CharField(max_length=100)
    item_type_dict = models.JSONField(default=dict)
    item_subtype_dict = models.JSONField(default=dict)
    packages = models.JSONField(default=dict)
    weight = models.CharField(max_length=10)
    confirmed = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.order_number[0:50]
