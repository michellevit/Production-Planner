from django.contrib import admin

# Register your models here.
from .models import Order, OrderReport

class OrderAdmin(admin.ModelAdmin):
    # Customize the display of the model in the admin interface
    list_display = (
        "id",
        "order_number",
        "ship_date",
        "customer_name",
        "shipped",
    )
    # Add filters to the right side of the admin page
    list_filter = (
        "order_number",
        "ship_date",
        "customer_name",
        "shipped",
    ) 
    # Add search functionality to the admin page
    search_fields = (
        "id",
        "order_number",
        "ship_date",
        "customer_name",
        "shipped",
    )  



class OrderReportAdmin(admin.ModelAdmin):
    # Customize the display of the model in the admin interface
    list_display = (
        "id",
        "submitted_date",
        "file_name",
    ) 
    # Add filters to the right side of the admin page
    list_filter = (
        "submitted_date",
        "file_name",
    )
    # Add search functionality to the admin page
    search_fields = (
        "id",
        "submitted_date",
        "file_name",
    ) 


# Register the models with the admin site (note: each model must be registered individually)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderReport, OrderReportAdmin)