from django.contrib import admin
from .models import Property, Enquiry


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("title", "location", "price", "property_type", "status")
    list_filter = ("property_type", "status")
    search_fields = ("title", "location")


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "property", "phone", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("name", "phone", "property__title")
