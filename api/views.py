from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from . serializers import *
from rest_framework.response import Response

# Create your views here.

class OrderView(APIView):
    def get(self, request):
        output = [{ "ID": output.id,
                    "created": output.created,
                    "updated": output.updated,
                    "order_number": output.order_number,
                    "customer_name": output.customer_name,
                    "backorder": output.backorder,
                    "backorder_number": output.backorder_number,
                    "ship_date": output.ship_date,
                    "item_type_dict": output.item_type_dict,
                    "item_subtype_dict": output.item_subtype_dict,
                    "packages": output.packages_dict,
                    "weight": output.weight,
                    "confirmed": output.confirmed,
                    "archived": output.archived,
                   }
                   for output in Order.objects.all()]
        return Response(output)
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
