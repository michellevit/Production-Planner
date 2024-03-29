# Generated by Django 4.2.4 on 2023-10-11 01:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0030_remove_dimension_index_position_dimension_height_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dimension',
            name='height',
            field=models.IntegerField(max_length=10),
        ),
        migrations.AlterField(
            model_name='dimension',
            name='length',
            field=models.IntegerField(max_length=10),
        ),
        migrations.AlterField(
            model_name='dimension',
            name='package_size',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='dimension',
            name='width',
            field=models.IntegerField(max_length=10),
        ),
    ]
