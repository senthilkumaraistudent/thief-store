from django.contrib import admin
from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["product_code", "name", "category", "price", "stock", "visible", "updated_at"]
    list_filter = ["category", "visible"]
    search_fields = ["product_code", "name"]
    inlines = [ProductImageInline]
