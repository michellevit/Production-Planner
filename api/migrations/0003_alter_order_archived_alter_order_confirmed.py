# Generated by Django 4.2.4 on 2023-08-07 23:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='archived',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='order',
            name='confirmed',
            field=models.BooleanField(default=False),
        ),
    ]