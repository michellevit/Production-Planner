# Generated by Django 4.2.4 on 2023-08-11 07:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_order_ship_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='backorder',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='backorder_number',
            field=models.CharField(default='0', max_length=10),
        ),
    ]
