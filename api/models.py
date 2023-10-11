from django.db import models

class Order(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    order_number = models.CharField(max_length=100)
    backorder = models.BooleanField(default=False)
    backorder_number = models.IntegerField(default=0)
    ship_date = models.DateField(null=True, blank=True)
    delay_date = models.DateField(null=True, default=None)
    delay_tbd = models.BooleanField(null=True, default=False)
    customer_name = models.CharField(max_length=100)
    item_type_dict = models.JSONField(default=dict)
    item_subtype_dict = models.JSONField(default=dict)
    packages_array = models.JSONField(default=list, null=True, blank=True)
    notes_array = models.JSONField(default=list, null=True, blank=True)
    minimized_status = models.BooleanField(default=True)
    quote = models.BooleanField(default=False)
    ready = models.BooleanField(default=False)
    shipped = models.BooleanField(default=False, db_index=True)
    def __str__(self):
        return self.order_number[0:50]
    

class OrderReport(models.Model):
    submitted_date = models.DateTimeField(auto_now=True)
    file_name = models.CharField(max_length=255)
    def __str__(self):
        return self.file_name[:50]
    class Meta:
        verbose_name_plural = "Order Reports"
    def save(self, *args, **kwargs):
        if OrderReport.objects.count() >= 10:
            oldest_entry = OrderReport.objects.order_by('submitted_date').first()
            oldest_entry.delete()
        super(OrderReport, self).save(*args, **kwargs)


class Dimension(models.Model):
    length = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    package_size = models.CharField(max_length=50)
    def __str__(self):
        return self.package_size[0:50]
    class Meta:
        verbose_name_plural = "Dimensions"

