# Generated by Django 4.2.4 on 2023-09-07 02:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_order_notes_array_alter_order_packages_array'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='notes_array',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]