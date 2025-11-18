from rest_framework import generics, permissions, status
from ..models import Product, Order
from ..serializers import ProductSerializer, OrderSerializer, RegisterSerializer
from rest_framework.response import Response


class ProductListAPI(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    authentication_classes = [] 
    permission_classes = [permissions.AllowAny]
    

class ProductDetailAPI(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [] 
    permission_classes = [permissions.AllowAny]


class UserOrdersAPI(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class CreateOrderAPI(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegisterViewAPI(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny] 
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email
        }, status=status.HTTP_201_CREATED)