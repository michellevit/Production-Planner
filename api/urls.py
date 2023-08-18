from django.urls import path
from . import views

urlpatterns = [
    path("orders/", views.getRoutes, name="orders-list"),
    path("", views.getRoutes, name="routes"),
]
