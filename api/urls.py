from django.urls import path
from .views import OrderView
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='welcome.html'), name='home'),
    path('open-orders/', OrderView.as_view(), name='open-orders')
]

