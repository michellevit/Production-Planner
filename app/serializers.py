# Take model (i.e. table) with python-related code and translate it into a JSON response
# take keys and turn it into strings


from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Order
        fields = ('id', 'date', 'order_number', 'customer', 'items', 'weight_and_dimensions', 'confirmed_ready_date', 'picked_up')
