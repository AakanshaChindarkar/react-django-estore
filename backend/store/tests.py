from rest_framework.test import APITestCase
from rest_framework import status
from .models import Product

class ProductListTest(APITestCase):
    def setUp(self):
        Product.objects.create(name='Television', price=80300, stock=5)

    def test_get_product_list(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.json()) > 0)
