from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    BrandSerializer, 
    CategorySerializer, 
    ProductSerializer,
    ShipAddressSerializer,
    OrderSerializer,
    OrderItemSerializer,
    UserSerializer
    )
from ..models import (
    Brand,
    Category,
    Product,
    ShippingAddress,
    Order,
    OrderItem
)
from rest_framework import filters
UserModel = get_user_model()

class BrandViewset(ModelViewSet):
    serializer_class=BrandSerializer
    queryset = Brand.objects.all()

class CategoryViewset(ModelViewSet):
    serializer_class=CategorySerializer
    queryset = Category.objects.all()

class ProductViewset(ModelViewSet):
    serializer_class=ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name',]
    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category')  # type: ignore
        if category is not None:
            queryset = queryset.filter(category=category)
        return queryset

class ShippingAddressViewset(ModelViewSet):
    serializer_class=ShipAddressSerializer
    
    def get_queryset(self):
        queryset = ShippingAddress.objects.all()
        userID = self.request.query_params.get('userID') # type: ignore
        if userID is not None:
            queryset = queryset.filter(customer=userID)
        return queryset

class OrderViewset(ModelViewSet):
    serializer_class=OrderSerializer
    queryset = Order.objects.all()

class OrderItemViewset(ModelViewSet):
    serializer_class=OrderItemSerializer
    
    def get_queryset(self):
        queryset = OrderItem.objects.all()
        orderID = self.request.query_params.get('order') # type: ignore
        if orderID is not None:
            queryset = queryset.filter(order=orderID)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, 
            many=isinstance(request.data, list))
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class UserViewset(ModelViewSet):
    serializer_class = UserSerializer
    queryset = UserModel.objects.all()