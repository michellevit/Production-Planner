from django.contrib import admin

# Register your models here.


from .models import Note


class NoteAdmin(admin.ModelAdmin):
    # Customize the display of the model in the admin interface
    list_display = (
        "body",
        "updated",
        "created",
    )  # Replace field1, field2, and field3 with your model's fields

    # Add filters to the right side of the admin page
    list_filter = (
        "body",
        "updated",
        "created",
    )  # Replace field1 and field2 with your model's fields

    # Add search functionality to the admin page
    search_fields = (
        "body",
        "updated",
        "created",
    )  # Replace field1 and field2 with your model's fields


admin.site.register(Note, NoteAdmin)
