from django.conf import settings
from django.db import models


class Property(models.Model):
    TYPES = [("apartment", "Apartment"), ("villa", "Villa"), ("plot", "Plot"), ("commercial", "Commercial")]
    STATUS = [("available", "Available"), ("sold", "Sold")]

    title = models.CharField(max_length=150)
    location = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    size_sqft = models.PositiveIntegerField()
    property_type = models.CharField(max_length=20, choices=TYPES, default="apartment")
    bedrooms = models.PositiveSmallIntegerField(default=0)
    bathrooms = models.PositiveSmallIntegerField(default=0)
    description = models.TextField()
    image_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="available")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "properties"

    def __str__(self):
        return self.title


class Enquiry(models.Model):
    STATUS = [("new", "New"), ("contacted", "Contacted"), ("closed", "Closed")]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enquiries")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="enquiries")
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default="new")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "enquiries"

    def __str__(self):
        return f"{self.name} - {self.property}"
