from django.shortcuts import render
#from django.http import HttpResponse
from rest_framework import generics
from .serializers import OrderSerializer
from .models import Order


# Create your views here.

class OrderView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

# def open(request):
#     return HttpResponse("Open Orders")


# def closed(request):
#     return HttpResponse("Closed Orders")