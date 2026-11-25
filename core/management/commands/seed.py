from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from core.models import Property

DATA = [
    ("Skyline 3BHK with Park View", "Bandra West, Mumbai", 38500000, 1450, "apartment", 3, 3, "Corner unit on the 18th floor with park-facing balconies, modular kitchen, two covered parking slots and a clubhouse downstairs."),
    ("Courtyard Villa near Lake", "Whitefield, Bengaluru", 24200000, 3200, "villa", 4, 4, "Independent villa built around a private courtyard. Teak flooring, solar water heating, rain harvesting and a home office."),
    ("Corner Plot, Gated Layout", "Sanand, Ahmedabad", 5800000, 2400, "plot", 0, 0, "East-facing, clear-title plot in a gated layout with wide roads, underground drainage and a landscaped entry."),
    ("Riverside 2BHK Apartment", "Koregaon Park, Pune", 12900000, 1020, "apartment", 2, 2, "Quiet two-bedroom flat in a low-rise block, walking distance from cafes and the river promenade."),
    ("Ground-floor Retail Space", "C-Scheme, Jaipur", 17600000, 900, "commercial", 0, 1, "High-footfall frontage on a main road. Double-height ceiling, 3-phase power and loading access at the rear."),
    ("Garden Bungalow with Annexe", "Alkapuri, Vadodara", 31000000, 4100, "villa", 5, 5, "Mature garden, separate guest annexe, covered veranda and staff quarter. Fully renovated in 2024."),
    ("Studio near Tech Park", "Hinjewadi, Pune", 4900000, 480, "apartment", 1, 1, "Compact furnished studio ten minutes from the IT park. Good for first-time buyers or rental income."),
    ("Office Floor, Business Bay", "SG Highway, Ahmedabad", 42000000, 5200, "commercial", 0, 4, "Full floor with open plan, six cabins, server room and 12 reserved parking spaces."),
]


class Command(BaseCommand):
    help = "Create demo properties, an admin and a demo user"

    def handle(self, *a, **k):
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@example.com", "admin123")
        if not User.objects.filter(username="demo").exists():
            User.objects.create_user("demo", "demo@example.com", "demo123")
        if not Property.objects.exists():
            for i, (t, l, p, s, ty, b, ba, d) in enumerate(DATA):
                Property.objects.create(title=t, location=l, price=p, size_sqft=s, property_type=ty,
                                        bedrooms=b, bathrooms=ba, description=d,
                                        image_url=f"https://picsum.photos/seed/estate{i}/900/650")
        self.stdout.write(self.style.SUCCESS("Seeded. admin/admin123  demo/demo123"))
