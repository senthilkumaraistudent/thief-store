from django.db import models


class Product(models.Model):
    """
    One row = one product listing. For ALPHA_Z, most products have
    stock = 1 (a single physical piece) — that's just a normal integer
    value here, no special "single item" logic needed.
    """

    CATEGORY_CHOICES = [
        ("T-Shirts", "T-Shirts"),
        ("Shirts", "Shirts"),
        ("Jeans", "Jeans"),
        ("Formal Pants", "Formal Pants"),
    ]

    product_code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)

    fabric = models.CharField(max_length=100, blank=True)
    gsm = models.CharField(max_length=20, blank=True)
    fit = models.CharField(max_length=50, blank=True)
    size = models.CharField(max_length=20)
    description = models.TextField(blank=True)

    stock = models.PositiveIntegerField(default=1)
    visible = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.product_code} — {self.name}"

    @property
    def is_available(self):
        """True only when it should be orderable on the public site."""
        return self.stock > 0 and self.visible


class ProductImage(models.Model):
    """
    A product can have several photos. The first one (lowest `order`)
    is used as the main/listing image.
    """
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Image for {self.product.product_code}"
