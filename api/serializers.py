from rest_framework import serializers
from .models import *

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id',
            'created',
            'updated',
            'order_number',
            'backorder',
            'backorder_number',
            'ship_date',
            "delay_date",
            'customer_name',
            'item_type_dict',
            'item_subtype_dict',
            'packages_array',
            'notes_array',
            'ready',
            'shipped'
            ]
