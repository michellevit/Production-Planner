# Generated by Django 4.2.4 on 2023-09-25 23:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_alter_order_shipped'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='minimized_status',
            field=models.BooleanField(default=False),
        ),
    ]
