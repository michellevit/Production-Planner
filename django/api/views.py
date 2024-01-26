from datetime import timedelta
from django.db.models import Q, Case, When, F, Value, IntegerField, DateField
from django.db.models.functions import Coalesce
from django.http import JsonResponse, StreamingHttpResponse, HttpResponse
from django.utils import timezone
from .models import * 
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination
from rest_framework.response import Response
from .serializers import *
from .utils import *
import json
import logging
import time


logger = logging.getLogger('file')
# logger.error('EXAMPLE')
# print('hi') -> this will show up in Docker container backend 'Logs' section

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
            if 'confirmed' in request.data:
                order.confirmed = request.data['confirmed']   
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
            if 'item_dict_hash' in request.data:
                order.item_type_dict_hash = request.data['item_dict_hash']
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


    
#path('orders-filtered/', FilteredOrdersListView.as_view(), name='orders-filtered')
class FilteredOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    pagination_class = CustomPagination
    def get_queryset(self):
        current_datetime_utc = timezone.now()
        current_datetime_vancouver = current_datetime_utc.astimezone(timezone.get_current_timezone())
        today = current_datetime_vancouver.date()
        filter_choice = self.request.query_params.get('filter', 'all')
        search_query = self.request.query_params.get('search', None)
        order_type = self.request.query_params.get('type', 'all')
        queryset = Order.objects.all()
        if order_type == 'open':
            queryset = queryset.filter(shipped=False)
        # DROPDOWN FILTERS
        if filter_choice == 'all':
            pass
        elif filter_choice == 'upcoming':
            queryset = queryset.filter(ship_date__gte=today)
        elif filter_choice == 'past':
            queryset = queryset.filter(ship_date__lt=today)
        elif filter_choice == 'today':
            queryset = queryset.filter(ship_date=today)
        elif filter_choice == 'tomorrow':
            tomorrow = today + timedelta(days=1)
            queryset = queryset.filter(ship_date=tomorrow)
        elif filter_choice == 'this-week':
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
        # CHECKBOX FILTERS
        confirmed_checked = self.request.query_params.get('confirmed_checked', 'false') == 'true'
        not_confirmed_checked = self.request.query_params.get('not_confirmed_checked', 'false') == 'true'
        ready_checked = self.request.query_params.get('ready_checked', 'false') == 'true'
        not_ready_checked = self.request.query_params.get('not_ready_checked', 'false') == 'true'
        shipped_checked = self.request.query_params.get('shipped_checked', 'false') == 'true'
        not_shipped_checked = self.request.query_params.get('not_shipped_checked', 'false') == 'true'
        delayed_checked = self.request.query_params.get('delayed_checked', 'false') == 'true'
        not_delayed_checked = self.request.query_params.get('not_delayed_checked', 'false') == 'true'
        quote_checked = self.request.query_params.get('quote_checked', 'false') == 'true'
        not_quote_checked = self.request.query_params.get('not_quote_checked', 'false') == 'true'
        if not any([confirmed_checked, not_confirmed_checked, ready_checked, not_ready_checked, shipped_checked, not_shipped_checked, delayed_checked, not_delayed_checked, quote_checked, not_quote_checked]):
            queryset = Order.objects.none()
        elif delayed_checked and not any([confirmed_checked, not_confirmed_checked, ready_checked, not_ready_checked, shipped_checked, not_shipped_checked, not_delayed_checked, quote_checked, not_quote_checked]):
             queryset = queryset.filter(Q(delay_date__isnull=False) | Q(delay_tbd=True))
        elif quote_checked and not any([confirmed_checked, not_confirmed_checked, ready_checked, not_ready_checked, shipped_checked, not_shipped_checked, delayed_checked, not_delayed_checked, not_quote_checked]):
             queryset = queryset.filter(quote=True)
        else:
            if confirmed_checked and not_confirmed_checked:
                pass
            elif confirmed_checked:
                queryset = queryset.filter(confirmed=True)
            elif not_confirmed_checked:
                queryset = queryset.filter(confirmed=False)
            if ready_checked and not_ready_checked:
                pass
            elif ready_checked:
                queryset = queryset.filter(ready=True)
            elif not_ready_checked:
                queryset = queryset.filter(ready=False)
            if shipped_checked and not_shipped_checked:
                pass
            elif shipped_checked:
                queryset = queryset.filter(shipped=True)
            elif not_shipped_checked:
                queryset = queryset.filter(shipped=False)
            if delayed_checked and not_delayed_checked:
                pass
            elif delayed_checked:
                queryset = queryset.filter(Q(delay_date__isnull=False) | Q(delay_tbd=True))
            elif not_delayed_checked:
                queryset = queryset.filter(Q(delay_date__isnull=True) and Q(delay_tbd=False))
            if quote_checked and not_quote_checked:
                pass
            elif quote_checked: 
                queryset = queryset.filter(quote=True)
            elif not_quote_checked:
                queryset = queryset.filter(quote=False)
        # Add a custom field for sorting
        queryset = queryset.annotate(
            custom_sort=Case(
                When(ship_date__isnull=False, delay_date__isnull=True, delay_tbd=False, then='ship_date'),
                When(ship_date__isnull=False, delay_date__isnull=False, delay_tbd=False, then='delay_date'),
                When(ship_date__isnull=True, delay_date__isnull=False, delay_tbd=False, then='delay_date'),
                When(ship_date__isnull=False, delay_date__isnull=True, delay_tbd=True, then=Value(today)),
                When(ship_date__isnull=True, delay_date__isnull=True, delay_tbd=True, then=Value(today)),
                default=Value(today + timedelta(days=36500)),
                output_field=DateField(),
            )
        )
        # Determine the ordering direction
        if self.request.query_params.get('oldest_checked', 'false') == 'true':
            queryset = queryset.order_by('custom_sort')
        else:
            queryset = queryset.order_by('-custom_sort')

        
        if search_query:
            queryset = queryset.filter(
                Q(order_number__icontains=search_query) |
                Q(customer_name__icontains=search_query)
            )
        return queryset
    def paginate_queryset(self, queryset):
        order_type = self.request.query_params.get('type', 'all')
        if order_type == 'open':
            return None
        else:
            return super().paginate_queryset(queryset)
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        paginated_queryset = self.paginate_queryset(queryset)
        if paginated_queryset is not None:
            serializer = self.get_serializer(paginated_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



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
        print("DATA: ", data)
        item_array = data.get('item_array')
        if not item_array:
            return JsonResponse({'success': False, 'message': 'item_array not provided'})
        sorted_item = sort_item(item_array)
        hash_value = hash_item_array(sorted_item)
        try:
            matching_order = Order.objects.filter(shipped=True, item_array_hash=hash_value).first()
            if matching_order:
                return JsonResponse({'success': True, 'packages_array': matching_order.packages_array})
            else:
                return JsonResponse({'success': False, 'message': 'No matching order found'})
        except Exception as e:  
            return JsonResponse({'success': False, 'message': str(e)})
        

# path('products/', views.get_products, name='get_products')
class ProductView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    
# path('last-update', LastUpdateView.as_view(), name='last-update'),
class LastUpdateView(APIView):
    def get(self, request):
        last_update = LastUpdate.objects.first()
        if last_update:
            last_updated = last_update.last_updated
            last_active = last_update.last_active
            if last_active:
                response_data = {
                    "last_updated": last_updated,
                    "last_active": last_active,
                }
            else:
                response_data = {
                    "last_updated": last_updated,
                    "last_active": "Not available",
                }
            return Response(response_data)
        else:
            return Response({
                "last_updated": "Never",
                "last_active": "Not available",
            })

# path('last-update-stream/', LastUpdate.as_view(), name='last-update-stream')
def last_update_stream(request):
    def last_update_event_stream():
        response = HttpResponse(content_type='text/event-stream')
        response['Content-Type'] = 'text/event-stream'
        response['Cache-Control'] = 'no-cache'
        response['Connection'] = 'keep-alive'
        last_updated_value = None
        last_active_value = None
        max_retries = 5
        retry_count = 0
        while True:
            try:
                new_data = LastUpdate.objects.first()
                if new_data:
                    if (new_data.last_updated != last_updated_value or
                        new_data.last_active != last_active_value):
                        last_updated_value = new_data.last_updated
                        last_active_value = new_data.last_active
                        data = {
                            'message': 'New update',
                            'last_updated': str(new_data.last_updated),
                            'last_active': str(new_data.last_active)
                        }
                        yield f"data: {json.dumps(data)}\n\n"
                    else:
                        current_time = time.time()
                        last_active_time = time.mktime(new_data.last_active.timetuple())
                        time_difference = current_time - last_active_time
                        if time_difference > 300:  # 300 seconds = 5 minutes
                            no_update_data = {
                                'message': 'No update in over 5 minutes',
                                'last_active': str(new_data.last_active)
                            }
                            yield f"data: {json.dumps(no_update_data)}\n\n"
                        else:
                            time.sleep(120)  # Sleep for 150 seconds
                else:
                    yield "data: No LastUpdate record found\n\n"
                    time.sleep(120)
            except Exception as e:
                print(f"Error in event_stream: {str(e)}")
                retry_count += 1
                if retry_count >= max_retries:
                    print("Maximum retries reached, stopping the event stream.")
                    break
                time.sleep(300)  # 300 seconds = 5 minutes
    return StreamingHttpResponse(last_update_event_stream(), content_type='text/event-stream')