from rest_framework.views import APIView
from . models import *
from . serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound


class OrderListView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        output = [
            {
                "id": order.id,
                "created": order.created,
                "updated": order.updated,
                "order_number": order.order_number,
                "customer_name": order.customer_name,
                "backorder": order.backorder,
                "backorder_number": order.backorder_number,
                "ship_date": order.ship_date,
                "delay_date": order.delay_date,
                "item_type_dict": order.item_type_dict,
                "item_subtype_dict": order.item_subtype_dict,
                "packages_array": order.packages_array,
                "notes_array": order.notes_array,
                "ready": order.ready,
                "shipped": order.shipped,
            }
            for order in orders
        ]
        return Response(output)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        


class OrderDetailView(APIView):
    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            raise NotFound(detail="Order not found")
    def put(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            order.ready = not order.ready
            if 'delay_date' in request.data and request.data['delay_date'] is not None:
                order.delay_date = request.data['delay_date']
            if 'packages_array' in request.data:
                order.packages_array = request.data['packages_array']
            if 'notes_array' in request.data:
                order.notes_array = request.data['notes_array']
            order.save()
            return Response({"message": "Ready status updated successfully."})
        except Order.DoesNotExist:
            raise NotFound(detail="Order not found")
    def delete(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            order.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Order.DoesNotExist:
            raise NotFound(detail="Order not found")