from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Product, ProductImage
from .serializers import ProductSerializer, ProductImageSerializer


# ---------------------------------------------------------------------------
# Auth — admin login issues a JWT access + refresh token pair.
# Only staff users (set via `python manage.py createsuperuser`) can log in.
# ---------------------------------------------------------------------------
class StaffOnlyTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("This account does not have admin access.")
        return data


class AdminLoginView(TokenObtainPairView):
    serializer_class = StaffOnlyTokenSerializer


# ---------------------------------------------------------------------------
# Public API — anonymous, read-only, respects the stock/visible rules.
#   GET /api/products/            -> list  (stock > 0 AND visible = True only)
#   GET /api/products/<id>/       -> detail (visible = True; shows SOLD OUT
#                                     items too, so an old shared link still
#                                     opens and clearly shows it's sold out)
#   Optional filter: /api/products/?category=Shirts
# ---------------------------------------------------------------------------
class PublicProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Product.objects.filter(visible=True)
        if self.action == "list":
            qs = qs.filter(stock__gt=0)
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


# ---------------------------------------------------------------------------
# Admin API — full CRUD, requires a valid staff JWT.
#   /api/admin/products/                -> list all (any stock/visibility), create
#   /api/admin/products/<id>/           -> retrieve, update (PATCH), delete
#   /api/admin/products/<id>/images/    -> POST to upload a photo
#   /api/admin/products/<id>/images/<image_id>/ -> DELETE to remove a photo
# ---------------------------------------------------------------------------
class AdminProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Product.objects.all()

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser, FormParser],
            url_path="images")
    def upload_image(self, request, pk=None):
        product = self.get_object()
        order = product.images.count()
        img = ProductImage.objects.create(
            product=product, image=request.FILES["image"], order=order
        )
        return Response(ProductImageSerializer(img).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path=r"images/(?P<image_id>\d+)")
    def delete_image(self, request, pk=None, image_id=None):
        product = self.get_object()
        ProductImage.objects.filter(product=product, id=image_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
