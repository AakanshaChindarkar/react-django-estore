from django.urls import path
from store.views.public_views import ProductListAPI, ProductDetailAPI, UserOrdersAPI, CreateOrderAPI,RegisterViewAPI


urlpatterns = [
    path('products/', ProductListAPI.as_view()),
    path('products/<int:pk>/', ProductDetailAPI.as_view()),
    path('orders/', CreateOrderAPI.as_view()),
    path('my-orders/', UserOrdersAPI.as_view()),
    path("register/", RegisterViewAPI.as_view(), name="register"),
]