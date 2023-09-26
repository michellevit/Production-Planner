from django.contrib import admin

# Register your models here.
from .models import Order


class OrderAdmin(admin.ModelAdmin):
    # Customize the display of the model in the admin interface
    list_display = (
        "id",
        "order_number",
        "ship_date",
        "customer_name",
        "shipped",
    )  # Replace field1, field2, and field3 with your model's fields

    # Add filters to the right side of the admin page
    list_filter = (
        "order_number",
        "ship_date",
        "customer_name",
        "shipped",
    )  # Replace field1 and field2 with your model's fields

    # Add search functionality to the admin page
    search_fields = (
        "id",
        "order_number",
        "ship_date",
        "customer_name",
        "shipped",
    )  # Replace field1 and field2 with your model's fields


admin.site.register(Order, OrderAdmin)
