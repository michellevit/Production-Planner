from .models import * 
from .serializers import OrderSerializer, OrderReportSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser
from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .scripts.check_order_report import process_uploaded_report




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

    def post(self, request, *args, **kwargs):
        file_serializer = OrderReportSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.validated_data['submitted_date'] = timezone.now()
            uploaded_file = request.FILES.get("file")
            file_name = uploaded_file.name
            file_serializer.validated_data['file_name'] = file_name
            file_serializer.save()
            process_uploaded_report(file_name)
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)