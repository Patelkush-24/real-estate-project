from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count, Q, Sum
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import Enquiry, Property
from .serializers import EnquirySerializer, PropertySerializer, RegisterSerializer, UserSerializer


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or bool(request.user and request.user.is_staff)


def auth_payload(user):
    token, _ = Token.objects.get_or_create(user=user)
    return {"token": token.key, "user": UserSerializer(user).data}


@api_view(["POST"])
def register(request):
    s = RegisterSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    return Response(auth_payload(s.save()), status=status.HTTP_201_CREATED)


@api_view(["POST"])
def login(request):
    user = authenticate(username=request.data.get("username"), password=request.data.get("password"))
    if not user:
        return Response({"detail": "Incorrect username or password."}, status=status.HTTP_400_BAD_REQUEST)
    return Response(auth_payload(user))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def stats(request):
    if request.user.is_staff:
        by_status = {r["status"]: r["n"] for r in Enquiry.objects.values("status").annotate(n=Count("id"))}
        return Response({
            "properties": Property.objects.count(),
            "available": Property.objects.filter(status="available").count(),
            "enquiries": Enquiry.objects.count(),
            "new_enquiries": by_status.get("new", 0),
            "users": User.objects.filter(is_staff=False).count(),
            "portfolio_value": Property.objects.filter(status="available").aggregate(t=Sum("price"))["t"] or 0,
        })
    mine = Enquiry.objects.filter(user=request.user)
    return Response({"enquiries": mine.count(), "open": mine.exclude(status="closed").count()})


class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs, p = Property.objects.all(), self.request.query_params
        if p.get("q"):
            qs = qs.filter(Q(title__icontains=p["q"]) | Q(location__icontains=p["q"]) | Q(description__icontains=p["q"]))
        if p.get("type"):
            qs = qs.filter(property_type=p["type"])
        if p.get("min_price"):
            qs = qs.filter(price__gte=p["min_price"])
        if p.get("max_price"):
            qs = qs.filter(price__lte=p["max_price"])
        if p.get("bedrooms"):
            qs = qs.filter(bedrooms__gte=p["bedrooms"])
        if p.get("ordering") in ("price", "-price", "-created_at", "size_sqft", "-size_sqft"):
            qs = qs.order_by(p["ordering"])
        return qs


class EnquiryViewSet(viewsets.ModelViewSet):
    serializer_class = EnquirySerializer

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Enquiry.objects.select_related("property", "user")
        return qs if self.request.user.is_staff else qs.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status="new")
