# Generated by Django 4.2.4 on 2023-09-20 22:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_delete_closedorders_delete_openorders'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='shipped',
            field=models.BooleanField(db_index=True, default=False),
        ),
    ]
