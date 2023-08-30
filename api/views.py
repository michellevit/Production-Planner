from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from . serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

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
                "notes": order.notes,
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
           

class DeleteOrderView(APIView):
    def delete(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            order.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Order.DoesNotExist:
            raise NotFound(detail="Order not found")