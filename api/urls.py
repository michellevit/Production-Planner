from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('all-orders/', OrderListView.as_view(), name='all-orders'),
    path('open-orders/', OpenOrdersListView.as_view(), name='open-orders'),
    path('open-orders-search/', SearchOpenOrdersListView.as_view(), name='open-orders-search'),
    path('all-orders-search/', SearchAllOrdersListView.as_view(), name='all-orders-search'),
    path('open-orders/<int:pk>/', OrderDetailView.as_view(), name='open-order-detail'),
    path('all-orders/<int:pk>/', OrderDetailView.as_view(), name='all-order-detail'),
    path('reports/', OrderReportUploadView.as_view(), name="reports"),
    path('dimensions/', DimensionView.as_view(), name="dimensions"),
    path('dimensions/<int:pk>/', DimensionView.as_view()),]

# Example of OrderDetailView url: http://localhost:8000/open-orders/42/
# *don't forget the final slash character

# To use django admin - uncomment this:
# http://127.0.0.1:8000/admin/
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Pages w/ Pagination: 
# http://localhost:8000/open-orders/?page=1