from email.policy import default
from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

UserModel = get_user_model()

# class Customer(models.Model):
#     user = models.OneToOneField(UserModel, null=True, blank=True, on_delete=models.CASCADE )
#     name = models.CharField(max_length=200, null=True)
#     email = models.CharField(max_length=200, default=None)
#     def __str__(self):
#         return self.name

class Brand(models.Model):
    name = models.CharField(max_length=200,blank=False, verbose_name = 'Brand name:')
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=200,blank=False, verbose_name = 'Category:')
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200, blank=False)
    image = models.ImageField(upload_to='products', blank=True)
    price = models.FloatField(blank=False)
    brand = models.ForeignKey(Brand, related_name = 'brand_products',on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(Category, related_name = 'cate_products',on_delete=models.SET_NULL, null=True)
    decription = models.TextField(blank=False)
    def __str__(self):
        return self.name

class ShippingAddress(models.Model):
    customer = models.ForeignKey(
        UserModel, 
        on_delete = models.SET_NULL, 
        blank=True, null=True,
        related_name = 'shipping_address'
    )
    address = models.CharField(max_length = 255, blank=False, null=False)
    district = models.CharField(max_length=255, blank=False, null=False)
    city = models.CharField(max_length = 255, blank=False)

class Order(models.Model):
    customer = models.ForeignKey(
        UserModel, 
        on_delete=models.SET_NULL,
        blank=True, null=True,
        related_name= 'customer_orders')
    address = models.ForeignKey(
        ShippingAddress,
        on_delete = models.CASCADE,
        blank=False, null=False,
        related_name= 'address_orders'
    )
    date_ordered = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False)
    def __str__(self):
        return 'order_'+ str(self.id) # type: ignore
    @property
    def order_total_cost(self):

        orderItems = self.order_items.all()  # type: ignore
        return sum([item.total for item in orderItems])
        
    @property
    def order_total_items(self):
        orderItems = self.order_items.all() # type: ignore
        return sum([item.quantity for item in orderItems])


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete = models.CASCADE,
        blank=False,
        related_name = 'order_items'
    )
    product = models.ForeignKey(
        Product,
        on_delete = models.SET_NULL,
        blank=True, null=True
    )
    quantity = models.IntegerField(default=1,null=True, blank=True)
    @property
    def total(self):
        total = self.product.price * self.quantity# type: ignore
        return total
    def __str__(self):
        return 'orderItem_'+str(self.id)# type: ignore