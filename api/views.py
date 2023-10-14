from datetime import timedelta
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from .models import * 
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser
from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .scripts.check_order_report import process_uploaded_report
from .serializers import *
import logging


logger = logging.getLogger(__name__)
# logger.error('EXAMPLE')

class CustomPagination(PageNumberPagination):
    page_size = 20




#path('open-orders/', OpenOrdersListView.as_view(), name='open-orders')
class OpenOrdersListView(APIView):
    def get(self, request):
        open_orders = Order.objects.all().filter(shipped=False)
        serializer = OrderSerializer(open_orders, many=True)
        return Response(serializer.data)


#path('open-orders/<int:pk>/', OrderDetailView.as_view(), name='open-order-detail')
#path('all-orders/<int:pk>/', OrderDetailView.as_view(), name='all-order-detail')
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
            if 'delay_tbd' in request.data:
                order.delay_tbd = request.data['delay_tbd'] 
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


#path('open-orders-search/', SearchOpenOrdersListView.as_view(), name='open-orders-search')
class SearchOpenOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    pagination_class = None
    def get_queryset(self):
        queryset = Order.objects.filter(shipped=False)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(order_number__icontains=search_query) |
                Q(customer_name__icontains=search_query)
            )
        return queryset


#path('all-orders/', OrderListView.as_view(), name='all-orders')
class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    pagination_class = CustomPagination


#path('all-orders-search/', SearchAllOrdersListView.as_view(), name='all-orders-search')
class SearchAllOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Order.objects.all()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(order_number__icontains=search_query) |
                Q(customer_name__icontains=search_query)
            )
        return queryset
    
    
#path('filtered-orders/', FilteredOrdersListView.as_view(), name='filtered-orders')
class FilteredOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    pagination_class = CustomPagination
    def get_queryset(self):
        today = timezone.now().date()
        filter_choice = self.request.query_params.get('filter', 'all')
        queryset = Order.objects.all()
        if filter_choice == 'upcoming':
            queryset = queryset.filter(ship_date__gte=today)
        elif filter_choice == 'past':
            queryset = queryset.filter(ship_date__lt=today)
        elif filter_choice == 'today':
            queryset = queryset.filter(ship_date=today)
        elif filter_choice == 'tomorrow':
            tomorrow = today + timedelta(days=1)
            queryset = queryset.filter(ship_date=tomorrow)
        elif filter_choice == 'this-week':
            end_of_week = today + timedelta(days=(6 - today.weekday()))
            start_of_week = end_of_week - timedelta(days=6)
            queryset = queryset.filter(
                ship_date__gte=start_of_week,
                ship_date__lte=end_of_week + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'next-week':
            days_until_next_week = 7 - today.weekday()
            start_of_next_week = today + timedelta(days=days_until_next_week)
            end_of_next_week = start_of_next_week + timedelta(days=6)
            queryset = queryset.filter(
                ship_date__gte=start_of_next_week,
                ship_date__lte=end_of_next_week + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'this-month':
            end_of_month = today.replace(day=1, month=today.month + 1) - timedelta(days=1)
            queryset = queryset.filter(
                ship_date__gte=today,
                ship_date__lte=end_of_month + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'next-month':
            start_of_next_month = today.replace(day=1, month=today.month + 1)
            end_of_next_month = start_of_next_month.replace(
                day=(start_of_next_month.replace(day=1, month=start_of_next_month.month + 1) - timedelta(days=1)).day,
            )
            queryset = queryset.filter(
                ship_date__gte=start_of_next_month,
                ship_date__lte=end_of_next_month + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'last-week':
            end_of_last_week = today - timedelta(days=(today.weekday() + 1))
            start_of_last_week = end_of_last_week - timedelta(days=6)
            queryset = queryset.filter(
                ship_date__gte=start_of_last_week,
                ship_date__lte=end_of_last_week + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'last-month':
            start_of_last_month = today.replace(day=1, month=today.month - 1)
            end_of_last_month = today.replace(day=1) - timedelta(days=1)
            queryset = queryset.filter(
                ship_date__gte=start_of_last_month,
                ship_date__lte=end_of_last_month + timedelta(hours=23, minutes=59, seconds=59)
            )
        queryset = queryset.order_by('-ship_date')
        return queryset



 
#path('reports/', OrderReportUploadView.as_view(), name="reports")
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


#path('dimensions/', DimensionView.as_view(), name="dimensions")
#path('dimensions/<int:pk>/', DimensionView.as_view()),]
class DimensionView(APIView):
    def get(self, request):
        dimensions = Dimension.objects.all().order_by('length', 'width', 'height')
        serializer = DimensionSerializer(dimensions, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = DimensionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        try:
            dimension = Dimension.objects.get(pk=pk)
            dimension.delete() 
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Dimension.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)