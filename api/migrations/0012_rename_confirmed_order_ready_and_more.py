# Generated by Django 4.2.4 on 2023-08-30 21:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_remove_order_weight'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='confirmed',
            new_name='ready',
        ),
        migrations.RenameField(
            model_name='order',
            old_name='archived',
            new_name='shipped',
        ),
    ]