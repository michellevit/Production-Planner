from django.urls import path
from .views import OrderView, DeleteOrderView

urlpatterns = [
    path('open-orders/', OrderView.as_view(), name='open-orders'),
    path('open-orders/<int:pk>/', DeleteOrderView.as_view(), name='delete-order'),
]