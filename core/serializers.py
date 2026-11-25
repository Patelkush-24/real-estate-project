import re
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Property, Enquiry


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "is_staff")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {"email": {"required": True}}

    def validate_email(self, v):
        if User.objects.filter(email__iexact=v).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return v

    def create(self, data):
        return User.objects.create_user(**data)


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = "__all__"
        read_only_fields = ("created_at",)

    def validate_price(self, v):
        if v <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return v

    def validate_size_sqft(self, v):
        if v <= 0:
            raise serializers.ValidationError("Size must be greater than zero.")
        return v


class EnquirySerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source="property.title", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Enquiry
        fields = ("id", "property", "property_title", "user_email", "name", "phone",
                  "message", "status", "created_at")
        read_only_fields = ("created_at",)

    def validate_phone(self, v):
        if not re.fullmatch(r"\+?\d{10,13}", v):
            raise serializers.ValidationError("Enter a valid phone number (10-13 digits).")
        return v

    def validate_message(self, v):
        if len(v.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return v
