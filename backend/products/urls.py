from rest_framework.routers import DefaultRouter
from .views import PublicProductViewSet, AdminProductViewSet

public_router = DefaultRouter()
public_router.register("products", PublicProductViewSet, basename="public-products")

admin_router = DefaultRouter()
admin_router.register("admin/products", AdminProductViewSet, basename="admin-products")

urlpatterns = public_router.urls + admin_router.urls
