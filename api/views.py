from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from . serializers import *
from rest_framework.response import Response

# Create your views here.

class OrderView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        output = [
            {
                "ID": order.id,
                "created": order.created,
                "updated": order.updated,
                "order_number": order.order_number,
                "customer_name": order.customer_name,
                "backorder": order.backorder,
                "backorder_number": order.backorder_number,
                "ship_date": order.ship_date,
                "item_type_dict": order.item_type_dict,
                "item_subtype_dict": order.item_subtype_dict,
                "packages": order.packages_dict,
                "weight": order.weight,
                "confirmed": order.confirmed,
                "archived": order.archived,
            }
            for order in orders
        ]
        return Response(output)
    
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)