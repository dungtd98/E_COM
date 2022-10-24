from django.contrib import admin
from .models import (
    Brand, 
    Category, 
    Product,
    ShippingAddress,
    Order,
    OrderItem
)
from django.contrib.auth.models import User
# Register your models here.

admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Product)
admin.site.register(ShippingAddress)
admin.site.register(Order)
admin.site.register(OrderItem)