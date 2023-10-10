from .models import * 
from .serializers import OrderSerializer, OrderReportSerializer, DimensionSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser
from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .scripts.check_order_report import process_uploaded_report
import logging
from django.db import transaction
from django.core.files.storage import default_storage
import os
from django.conf import settings
from .models import Dimension
from django.db.models import Max


logger = logging.getLogger(__name__)
# logger.error('EXAMPLE')

class OrderListView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

class OpenOrdersListView(APIView):
    def get(self, request):
        open_orders = Order.objects.all().filter(shipped=False)
        serializer = OrderSerializer(open_orders, many=True)
        return Response(serializer.data)
    
class SearchOpenOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.filter(shipped=False)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(order_number__icontains=search_query) |
                Q(customer_name__icontains=search_query)
            )
        return queryset
    
class SearchAllOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = Order.objects
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(order_number__icontains=search_query) |
                Q(customer_name__icontains=search_query)
            )
        return queryset
   

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
            if 'ship_date' in request.data:
                order.ship_date = request.data['ship_date']    
            if 'delay_date' in request.data:
                order.delay_date = request.data['delay_date']
            if 'packages_array' in request.data:
                order.packages_array = request.data['packages_array']
            if 'notes_array' in request.data:
                order.notes_array = request.data['notes_array']
            if 'minimized_status' in request.data:
                order.minimized_status = request.data['minimized_status']
            if 'ready' in request.data:
                order.ready = request.data['ready']
            if 'shipped' in request.data:
                order.shipped = request.data['shipped']
            if 'quote' in request.data:
                order.quote = request.data['quote']
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
        
 
    
class OrderReportUploadView(APIView):
    parser_class = (FileUploadParser,)
    def get(self, request, *args, **kwargs):
        last_5_entries = OrderReport.objects.order_by('-submitted_date')[:5]
        serializer = OrderReportSerializer(last_5_entries, many=True)
        return Response(serializer.data)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get("file")        
        if uploaded_file:
            file_name = uploaded_file.name
            process_uploaded_report(uploaded_file)      
            order_report = OrderReport(file_name=file_name)
            order_report.save()      
            return Response({"message": "File processed successfully."}, status=status.HTTP_201_CREATED)
        else:
            logger.error("No file uploaded.")
            return Response({"message": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        

class DimensionView(APIView):
    def get(self, request):
        dimensions = Dimension.objects.all().order_by('index_position')
        serializer = DimensionSerializer(dimensions, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = DimensionSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            max_index_position = Dimension.objects.aggregate(Max('index_position'))['index_position__max'] or 0
            serializer.save(index_position=max_index_position + 1)  # Set the index_position
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    def delete(self, request, pk):
        try:
            dimension = Dimension.objects.get(pk=pk)
            dimension.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Dimension.DoesNotExist:
            raise NotFound(detail="Dimension not found")
        

class DimensionDetailView(APIView):
    def get(self, request, pk):
        dimension = Dimension.objects.get(pk=pk)
        serializer = DimensionSerializer(dimension)
        return Response(serializer.data)
