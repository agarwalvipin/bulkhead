---
description: Django patterns, ORM, views, middleware, and admin
category: frameworks
auto_load:
  - when: "django"
    in: ["dependencies"]
  - when: "manage.py"
    in: ["files"]
related_skills:
  - languages/python.md
  - practices/security.md
---

# Django

Patterns and best practices for Django applications.

---

## Project Structure

```
myproject/
├── manage.py
├── myproject/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── users/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── serializers.py
│   │   └── tests/
│   └── orders/
├── templates/
└── static/
```

---

## Models

### Model Definition

```python
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """Custom user model."""
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    
    class Meta:
        db_table = "users"
        ordering = ["-date_joined"]

class Order(models.Model):
    """Order model with relationships."""
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        SHIPPED = "shipped", "Shipped"
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["status"]),
        ]
```

---

## QuerySet Patterns

### Efficient Queries

```python
# ✅ Good: Select related for ForeignKey
orders = Order.objects.select_related("user").filter(status="pending")

# ✅ Good: Prefetch for reverse/M2M relations
users = User.objects.prefetch_related("orders").all()

# ✅ Good: Only fetch needed fields
Order.objects.only("id", "total", "status")

# ❌ Bad: N+1 queries
for order in Order.objects.all():
    print(order.user.email)  # Query per iteration
```

### Custom Managers

```python
class OrderQuerySet(models.QuerySet):
    def pending(self):
        return self.filter(status="pending")
    
    def for_user(self, user):
        return self.filter(user=user)
    
    def with_totals(self):
        return self.annotate(
            item_count=Count("items"),
            subtotal=Sum("items__price"),
        )

class OrderManager(models.Manager):
    def get_queryset(self):
        return OrderQuerySet(self.model, using=self._db)
    
    def pending(self):
        return self.get_queryset().pending()

class Order(models.Model):
    objects = OrderManager()
```

---

## Views

### Class-Based Views

```python
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin

class OrderListView(LoginRequiredMixin, ListView):
    model = Order
    template_name = "orders/list.html"
    paginate_by = 20
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related("user")

class OrderDetailView(LoginRequiredMixin, DetailView):
    model = Order
    
    def get_queryset(self):
        # Only allow viewing own orders
        return Order.objects.filter(user=self.request.user)
```

### Django REST Framework

```python
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        order.status = "cancelled"
        order.save()
        return Response({"status": "cancelled"})
```

---

## Serializers

```python
from rest_framework import serializers

class OrderSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ["id", "user_email", "status", "total", "items", "created_at"]
        read_only_fields = ["id", "created_at"]
    
    def validate_total(self, value):
        if value <= 0:
            raise serializers.ValidationError("Total must be positive")
        return value
```

---

## Middleware

```python
import time
import logging

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        start = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start
        logger.info(
            "request",
            extra={
                "method": request.method,
                "path": request.path,
                "status": response.status_code,
                "duration_ms": duration * 1000,
            },
        )
        
        return response
```

---

## Signals

```python
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

@receiver(post_save, sender=Order)
def order_created(sender, instance, created, **kwargs):
    if created:
        send_order_confirmation.delay(instance.id)

# ✅ Better: Use explicit calls in save()
class Order(models.Model):
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.send_confirmation()
```

---

## Admin

```python
from django.contrib import admin

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "status", "total", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["user__email", "id"]
    readonly_fields = ["created_at", "updated_at"]
    raw_id_fields = ["user"]  # For large ForeignKey
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")
```

---

## Testing

```python
from django.test import TestCase
from rest_framework.test import APITestCase
from model_bakery import baker

class OrderAPITest(APITestCase):
    def setUp(self):
        self.user = baker.make("users.User")
        self.client.force_authenticate(user=self.user)
    
    def test_list_orders_returns_own_orders(self):
        baker.make("orders.Order", user=self.user, _quantity=3)
        baker.make("orders.Order")  # Other user's order
        
        response = self.client.get("/api/orders/")
        
        assert response.status_code == 200
        assert len(response.data) == 3
    
    def test_create_order_sets_user(self):
        response = self.client.post("/api/orders/", {"total": "99.99"})
        
        assert response.status_code == 201
        assert Order.objects.get().user == self.user
```

---

## Anti-patterns

| Anti-pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| N+1 queries | Performance | select_related, prefetch_related |
| Fat views | Untestable | Service layer, model methods |
| Signals everywhere | Hidden logic | Explicit method calls |
| No indexes | Slow queries | Meta.indexes |
| settings.py secrets | Security | Environment variables |

---

## References

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Two Scoops of Django](https://www.feldroy.com/books/two-scoops-of-django-3-x)
