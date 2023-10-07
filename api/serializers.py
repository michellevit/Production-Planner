from rest_framework import serializers
from .models import *

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

class OrderReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderReport
        fields = "__all__"