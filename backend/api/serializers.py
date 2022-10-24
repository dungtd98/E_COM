from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from ..models import (
    Brand, 
    Category, 
    Product,
    ShippingAddress,
    Order,
    OrderItem
    )
UserModel = get_user_model()
class BrandSerializer(ModelSerializer):
    class Meta:
        model=Brand
        fields='__all__'

class CategorySerializer(ModelSerializer):
    class Meta:
        model=Category
        fields='__all__'

class ProductSerializer(ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'

class ShipAddressSerializer(ModelSerializer):
    
    class Meta:
        model = ShippingAddress
        fields = '__all__'

class OrderSerializer(ModelSerializer):
    order_total_cost = serializers.ReadOnlyField()
    order_total_items = serializers.ReadOnlyField()
    # order_item = serializers.ReadOnlyField()
    class Meta:
        model=Order
        fields='__all__'

class OrderItemSerializer(ModelSerializer):
    total = serializers.ReadOnlyField()
    class Meta:
        model=OrderItem
        fields='__all__'

class UserSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    def create(self, validated_data):
        user = UserModel.objects.create(
            username = validated_data['username'],
            password = validated_data['password']
        )
        return user
    
    class Meta:
        model = UserModel
        fields = ['id','username','password','is_superuser']