from django.urls import path
from .views import *

urlpatterns = [
    path('all-orders/', OrderListView.as_view(), name='all-orders'),
    path('open-orders/', OpenOrdersListView.as_view(), name='open-orders'),
    path('open-orders/<int:pk>/', OrderDetailView.as_view(), name='open-order-detail'),
    path('closed-orders/', ClosedOrdersListView.as_view(), name='closed-orders'),
    path('closed-orders/<int:pk>/', OrderDetailView.as_view(), name='closed-order-detail'),  # Use OrderDetailView for both
]