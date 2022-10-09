from django.urls import path, include
from .views import OrderView

urlpatterns = [
    path('open_orders', OrderView.as_view()),
]
