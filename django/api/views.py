from datetime import timedelta
from django.db import transaction
from django.db.models import Q, Case, When, F, Value, IntegerField
from django.db.models.functions import Coalesce
from django.http import JsonResponse
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
from .utils import sort_dict
import json
import logging



logger = logging.getLogger('file')
# logger.error('EXAMPLE')
#print('hi') -> this will show up in Docker container backend 'Logs' section

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
            if 'item_type_dict_hash' in request.data:
                order.item_type_dict_hash = request.data['item_type_dict_hash']
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
    serializer_class = OrderSerializer
    pagination_class = CustomPagination
    def get_queryset(self):
        queryset = Order.objects.all()
        queryset = queryset.annotate(
            oldest_order=Case(
                When(ship_date__isnull=True, delay_date__isnull=True, delay_tbd=True, then=Value(1)),
                default=Value(0),
                output_field=IntegerField(),
            )
        )
        queryset = queryset.annotate(
            updated_ship_date=Coalesce(F('ship_date'), F('delay_date'))
        )
        queryset = queryset.order_by('oldest_order', 'updated_ship_date')
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(order_number__icontains=search_query) |
                Q(customer_name__icontains=search_query)
            )
        return queryset


#path('all-orders-create/', CreateOrderView.as_view(), name='create-order'),
class CreateOrderView(APIView):
    def post(self, request):
        order_data = request.data
        serializer = OrderSerializer(data=order_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    
    
#path('all-orders-filtered/', FilteredOrdersListView.as_view(), name='all-orders-filtered')
class FilteredOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    pagination_class = CustomPagination
    def get_queryset(self):
        current_datetime_utc = timezone.now()
        current_datetime_vancouver = current_datetime_utc.astimezone(timezone.get_current_timezone())
        today = current_datetime_vancouver.date()
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
        if filter_choice == 'this-week':
            is_today_sunday = (today.weekday() == 6)
            start_of_week = today - timedelta(days=today.weekday() + 1) if not is_today_sunday else today
            end_of_week = start_of_week + timedelta(days=6)
            queryset = queryset.filter(
                ship_date__gte=start_of_week,
                ship_date__lte=end_of_week + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'this-month':
            start_of_month = today.replace(day=1)
            if today.month == 12: 
                end_of_month = start_of_month.replace(year=today.year + 1, month=1) - timedelta(days=1)
            else:
                end_of_month = start_of_month.replace(month=today.month + 1) - timedelta(days=1)
            queryset = queryset.filter(
                ship_date__gte=start_of_month,
                ship_date__lte=end_of_month + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'next-week':
            days_until_next_sunday = 6 - today.weekday()
            start_of_next_week = today + timedelta(days=days_until_next_sunday)
            end_of_next_week = start_of_next_week + timedelta(days=6)
            queryset = queryset.filter(
                ship_date__gte=start_of_next_week,
                ship_date__lte=end_of_next_week + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'next-month':
            if today.month == 12:  
                start_of_next_month = today.replace(day=1, month=1, year=today.year + 1)
            else:
                start_of_next_month = today.replace(day=1, month=today.month + 1)
            if start_of_next_month.month == 12:  
                end_of_next_month = start_of_next_month.replace(year=start_of_next_month.year + 1, month=1) - timedelta(days=1)
            else:
                end_of_next_month = start_of_next_month.replace(month=start_of_next_month.month + 1) - timedelta(days=1)
            queryset = queryset.filter(
                ship_date__gte=start_of_next_month,
                ship_date__lte=end_of_next_month + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'last-week':
            days_since_last_saturday = today.weekday() + 2
            end_of_last_week = today - timedelta(days=days_since_last_saturday)
            start_of_last_week = end_of_last_week - timedelta(days=6)
            queryset = queryset.filter(
                ship_date__gte=start_of_last_week,
                ship_date__lte=end_of_last_week + timedelta(hours=23, minutes=59, seconds=59)
            )
        elif filter_choice == 'last-month':
            if today.month == 1:
                start_of_last_month = today.replace(day=1, month=12, year=today.year - 1)
            else:
                start_of_last_month = today.replace(day=1, month=today.month - 1)
            end_of_last_month = today.replace(day=1) - timedelta(days=1)
            queryset = queryset.filter(
                ship_date__gte=start_of_last_month,
                ship_date__lte=end_of_last_month + timedelta(hours=23, minutes=59, seconds=59)
            ) 
        queryset = queryset.order_by('-ship_date')
        if not self.request.query_params.get('ready_checked', False):
            queryset = queryset.filter(ready=False)
        if not self.request.query_params.get('not_ready_checked', False):
            queryset = queryset.filter(ready=True)
        if not self.request.query_params.get('shipped_checked', False):
            queryset = queryset.filter(shipped=False)
        if not self.request.query_params.get('not_shipped_checked', False):
            queryset = queryset.filter(shipped=True)
        if not self.request.query_params.get('delayed_checked', False):
            queryset = queryset.filter(Q(delay_date__isnull=True) & Q(delay_tbd=False))
        if self.request.query_params.get('oldest_checked', False):
            queryset = queryset.order_by('ship_date')
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
        

# path('fetch-matching-packages/', FetchMatchingPackagesView.as_view(), name='fetch-matching-packages')

class FetchMatchingPackagesView(APIView):
    def post(self, request):
        data = request.data
        item_type_dict = data.get('item_type_dict')
        if not item_type_dict:
            return JsonResponse({'success': False, 'message': 'item_type_dict not provided'})
        sorted_dict = sort_dict(item_type_dict)
        hash_value = hash_item_type_dict(sorted_dict)
        print("HELLO", hash_value)
        try:
            matching_order = Order.objects.filter(shipped=True, item_type_dict_hash=hash_value).first()
            if matching_order:
                return JsonResponse({'success': True, 'packages_array': matching_order.packages_array})
            else:
                return JsonResponse({'success': False, 'message': 'No matching order found'})
        except Exception as e:  
            return JsonResponse({'success': False, 'message': str(e)})