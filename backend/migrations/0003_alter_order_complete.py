# Generated by Django 4.1.2 on 2022-10-16 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_order_customer_email_shippingaddress_orderitem_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='complete',
            field=models.BooleanField(default=False),
        ),
    ]