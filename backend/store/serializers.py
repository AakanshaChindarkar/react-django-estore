from rest_framework import serializers
from .models import Product, Order, OrderItem, User, CustomerDetails
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email','is_admin']

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()  # must be declared
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'is_active']  
        read_only_fields = ['id', 'price']

    def get_product_name(self, obj):
        return obj.product.name

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total', 'created_at', 'items', 'is_active']
        read_only_fields = ['id', 'user', 'created_at', 'total']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        # Fetch all products in one query to avoid N+1
        product_ids = [item['product'].id for item in items_data]
        products_map = {p.id: p for p in Product.objects.filter(id__in=product_ids)}

        with transaction.atomic():
            order = Order.objects.create(user=user, total=0)
            total = 0

            for item_data in items_data:
                product = products_map[item_data['product'].id]
                quantity = item_data['quantity']

                # Validate stock
                if product.stock < quantity:
                    raise serializers.ValidationError(f"Not enough stock for {product.name}")

                line_price = product.price
                total += line_price * quantity

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=line_price
                )

                #  Decrement stock
                product.stock -= quantity

            #  Bulk update stock in one query
            Product.objects.bulk_update(products_map.values(), ['stock'])

            # Update total
            order.total = total
            order.save()

            subject = f"Invoice for Order #{order.id}"
            body = f"Dear {user.username},\n\nThank you for your order #{order.id}!\nTotal Amount: ₹{order.total}\n\nWe’ll process it soon."
            email = EmailMessage(
                subject=subject,
                body=body,
                from_email="noreply@example.com",
                to=[user.email],
            )
            email.send()

            return order

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','role']

class CustomerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerDetails
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')  # remove confirm password
        user = User.objects.create_user(**validated_data)
        return user

# For admin logging in
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role  # include role in response
        data['is_staff'] = self.user.is_staff
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        token['is_staff'] = user.is_staff
        token['username'] = user.username
        return token
    
class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "is_staff", "role"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
