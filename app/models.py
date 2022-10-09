from django.db import models


# Instructions
## When you make a change to the model you must run 2 commands:
### 1. python manage.py makemigrations
### 2. python manage.py migrate




# Create your models here.

class Order(models.Model):
    date = models.DateField(max_length=100)
    order_number = models.CharField(max_length=10)
    customer = models.CharField(max_length=100)
    items = models.CharField(max_length=255)
    weight_and_dimensions = models.TextField(max_length=255, default="")
    confirmed_ready_date = models.DateField(max_length=100, default="")
    picked_up = models.BooleanField(null=False, default=False)

