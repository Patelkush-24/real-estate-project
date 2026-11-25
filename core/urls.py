from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("properties", views.PropertyViewSet, basename="property")
router.register("enquiries", views.EnquiryViewSet, basename="enquiry")

urlpatterns = [
    path("auth/register/", views.register),
    path("auth/login/", views.login),
    path("auth/logout/", views.logout),
    path("stats/", views.stats),
    path("", include(router.urls)),
]
