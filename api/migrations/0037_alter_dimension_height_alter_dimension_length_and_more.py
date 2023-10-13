# Generated by Django 4.2.4 on 2023-10-13 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_alter_order_delay_tbd'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dimension',
            name='height',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='dimension',
            name='length',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='dimension',
            name='width',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='order',
            name='delay_tbd',
            field=models.BooleanField(default=False, null=True),
        ),
    ]
