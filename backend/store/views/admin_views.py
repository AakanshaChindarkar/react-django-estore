from rest_framework import viewsets
from ..models import Product, Order, User
from ..serializers import ProductSerializer, OrderSerializer, AdminUserSerializer
from ..permissions import IsAdmin, IsStaffOrAdmin
from ..decorators import admin_required
from rest_framework.response import Response 
from rest_framework.views import APIView
from django.db.models import Sum, F

# Admin Products
class AdminProductViewSet(viewsets.ModelViewSet):
    queryset =Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrAdmin]

    @admin_required
    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        if product.orderitem_set.exists():
            product.is_active = False
            product.save()
            return Response({"detail": "Product marked inactive, cannot delete because of existing orders."})
        return super().destroy(request, *args, **kwargs)


# Admin Orders (read-only)
class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return (
            Order.objects
            .select_related('user')
            .prefetch_related('items__product')
        )


# Admin Users (full CRUD)
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]

    @admin_required
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

# Admin dashboard
class AdminDashboardStats(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total_users = User.objects.count()
        total_products = Product.objects.filter(is_active=True).count()
        total_orders = Order.objects.count()

        total_revenue = (
            Order.objects.aggregate(
                revenue=Sum(F("items__quantity") * F("items__price"))
            )["revenue"] or 0
        )

        return Response({
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": total_revenue
        })
