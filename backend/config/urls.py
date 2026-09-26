from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from products.views import AdminLoginView

urlpatterns = [
    # Django's own built-in admin (handy fallback, separate from your React admin)
    path("admin/", admin.site.urls),

    # Auth
    path("api/auth/login/", AdminLoginView.as_view(), name="admin-login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token-refresh"),

    # Products API (public + admin routes are both registered inside products.urls)
    path("api/", include("products.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
