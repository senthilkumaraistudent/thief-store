from rest_framework import serializers
from .models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "order"]


class ProductSerializer(serializers.ModelSerializer):
    """
    Used for both the public site and the admin dashboard — the admin
    frontend simply also receives `stock` and `visible` fields it's
    allowed to edit, which the public views never expose write access to.
    """
    images = ProductImageSerializer(many=True, read_only=True)
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "product_code", "name", "category", "price",
            "fabric", "gsm", "fit", "size", "description",
            "stock", "visible", "in_stock", "images",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_in_stock(self, obj):
        return obj.stock > 0

    def validate_product_code(self, value):
        return value.strip().upper()
