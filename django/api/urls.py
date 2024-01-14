from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('all-orders/', OrderListView.as_view(), name='all-orders'),
    path('open-orders/', OpenOrdersListView.as_view(), name='open-orders'),
    path('orders-filtered/', FilteredOrdersListView.as_view(), name='orders-filtered'),
    path('open-orders/<int:pk>/', OrderDetailView.as_view(), name='open-order-detail'),
    path('all-orders/<int:pk>/', OrderDetailView.as_view(), name='all-order-detail'),
    path('all-orders-create/', CreateOrderView.as_view(), name='create-order'),
    path('dimensions/', DimensionView.as_view(), name="dimensions"),
    path('dimensions/<int:pk>/', DimensionView.as_view()),
    path('fetch-matching-packages/', FetchMatchingPackagesView.as_view(), name='fetch-matching-packages'),
    path('products/', ProductView.as_view(), name='products'),
    path('last-update/', LastUpdateView.as_view(), name='last-update'),
    path('latest-upload-stream/', latest_upload_stream, name='latest-upload-stream'),
]

    

