# Generated by Django 4.2.4 on 2023-10-11 03:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_alter_dimension_height_alter_dimension_length_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='delay_tbd',
            field=models.BooleanField(default=False),
        ),
    ]
