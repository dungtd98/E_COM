from django.urls import path
from rest_framework import routers
from .views import (
    BrandViewset, 
    CategoryViewset, 
    ProductViewset,
    ShippingAddressViewset,
    OrderViewset,
    OrderItemViewset,
    UserViewset
    )
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_admin'] = user.is_superuser
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


router = routers.SimpleRouter()
router.register(r'brands', BrandViewset, basename='brand')
router.register(r'categories', CategoryViewset, basename='category')
router.register(r'products', ProductViewset, basename='product')
router.register(r'address', ShippingAddressViewset, basename='address')
router.register(r'orders', OrderViewset, basename='order')
router.register(r'orderitems', OrderItemViewset, basename='orderitem')
router.register(r'users', UserViewset, basename='user')
urlpatterns=[
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ]
urlpatterns+=router.urls