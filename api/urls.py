from django.urls import path
from .views import OrderView

urlpatterns = [
    # path("", views.getRoutes, name="routes"),
    path('open-orders/', OrderView.as_view(), name='open-orders')
]

