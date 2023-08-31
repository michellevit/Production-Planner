from django.urls import path
from .views import OrderListView, OrderDetailView

urlpatterns = [
    path('open-orders/', OrderListView.as_view(), name='open-orders'),
    path('open-orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]