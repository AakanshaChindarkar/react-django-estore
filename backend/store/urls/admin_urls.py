from django.urls import path, include
from rest_framework.routers import DefaultRouter
from store.views.admin_views import AdminProductViewSet, AdminOrderViewSet, AdminUserViewSet, AdminDashboardStats
from store.views.auth_views import MyTokenObtainPairView  # custom JWT view

router = DefaultRouter()
router.register('products', AdminProductViewSet, basename='admin-products')
router.register('orders', AdminOrderViewSet, basename='admin-orders')
router.register('users', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('', include(router.urls)),  # admin ViewSets
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT login
    path("dashboard/", AdminDashboardStats.as_view()),
]
