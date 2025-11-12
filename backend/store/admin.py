from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Product, Order, OrderItem, CustomerDetails


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('id','username','email','role','is_active')
    list_filter = ('role','is_active')
    fieldsets = (
    (None, {'fields': ('username','email','password','role','is_active')}),
    ('Personal info', {'fields': ('first_name','last_name')}),
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id','name','price','stock','created_at')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id','user','total','created_at')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id','order','product','quantity','price')


@admin.register(CustomerDetails)
class CustomerDetailsAdmin(admin.ModelAdmin):
    list_display = ('user','phone')